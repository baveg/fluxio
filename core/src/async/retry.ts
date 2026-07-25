import { withRetry } from './withRetry';

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
): Promise<T> => withRetry(factory, retries, delayMs, firstMs)();
