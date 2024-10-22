//import { executePipelineService } from '@/features/pipline/services/executePipelineService';
import { logger } from '@/lib/logger';
import type { Command } from 'commander';

/**
 *
 * @param program
 */
export function runPipelineCommand(program: Command) {
  program
    .command('runPipeline')
    .description('Start the application')
    .option('--no-dry-run', '通常モードでバッチを実行')
    .option('-f, --force', '強制実行オプション')
    .option('-l, --log', 'ログ出力オプション')
    .action(async (options) => {
      try {
        logger.info('処理開始');
        logger.warn('処理開始');
        logger.error('処理開始');
        // await executePipelineService();
      } catch (error: unknown) {
        const message = (error as Error)?.message || 'Unknown error';
        logger.error(`Failed to execute pipeline: ${message}`);
        process.exit(1);
      }
    });
}
