import { ProcedureRepository } from '@/features/procedure/repositorys/procedureRepository';
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
   * 指定されたIDに基づいて環境変数の値を取得します。
   * @summary 環境変数が見つからない場合、エラーをスローします。
   * @param id - .envファイル内での環境変数のキー（識別子）
   * @returns 指定された環境変数の値を文字列として返します
   * @throws 環境変数が存在しない、または値が設定されていない場合にエラーをスローします
   */
  private getEnvValueById(id: string): string {
    const envValue = process.env[id];
    if (!envValue) {
      throw new Error(`Environment variable not found for ID: ${id}`);
    }
    return envValue;
  }

  /**
   * DryRunモードでストアドプロシージャを実行。
   * @param id 実行対象のパイプラインID
   * @param isDryRun DryRunモードかどうかのフラグ（現時点では未使用）
   */
  async startProcedureDryRun(id: string): Promise<void> {
    // 渡されたIDを元に.envのキーを特定
    const procedureName = this.getEnvValueById(id);
    try {
      // DryRunモードでストアドプロシージャを実行
      const dryRunResult = await this.procedureRepository.executeDryRunProcedure<ProcedureResult>(
        'dry_run_execute_procedure', // Dry Run用のため変更不可
        { procedure_name: procedureName }, // 任意のパラメータを設定
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
   * @param id 実行対象のパイプラインID
   * @param isDryRun このフラグは現時点では未使用
   */
  async startProcedureLiveRun(id: string): Promise<void> {
    // 渡されたIDを元に.envのキーを特定
    const procedureName = this.getEnvValueById(id);
    try {
      // LiveRunモードでストアドプロシージャを実行
      const liveRunResult = await this.procedureRepository.executeLiveRunProcedure<ProcedureResult>(
        procedureName, // 実行するプロシージャ名
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
