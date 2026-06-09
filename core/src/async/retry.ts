import { sleep } from "./sleep";

/**
 * Retries a promise with exponential backoff delay
 * @param createPromise - Function that creates the promise to retry
 * @param retry - Number of retry attempts (default: 2)
 * @param delayMs - Initial delay in ms, doubles after each retry (default: 0 = no delay, 100 → 200 → 400 → 800)
 * @returns The result of the promise if successful
 * @throws The last error if all retries fail
 */
export const retry = async <T>(createPromise: () => Promise<T>, retry = 2, delayMs = 0): Promise<T> => {
  let error: any;
  for (let i = 0; i < retry; i++) {
    try {
      return await createPromise();
    } catch (e) {
      error = e;
      if (i < retry - 1) {
        await sleep(delayMs);
        delayMs *= 2;
      }
    }
  }
  throw error;
};
