import { logger } from './logger';

/**
 * 処理結果を示すステータスコードの列挙型
 */
export enum status {
  success = 0, // 処理が成功
  canceld = 1, // 処理がキャンセルされた
  abend = 9, // 異常終了（アベンド）
}

/**
 * エラーメッセージを取得するためのヘルパーメソッド
 * @param error - 不明なエラーオブジェクト
 * @returns エラーメッセージ（または未知のエラーとして通知）
 */
export function getErrorMessage(error: unknown): string {
  return (error as Error)?.message || 'Unknown error';
}

/**
 * 処理キャンセル時のクリーンアップ処理
 * ログにキャンセルされた旨を出力し、指定したステータスコードでプロセスを終了します。
 */
export function cleanupAndExit(): void {
  logger.info(`🚫 Process canceled. Exit code: ${status.canceld}`);
  process.exit(status.canceld);
}

/**
 * SIGINT (Ctrl+C) のシグナルを監視し、強制終了が要求された場合のリスナーをセットアップします。
 * リスナーが呼び出されると、指定されたクリーンアップ処理が実行されます。
 * @param cleanup - 強制終了時に実行されるクリーンアップ関数
 */
export function setupInterruptListener(cleanup: () => void): void {
  process.on('SIGINT', () => {
    logger.warn('🚧 Termination requested.');
    cleanup();
  });
}
