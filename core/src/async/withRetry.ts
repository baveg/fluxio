import { SECOND } from "../date/date";
import { sleep } from './sleep';

/**
 * Retries a promise with exponential backoff delay
 *
 * @param factory   Async function that creates the promise to retry
 * @param retry - Number of retry attempts (default: 3)
 * @param delayMs - Initial delay in ms, doubles after each retry (default: 500ms → 2s → 8s)
 * @returns The result of the promise if successful
 * @throws The last error if all retries fail
 */
export const withRetry = <F extends ((...args: any[]) => Promise<any>)>(
  factory: F,
  retry: number = 3,
  delayMs = SECOND/2
): F => {
  return (async (...args: any[]) => {
    let error: any;
    for (let i = 0; i < retry; i++) {
      try {
        return await factory(...args);
      } catch (e) {
        error = e;
        await sleep(delayMs);
        delayMs *= 4;
      }
    }
    throw error;
  }) as F;
};