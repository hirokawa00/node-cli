//import { executePipelineService } from '@/features/pipline/services/executePipelineService';
import { logger } from '@/lib/logger';
import { confirmExecution } from '@/lib/prompts';
import { getErrorMessage, status } from '@/lib/utils';
import type { Command } from 'commander';

/**
 *
 * @param program
 */
export function runPipelineCommand(program: Command) {
  program
    .command('run-pipeline')
    .description('Start the application')
    .option('-n, --no-dry-run', '通常モードでバッチを実行')
    .action(async (options) => {
      try {
        const result = await confirmExecution();
        if (!result.confirmExecution) {
          logger.info(`🚫 処理がキャンセルされました。exit code: ${status.canceld}`);
          process.exit(status.canceld);
        }

        logger.info('🚀 パイプラインの実行を開始します!!');
        // await executePipelineService();
      } catch (error: unknown) {
        logger.error(`パイプラインの実行に失敗しました: ${getErrorMessage(error)}`);
        process.exit(status.abend);
      }
    });
}
