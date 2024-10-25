// ストアドプロシージャから返却されるJSONの型定義
export type ProcedureResult = {
  status: 'success' | 'error'; // 処理の成功またはエラー
  version: string; // プロシージャのバージョン情報
  message: string; // 処理メッセージ
  start_time: string; // 開始時刻 (ISO 8601形式のタイムスタンプ)
  end_time: string; // 終了時刻 (ISO 8601形式のタイムスタンプ)
  duration_seconds: number; // 実行時間 (秒)
  step: string; // 処理ステップ情報
};
