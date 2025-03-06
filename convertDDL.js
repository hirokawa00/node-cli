const fs = require('fs');
const path = require('path');

// 入力フォルダと出力ファイルのパスを指定
const inputFolder = path.join(__dirname, 'input');
const outputMarkdownFile = path.join(__dirname, 'output.md');

// DDLファイルを読み込む関数
function readDDLFiles(folderPath) {
  const files = fs.readdirSync(folderPath);
  return files.map((file) => {
    const filePath = path.join(folderPath, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    return { fileName: file, content };
  });
}

// テーブル定義を解析する関数
function parseTableDDL(ddlContent) {
  const tables = [];
  const tableRegex = /CREATE TABLE\s+(\[?\w+\]?\.\[?\w+\]?|\[?\w+\]?)(\s*\(([^;]*)\));/g;
  const columnRegex =
    /\s*(\[?\w+\]?\s+\w+(?:\(\d+(?:,\d+)?\))?)(?:\s+DEFAULT\s+([^,\s]+))?\s*(NOT NULL|NULL)?\s*(?:PRIMARY KEY)?\s*,?\s*(?:--\s*(.*))?/g;

  let tableMatch;
  while ((tableMatch = tableRegex.exec(ddlContent)) !== null) {
    const tableName = tableMatch[1];
    const columnsContent = tableMatch[3];
    const columns = [];

    let columnMatch;
    let serial = 1;
    while ((columnMatch = columnRegex.exec(columnsContent)) !== null) {
      const columnName = columnMatch[1];
      const defaultValue = columnMatch[2] || ''; // デフォルト値を取得
      const nullable = columnMatch[3] || 'NULL';
      const logicalName = columnMatch[4] || ''; // 論理名を取得
      const isPrimaryKey = /PRIMARY KEY/.test(columnMatch[0]) ? '🔑' : '';
      const dataType = columnName.split(' ')[1];
      columns.push({
        serial,
        columnName,
        dataType,
        isPrimaryKey,
        nullable,
        logicalName,
        defaultValue,
      });
      serial++;
    }

    tables.push({ tableName, columns });
  }

  return tables;
}

// インデックス定義を解析する関数
function parseIndexDDL(ddlContent) {
  const indexes = [];
  const indexRegex =
    /CREATE\s+(UNIQUE\s+)?INDEX\s+(\[?\w+\]?)\s+ON\s+(\[?\w+\]?\.\[?\w+\]?|\[?\w+\]?)\s*\(([^)]+)\)/g;

  let indexMatch;
  while ((indexMatch = indexRegex.exec(ddlContent)) !== null) {
    const unique = !!indexMatch[1];
    const indexName = indexMatch[2];
    const tableName = indexMatch[3];
    const columns = indexMatch[4].split(',').map((col) => col.trim());

    indexes.push({ unique, indexName, tableName, columns });
  }

  return indexes;
}

// シーケンス定義を解析する関数
function parseSequenceDDL(ddlContent) {
  const sequences = [];
  const sequenceRegex =
    /CREATE SEQUENCE\s+(\[?\w+\]?\.\[?\w+\]?|\[?\w+\]?)(\s+START WITH \d+)?(\s+INCREMENT BY \d+)?/g;

  let sequenceMatch;
  while ((sequenceMatch = sequenceRegex.exec(ddlContent)) !== null) {
    const sequenceName = sequenceMatch[1];
    const startWith = sequenceMatch[2]?.trim() || '';
    const incrementBy = sequenceMatch[3]?.trim() || '';

    sequences.push({ sequenceName, startWith, incrementBy });
  }

  return sequences;
}

// マークダウン形式に変換する関数
function convertToMarkdown(parsedData) {
  let markdown = '';

  if (parsedData.tables.length > 0) {
    parsedData.tables.forEach((table) => {
      markdown += `## Table: ${table.tableName}\n\n`;
      markdown += `| #  | Column Name       | Data Type      | Primary Key | Nullable       | Logical Name       | Default Value       |\n`;
      markdown += `|----|-------------------|----------------|-------------|----------------|--------------------|---------------------|\n`;
      table.columns.forEach((column) => {
        markdown += `| ${column.serial}  | ${column.columnName} | ${column.dataType} | ${column.isPrimaryKey} | ${column.nullable} | ${column.logicalName} | ${column.defaultValue} |\n`;
      });
      markdown += '\n';
    });
  }

  if (parsedData.indexes.length > 0) {
    markdown += `## Indexes\n\n`;
    parsedData.indexes.forEach((index) => {
      markdown += `- Index Name: ${index.indexName}\n`;
      markdown += `  - Table: ${index.tableName}\n`;
      markdown += `  - Columns: ${index.columns.join(', ')}\n`;
      markdown += `  - Unique: ${index.unique ? 'Yes' : 'No'}\n\n`;
    });
  }

  if (parsedData.sequences.length > 0) {
    markdown += `## Sequences\n\n`;
    parsedData.sequences.forEach((sequence) => {
      markdown += `- Sequence Name: ${sequence.sequenceName}\n`;
      markdown += `  - ${sequence.startWith}\n`;
      markdown += `  - ${sequence.incrementBy}\n\n`;
    });
  }

  return markdown;
}

// メイン処理
function main() {
  try {
    const ddlFiles = readDDLFiles(inputFolder);

    const parsedData = {
      tables: [],
      indexes: [],
      sequences: [],
    };

    ddlFiles.forEach(({ fileName, content }) => {
      if (fileName.startsWith('input')) {
        parsedData.tables.push(...parseTableDDL(content));
      } else if (fileName.startsWith('index')) {
        parsedData.indexes.push(...parseIndexDDL(content));
      } else if (fileName.startsWith('seq')) {
        parsedData.sequences.push(...parseSequenceDDL(content));
      }
    });

    const markdown = convertToMarkdown(parsedData);
    fs.writeFileSync(outputMarkdownFile, markdown);
    console.log('Markdown file generated:', outputMarkdownFile);
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
