// import { startPipelineRepository } from '@/features/pipline/repositorys/startPipelineRepository';
// import { retryOptions } from '@/lib/exponentialBackoff';
// import { getErrorMessage } from '@/lib/utils';
// import pRetry from 'p-retry';

// // Pipelineを実行する関数（リトライの対象）
// async function runPipeline(pipelineId: string): Promise<void> {
//   const result = await startPipelineRepository(pipelineId);
//   if (result?.runId) {
//     throw new Error(`Pipeline execution failed: ${result.message}`);
//   }
//   console.log(`Pipeline ${pipelineId} executed successfully.`);
//   return result;
// }

// export async function executePipelineService(): Promise<void> {
//   try {
//     // pRetryでrunPipelineを実行し、リトライ処理を適用
//     await pRetry(() => runPipeline('test'), retryOptions);
//   } catch (error: unknown) {
//     console.error(`Failed to execute pipeline after retries: ${getErrorMessage(error)}`);
//     throw new Error(`Service error: ${getErrorMessage(error)}`);
//   }
// }
