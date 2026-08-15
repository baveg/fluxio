import { toTrue } from "../cast/toTrue";
import { withRetry } from "./withRetry";

export const retry = <T>(
  factory: () => Promise<T>,
  retries = 3,
  delayMs = 500,
  retryIf: (e: Error, ...args: any[]) => boolean = toTrue,
  nextMs = delayMs,
): Promise<T> => withRetry(factory, retries, delayMs, retryIf, nextMs)();
