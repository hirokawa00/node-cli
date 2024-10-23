export enum status {
  success = 0, // 処理が成功
  canceld = 1, // 処理がキャンセルされた
  abend = 9, // 異常終了（アベンド）
}

export function getErrorMessage(error: unknown): string {
  return (error as Error)?.message || 'Unknown error';
}
