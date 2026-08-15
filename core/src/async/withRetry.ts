import { toError } from "../cast";
import { toTrue } from "../cast/toTrue";
import { sleep } from "./sleep";

export const withRetry = <F extends (...args: any[]) => Promise<any>>(
  factory: F,
  retries = 3,
  delayMs = 500,
  retryIf: (e: Error, ...args: any[]) => boolean = toTrue,
  nextMs = delayMs,
): F => {
  return (async (...args: any[]) => {
    let error: any;
    for (let i = 0; i < retries; i++) {
      try {
        return await factory(...args);
      } catch (e) {
        error = e;
        if (!retryIf(toError(e), ...args)) break;
        if (i < retries - 1) {
          await sleep(i === 0 ? delayMs : nextMs);
        }
      }
    }
    throw error;
  }) as F;
};
