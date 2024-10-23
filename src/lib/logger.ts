import pico from 'picocolors';
import { v4 as uuidv4 } from 'uuid'; // UUID生成
import winston from 'winston';
import { createLogger, format, transports } from 'winston';
import type { Logger as WinstonLogger } from 'winston';

// 各セッションごとに一意のUUIDを生成
const sessionUUID = uuidv4();

// カラフルにしたいログレベルの設定
const colorizeLog = (level: string, message: string) => {
  switch (level) {
    case 'info':
      return pico.green(message); // 情報ログは緑色
    case 'warn':
      return pico.yellow(message); // 警告ログは黄色
    case 'error':
      return pico.bgRed(pico.bold(pico.whiteBright(message))); // エラーログは赤色
    case 'debug':
      return pico.gray(pico.italic(message)); // デバッグログは灰色
    default:
      return message; // デフォルトはそのまま
  }
};

// ログレベルを固定長でパディングするための関数
const getPaddedLevel = (level: string) => {
  return level.toUpperCase().padEnd(5); // ログレベルを5文字にパディング
};

// winston カスタムフォーマット
const customFormat = winston.format.printf(({ level, message, timestamp }) => {
  const paddedLevel = getPaddedLevel(level); // ログレベルのパディングを取得

  // メッセージがオブジェクトであればJSONにシリアライズ
  //const logMessage = JSON.stringify(message);
  const formattedMessage = `${timestamp} [${sessionUUID}] [${paddedLevel}]: ${message}`;

  return colorizeLog(level, formattedMessage); // ログ全体に色を適用
});

// カラフルなログフォーマット
const colorizedFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
  customFormat,
);

class Logger {
  private logger: WinstonLogger;

  constructor() {
    this.logger = createLogger({
      level: 'info', // 必要に応じてログレベルを設定
      format: colorizedFormat,
      transports: [
        new transports.Console(), // コンソールへログ出力
      ],
    });
  }

  // インフォメッセージ用
  info(message: string, params?: Record<string, unknown>): void {
    const logContent = { message, params }; // メッセージとパラメータを1つのオブジェクトにする
    this.logger.info(logContent); // ログに出力
  }

  // 警告メッセージ用
  warn(message: string, params?: Record<string, unknown>): void {
    const logContent = { message, params };
    this.logger.warn(logContent);
  }

  // エラーメッセージ用
  error(message: string, params?: Record<string, unknown>): void {
    const logContent = { message, params };
    this.logger.error(logContent);
  }

  // 他の外部インスタンスと置き換えるためのメソッド（テスト用）
  setLogger(newLogger: WinstonLogger): void {
    this.logger = newLogger;
  }
}

export const logger = new Logger();
