import { config } from 'dotenv';

// .envファイルを読み込む
config();

// 環境変数を型で定義
interface EnvVariables {
  SUPABASE_URL: string;
  SUPABASE_KEY: string;
}

// 環境変数のバリデーション
export const env: EnvVariables = {
  SUPABASE_URL: process.env.SUPABASE_URL || '',
  SUPABASE_KEY: process.env.SUPABASE_KEY || '',
};
