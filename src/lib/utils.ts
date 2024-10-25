import { logger } from './logger';

export enum status {
  success = 0, // 処理が成功
  canceld = 1, // 処理がキャンセルされた
  abend = 9, // 異常終了（アベンド）
}

/**
 * エラーメッセージ取得ヘルパーメソッド
 * @param error
 * @returns
 */
export function getErrorMessage(error: unknown): string {
  return (error as Error)?.message || 'Unknown error';
}

/**
 * 処理キャンセルのクリーンアップ処理
 */
export function cleanupAndExit(): void {
  logger.info(`🚫 処理がキャンセルされました。exit code: ${status.canceld}`);
  process.exit(status.canceld);
}

/**
 * SIGINT (Ctrl+C) のリスナーをセットアップ
 */
export function setupInterruptListener(cleanup: () => void): void {
  process.on('SIGINT', () => {
    logger.warn('🚧 強制終了が要求されました。');
    cleanup();
  });
}
