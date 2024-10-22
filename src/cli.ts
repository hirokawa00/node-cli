import { runPipelineCommand } from '@/features/pipline';
import { Command } from 'commander';

const program = new Command();

// CLIの設定
program
  .name(process.env.npm_package_name ?? '')
  .description(process.env.npm_package_version ?? '')
  .version(`📦 バージョン情報: ${process.env.npm_package_version ?? ''}`);

// 実行コマンド
runPipelineCommand(program);

// Help表示
program.parse(process.argv);
