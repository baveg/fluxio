import { sleep } from './sleep';

/**
 * Retries a promise with exponential backoff delay
 * @param factory Async function that creates the promise to retry
 * @param retry Number of retry attempts (default: 10)
 * @param delayMs Delay in ms (default: 1s)
 * @param firstMs Initial delay in ms (default: 200ms)
 * @returns The result of the promise if successful
 * @throws The last error if all retries fail
 */
export const withRetry = <F extends (...args: any[]) => Promise<any>>(
  factory: F,
  retry: number = 10,
  delayMs = 1000,
  firstMs = 200,
): F => {
  return (async (...args: any[]) => {
    let error: any;
    for (let i = 0; i < retry; i++) {
      try {
        return await factory(...args);
      } catch (e) {
        error = e;
        await sleep(i === 0 ? firstMs : delayMs);
      }
    }
    throw error;
  }) as F;
};
