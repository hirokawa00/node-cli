import { getErrorMessage } from '@/lib/utils';
import type { PipelineRun } from '@azure/arm-datafactory';

export async function startPipelineRepository(
  pipelineId: string,
): Promise<PipelineRun | undefined> {
  try {
    console.log('startPipelineRepository');
    return;
  } catch (error: unknown) {
    throw new Error(`パイプラインID ${pipelineId} の開始に失敗しました: ${getErrorMessage(error)}`);
  }
}
