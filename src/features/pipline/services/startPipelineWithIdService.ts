import { ProcedureRepository } from '@/features/pipline/repositorys/procedureRepository';
import { env } from '@/lib/env';
import { logger } from '@/lib/logger';
import { getErrorMessage } from '@/lib/utils';
import type { ProcedureResult } from './models/ProcedureResultType';

/**
 * ProcedureServiceクラス
 * 任意のIDに基づいてストアドプロシージャを実行するためのサービスクラス。
 * DryRunとLiveRunの両方のモードに対応。
 */
export class ProcedureService {
  private procedureRepository: ProcedureRepository;

  /**
   * ProcedureServiceクラスのコンストラクタ。
   * ProcedureRepositoryを初期化して使用。
   */
  constructor() {
    this.procedureRepository = new ProcedureRepository({
      supabaseUrl: env.SUPABASE_URL,
      supabaseKey: env.SUPABASE_KEY,
    });
  }

  /**
   * DryRunモードでストアドプロシージャを実行。
   *
   * @param id 実行対象のパイプラインID（将来の拡張性のために保持）
   * @param isDryRun DryRunモードかどうかのフラグ（現時点では未使用）
   */
  async startProcedureDryRun(id: string, isDryRun: boolean): Promise<void> {
    try {
      // DryRunモードでストアドプロシージャを実行
      const dryRunResult = await this.procedureRepository.executeDryRunProcedure<ProcedureResult>(
        'dry_run_execute_procedure',
        { procedure_name: 'generate_procedure_result1' }, // 任意のパラメータを設定
      );
      logger.info('Dry Run procedure execution result:', { dryRunResult });

      return;
    } catch (error) {
      logger.error(`Error executing DryRun procedure with ID: ${id}`, {
        message: getErrorMessage(error),
      });
      throw error;
    }
  }

  /**
   * LiveRunモードでストアドプロシージャを実行。
   *
   * @param id 実行対象のパイプラインID（将来の拡張性のために保持）
   * @param isDryRun このフラグは現時点では未使用
   */
  async startProcedureLiveRun(id: string, isDryRun: boolean): Promise<void> {
    try {
      // LiveRunモードでストアドプロシージャを実行
      const liveRunResult = await this.procedureRepository.executeLiveRunProcedure<ProcedureResult>(
        'live_run_execute_procedure', // 実行するプロシージャ名
      );
      logger.info(
        `Live Run procedure execution result:': ${JSON.stringify(liveRunResult, null, 2)}`,
      );
    } catch (error) {
      logger.error(`Error executing LiveRun procedure with ID: ${id}`, {
        message: getErrorMessage(error),
      });
      throw error;
    }
  }
}
