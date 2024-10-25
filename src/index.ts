import { runProcedureCommand } from '@/features/procedure';
import { Command } from 'commander';

const program = new Command();

// CLIの設定
program
  .name(process.env.npm_package_name ?? '')
  .description('CLI アプリケーション')
  .version(`📦 バージョン情報: ${process.env.npm_package_version ?? ''}`);

// 実行コマンド
runProcedureCommand(program);

// Help表示
program.parse(process.argv);
