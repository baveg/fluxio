import { sleep } from "./sleep";

export const retry = async <T>(createPromise: () => Promise<T>, retry = 2, delayMs = 100): Promise<T> => {
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
