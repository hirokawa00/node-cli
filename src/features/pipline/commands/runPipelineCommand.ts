import { ProcedureService } from '@/features/pipline/services/startPipelineWithIdService';
import { logger } from '@/lib/logger';
import { confirmExecution, confirmExecutionMode } from '@/lib/prompts';
import { cleanupAndExit, getErrorMessage, setupInterruptListener, status } from '@/lib/utils';
import type { Command } from 'commander';

type RunPipelineOptions = {
  yes?: boolean; // 確認プロンプトをスキップ
  run?: boolean; // LiveRunモード
};

/**
 *
 * @param program
 */
export function runPipelineCommand(program: Command) {
  program
    .command('run-pipeline <id>')
    .description('Start the application')
    .option('-y, --yes', '確認プロンプトなしで即実行')
    .option('-r, --run', 'LiveRunモードで実行')
    .action(async (id: string, options: RunPipelineOptions) => {
      // SIGINT (Ctrl+C) のリスナーを設定
      setupInterruptListener(cleanupAndExit);

      try {
        // 実行確認プロンプト
        const shouldRun = await confirmExecution();
        if (!shouldRun) {
          if (shouldRun === undefined) {
            logger.warn('🚧 強制終了が要求されました。');
          }
          cleanupAndExit();
        }

        // 実行モード確認プロンプト
        const shouldRunMode = await confirmExecutionMode();
        if (!shouldRunMode) {
          if (shouldRunMode === undefined) {
            logger.warn('🚧 強制終了が要求されました。');
          }
          cleanupAndExit();
        }

        logger.info(`🚀 パイプラインの実行モード: ${shouldRunMode} で開始します!!`);

        const procedureService = new ProcedureService();

        // パイプライン実行サービス
        await procedureService.startProcedureDryRun(id, shouldRunMode === 'dry-run');
      } catch (error: unknown) {
        logger.error(`パイプラインの実行に失敗しました: ${getErrorMessage(error)}`);
        process.exit(status.abend);
      } finally {
        // SIGINTリスナーのクリーンアップ
        process.off('SIGINT', cleanupAndExit);
      }
    });
}
