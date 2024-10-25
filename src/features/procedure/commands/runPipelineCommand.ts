import { ProcedureService } from '@/features/procedure/services/startPipelineWithIdService';
import { logger } from '@/lib/logger';
import { confirmExecution, confirmExecutionMode } from '@/lib/prompts';
import { cleanupAndExit, getErrorMessage, setupInterruptListener, status } from '@/lib/utils';
import type { Command } from 'commander';

type RunPipelineOptions = {
  id: string;
  yes?: boolean; // 確認プロンプトをスキップ
  run?: boolean; // LiveRunモード
};

/**
 * コマンドライン引数で受け取ったオプションをもとに、プロシージャの実行を制御するコマンドを設定します。
 * ユーザーは -i オプションでIDを指定し、 -y オプションで確認プロンプトをスキップし、
 * -r オプションでLiveRunモードを選択してプロシージャを実行できます。
 *
 * @param program - Commandオブジェクトへの参照
 */
export function runProcedureCommand(program: Command) {
  program
    .command('procedure')
    .description('idで指定されたストアドプロシージャーを実行する。')
    .requiredOption('-i, --id <id>', '.envファイル内で対応する値を見つけるためのID')
    .option('-y, --yes', '確認プロンプトなしで即実行')
    .option('-r, --run', 'LiveRunモードで実行')
    .action(async (options: RunPipelineOptions) => {
      // SIGINT (Ctrl+C) リスナーを設定
      setupInterruptListener(cleanupAndExit);

      try {
        // 実行モード確認プロンプト
        const shouldRunMode = await confirmExecutionMode();
        if (!shouldRunMode) {
          if (shouldRunMode === undefined) {
            logger.warn('🚧 Termination requested.');
          }
          cleanupAndExit();
        }

        // 実行確認プロンプト
        const shouldRun = await confirmExecution();
        if (!shouldRun) {
          if (shouldRun === undefined) {
            logger.warn('🚧 Termination requested.');
          }
          cleanupAndExit();
        }

        logger.info(`🚀 Starting procedure in execution mode: ${shouldRunMode}!`);

        const procedureService = new ProcedureService();

        // プロシージャ実行サービス
        await procedureService.startProcedureDryRun(options.id);
      } catch (error: unknown) {
        logger.error(
          `Procedure execution failed: ${getErrorMessage(error)}  Exit code: ${status.abend}`,
        );
        process.exit(status.abend);
      } finally {
        // SIGINTリスナーのクリーンアップ
        process.off('SIGINT', cleanupAndExit);
      }
    });
}
