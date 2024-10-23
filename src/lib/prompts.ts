import inquirer from 'inquirer';

export async function confirmExecution(): Promise<{ confirmExecution: boolean }> {
  return await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmExecution',
      message: '処理を実行してもよろしいですか？',
      default: false,
    },
  ]);
}

export async function confirmExecutionMode(): Promise<{ executionMode: 'dry-run' | 'live-run' }> {
  return await inquirer.prompt([
    {
      type: 'list',
      name: 'executionMode',
      message: '処理モードを選択してください:',
      choices: ['dry-run', 'live-run'],
      default: 'dry-run',
    },
  ]);
}
