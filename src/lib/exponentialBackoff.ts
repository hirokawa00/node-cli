import type { FailedAttemptError } from 'p-retry';

// リトライ設定
export const retryOptions = {
  retries: 5,
  factor: 2, // リトライ間隔を指数関数的に増加
  minTimeout: 1000, // 最初のリトライ間隔
  maxTimeout: 10000, // 最大リトライ間隔
  onFailedAttempt: (error: FailedAttemptError) => {
    console.warn(`Attempt ${error.attemptNumber} failed. ${error.retriesLeft} retries left.`);
  },
};
