import { confirm, select } from '@inquirer/prompts';
/**
 * 処理を実行するかどうかをユーザーに確認するプロンプトを表示する。
 *
 * @returns {Promise<boolean>} ユーザーが「はい」と答えた場合はtrueを返し、キャンセルした場合はfalseを返す。
 */
export async function confirmExecution(): Promise<boolean | undefined> {
  try {
    return await confirm({
      message: '処理を実行してもよろしいですか？',
      default: false,
    });
  } catch (error) {
    // Ctrl+Cなどでプロンプトが中断された場合の処理
    return undefined;
  }
}

/**
 * ユーザーにDryRunモードかLiveRunモードかを選択させるプロンプトを表示する。
 *
 * @returns ユーザーが選択したモード ('dry-run' または 'live-run') を返す。
 */
export async function confirmExecutionMode(): Promise<'dry-run' | 'live-run' | undefined> {
  try {
    return await select<'dry-run' | 'live-run'>({
      message: '処理モードを選択してください:',
      choices: [
        { name: 'dry-run', value: 'dry-run', description: '実行は行わず、処理内容を確認します。' },
        { name: 'live-run', value: 'live-run', description: '実際に処理を実行します。' },
      ],
    });
  } catch (error) {
    // Ctrl+Cなどでプロンプトが中断された場合の処理
    return undefined;
  }
}
