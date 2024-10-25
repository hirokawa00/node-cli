import { logger } from '@/lib/logger';
import { getErrorMessage } from '@/lib/utils';
import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

interface SupabaseConfig {
  supabaseUrl: string;
  supabaseKey: string;
}

/**
 * Supabaseと接続し、ストアドプロシージャを実行するリポジトリクラス。
 * `executeDryRunProcedure` と `executeLiveRunProcedure` で異なるモードの実行を提供。
 */
export class ProcedureRepository {
  private supabase: SupabaseClient;

  /**
   * コンストラクタでSupabaseクライアントを初期化。
   * @summary 環境変数や設定ファイルからSupabaseのURLとキーを読み込み、接続を確立。
   *  @param config SupabaseのURLとAPIキーを含むオブジェクト
   */
  constructor({ supabaseUrl, supabaseKey }: SupabaseConfig) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  /**
   * 任意のストアドプロシージャをDryRunモードで実行。
   * @param procedureName 実行するストアドプロシージャの名前
   * @param params ストアドプロシージャに渡すパラメータ（オプション）
   * @returns 実行結果をジェネリック型Tで返すPromise
   */
  async executeDryRunProcedure<T>(
    procedureName: string,
    params?: Record<string, unknown>,
  ): Promise<T> {
    return this.executeProcedure<T>(procedureName, 'DryRun', params);
  }

  /**
   * 任意のストアドプロシージャをLiveRunモードで実行。
   * @param procedureName 実行するストアドプロシージャの名前
   * @param params ストアドプロシージャに渡すパラメータ（オプション）
   * @returns 実行結果をジェネリック型Tで返すPromise
   */
  async executeLiveRunProcedure<T>(
    procedureName: string,
    params?: Record<string, unknown>,
  ): Promise<T> {
    return this.executeProcedure<T>(procedureName, 'LiveRun', params);
  }

  /**
   * 共通のストアドプロシージャ実行ロジック。
   * @param procedureName 実行するストアドプロシージャの名前
   * @param params ストアドプロシージャに渡すパラメータ
   * @param mode 実行モード（DryRunまたはLiveRun）
   * @returns 実行結果をジェネリック型Tで返すPromise
   */
  private async executeProcedure<T>(
    procedureName: string,
    mode: string,
    params?: Record<string, unknown>,
  ): Promise<T> {
    try {
      // ストアドプロシージャをSupabase経由で呼び出す
      logger.info(`Start executing ${mode} procedure: ${procedureName}`, { params: params });
      const procedureResult = await this.supabase.rpc(procedureName, params);
      // エラーが発生した場合は例外を投げる
      if (procedureResult.error) {
        throw new Error(`Error executing ${mode} procedure: ${procedureResult.error.message}`);
      }
      // ジェネリック型として結果を返却
      return procedureResult.data as T;
    } catch (error) {
      // 実行中にエラーが発生した場合はコンソールに出力し、再度例外を投げる
      logger.error(`Failed to execute ${mode} procedure:`, { error: getErrorMessage(error) });
      throw error;
    }
  }
}
