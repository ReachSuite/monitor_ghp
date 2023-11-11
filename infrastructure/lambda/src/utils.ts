export async function withRetry(
  callback: () => any,
  {
    maxAttempts,
    onFailedAttempt,
    onFinalFailure,
  }: {
    maxAttempts: number;
    onFailedAttempt?: (attempt: number) => Promise<any>;
    onFinalFailure?: (error: string) => Promise<any>;
  },
) {
  for (let attempts = 1; attempts <= maxAttempts; attempts++) {
    try {
      await callback();
      attempts = maxAttempts + 1;
    } catch (error) {
      if (onFailedAttempt) {
        await onFailedAttempt(attempts);
      }
      if (attempts === maxAttempts && onFinalFailure) {
        await onFinalFailure((error as any).message);
      }
    }
  }
}
