import { config } from 'dotenv';

// .envファイルを読み込む
config();

// 環境変数を型で定義
interface EnvVariables {
  APP_NAME: string;
  DEFAULT_RETRIES: number;
}

// 環境変数のバリデーション
export const env: EnvVariables = {
  APP_NAME: process.env.APP_NAME || 'UnknownApp',
  DEFAULT_RETRIES: Number(process.env.DEFAULT_RETRIES) || 3
};

