import { sleep } from './sleep';

/**
 * Retries a promise-returning function with a delay between attempts
 * @param factory Async function that creates the promise to retry
 * @param retries Number of attempts (default: 10)
 * @param delayMs Delay in ms between attempts after the first (default: 1s)
 * @param firstMs Delay in ms before the first retry (default: 100ms)
 * @returns The result of the promise if successful
 * @throws The last error if all attempts fail
 */
export const withRetry = <F extends (...args: any[]) => Promise<any>>(
  factory: F,
  retries = 10,
  delayMs = 1000,
  firstMs = 100
): F => {
  return (async (...args: any[]) => {
    let error: any;
    for (let i = 0; i < retries; i++) {
      try {
        return await factory(...args);
      } catch (e) {
        error = e;
        if (i < retries - 1) {
          await sleep(i === 0 ? firstMs : delayMs);
        }
      }
    }
    throw error;
  }) as F;
};

/**
 * Retries a promise-returning function with a delay between attempts
 * @param factory Async function that creates the promise to retry
 * @param retries Number of attempts (default: 10)
 * @param delayMs Delay in ms between attempts after the first (default: 1s)
 * @param firstMs Delay in ms before the first retry (default: 100ms)
 * @returns The result of the promise if successful
 * @throws The last error if all attempts fail
 */
export const retry = <T>(
  factory: () => Promise<T>,
  retries = 10,
  delayMs = 1000,
  firstMs = 100
): Promise<T> => (
  withRetry(factory, retries, delayMs, firstMs)()
);