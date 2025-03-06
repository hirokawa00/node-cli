const fs = require('fs');
const path = require('path');
const { Parser } = require('node-sql-parser');

const sqlDirectory = path.join(__dirname, 'src/database/tables');
const outputFile = path.join(__dirname, 'output.md');
const parser = new Parser();

fs.readdir(sqlDirectory, (err, files) => {
  if (err) {
    console.error('Error reading directory:', err);
    return;
  }

  const sqlFiles = files.filter((file) => file.endsWith('.table.sql'));

  if (sqlFiles.length === 0) {
    console.log('No .table.sql files found.');
    return;
  }

  let markdownContent = '# テーブル定義一覧\n\n';

  sqlFiles.forEach((file) => {
    const filePath = path.join(sqlDirectory, file);
    console.log(`\nProcessing file: ${file}`);

    const sql = fs.readFileSync(filePath, 'utf8');

    try {
      const ast = parser.astify(sql, { database: 'TransactSQL' });

      // ** デバッグ用: JSON に整形して出力 **
      console.log(`\n=== AST Output for ${file} ===\n`);
      console.log(JSON.stringify(ast, null, 2));

      // AST が配列の場合、最初の要素を取得
      const tableAst = Array.isArray(ast) ? ast[0] : ast;

      if (tableAst.type !== 'create') {
        console.warn(`Skipping non-create statement in ${file}`);
        return;
      }

      const markdown = generateMarkdown(tableAst, sql);
      markdownContent += markdown + '\n\n';
    } catch (error) {
      console.error(`Parsing error in file ${file}:`, error.message);
    }
  });

  // ファイルに出力
  fs.writeFileSync(outputFile, markdownContent, 'utf8');
  console.log(`Markdown output saved to ${outputFile}`);
});

// マークダウン形式に変換する関数
function generateMarkdown(ast, sql) {
  const tableName = ast.table[0].table; // テーブル名の取得
  let markdown = `## ${tableName}\n\n`;

  // テーブル論理名の抽出
  let tableLogicName = '';
  const tableCommentLine = sql.match(/-- テーブル論理名:\s*(.*)/i);
  if (tableCommentLine) {
    tableLogicName = tableCommentLine[1].trim();
  }
  if (tableLogicName) {
    markdown += `**テーブル論理名:** ${tableLogicName}\n\n`;
  }

  markdown += '| カラム名              | データ型       | 制約                 | 論理名    |\n';
  markdown += '|----------------------|----------------|----------------------|-----------|\n';

  // カラム定義の処理
  ast.create_definitions.forEach((def) => {
    if (!def.column) return; // カラム定義でないものはスキップ

    const colName = def.column.column; // カラム名を取得
    const colDef = def.definition;

    let constraints = [];

    // データ型
    let dataType = colDef.dataType.toUpperCase();
    if (colDef.length) {
      dataType += `(${colDef.length})`;
    }

    // NOT NULL 制約
    if (def.nullable && def.nullable.type === 'not null') {
      constraints.push('NOT NULL');
    }

    // デフォルト値の取得
    if (def.default_val) {
      let defaultValue = '';
      if (def.default_val.value.type === 'function') {
        defaultValue = def.default_val.value.name.name[0].value + '()';
      } else if (def.default_val.value.type === 'number') {
        defaultValue = def.default_val.value.value;
      }
      constraints.push(`DEFAULT ${defaultValue}`);
    }

    // プライマリキー
    if (def.primary_key) {
      constraints.push('PRIMARY KEY');
    }

    // カラム論理名の抽出
    let columnLogicName = '';
    const columnCommentLine = sql.match(
      new RegExp(`-- カラム論理名:\\s*${colName}\\s*:\\s*(.*)`, 'i'),
    );
    if (columnCommentLine) {
      columnLogicName = columnCommentLine[1].trim();
    }

    markdown += `| ${colName} | ${dataType} | ${constraints.join(', ')} | ${columnLogicName} |\n`;
  });

  // 複合プライマリキーの処理
  if (
    ast.create_definitions.some((def) => def.constraint && def.constraint_type === 'primary key')
  ) {
    markdown += '\n### 複合プライマリキー\n';
    markdown += '| カラム名               | 制約       |\n';
    markdown += '|-----------------------|-----------|\n';
    ast.create_definitions
      .filter((def) => def.constraint_type === 'primary key')
      .forEach((pk) => {
        const columns = pk.definition.map((col) => col.column).join(', ');
        markdown += `| ${columns} | PRIMARY KEY |\n`;
      });
  }

  // インデックスの処理
  if (ast.create_definitions.some((def) => def.keyword === 'index')) {
    markdown += '\n### インデックス\n';
    markdown += '| インデックス名   | カラム名                | 制約    |\n';
    markdown += '|------------------|------------------------|--------|\n';
    ast.create_definitions
      .filter((def) => def.keyword === 'index')
      .forEach((index) => {
        const indexColumns = index.index_columns.map((col) => col.column).join(', ');
        markdown += `| ${index.index} | ${indexColumns} | ${index.unique ? 'UNIQUE' : ''} |\n`;
      });
  }

  return markdown;
}
