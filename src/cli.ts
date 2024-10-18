import { Command } from 'commander';
import chalk from 'chalk';
// import {env} from './lib/env';
// import {logger} from './lib/logger';
// import { runWithRetry } from './lib/retry';

const program = new Command();

// CLIの設定
program
  .name('test')
  .description('CLI App Example with Logging, Retry, and Env support')
  .version('1.0.0');

// 実行コマンド
program
  .command('run')
  .description('Run the main task with retry')
  .option('-r, --retries <number>', 'number of retries', '5')
  .action(async (options) => {

    console.log(options)
    // const retries = parseInt(options.retries, 10);

    // logger.info(`Starting task with ${retries} retries...`);
    
    // // タスクを実行
    // const task = async () => {
    //   logger.info('Executing task...');
    //   if (Math.random() > 0.7) {
    //     logger.info('Task succeeded!');
    //   } else {
    //     throw new Error('Task failed');
    //   }
    // };

    // try {
    //   await runWithRetry(task, retries);
    //   logger.info('Task completed successfully!');
    // } catch (error) {
    //   logger.error('Task failed after retries');
    // }
  });

  program
  .command('run2')
  .description('Run the batch process')
  .action(async () => {
    try {
      // バッチ処理の実行
      await new Promise((resolve) => {
        setTimeout(() => {
          console.log('Batch process finished after 3 seconds');
          resolve(null);
        }, 3000); // 3秒（3000ミリ秒）待つ
      });
      
      console.log(chalk.green('🚀 Completed Successfully!!'));
      process.exit(0);  // 正常終了コード
    } catch (error) {
      console.error('Error occurred during the process:', error);
      process.exit(1);  // 異常終了コード
    }
  });

// Help表示
program.parse(process.argv);
