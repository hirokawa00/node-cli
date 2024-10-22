export function getErrorMessage(error: unknown): string {
  return (error as Error)?.message || 'Unknown error';
}
