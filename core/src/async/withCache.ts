import { FIVE_MINUTES } from '../date/date';
import { jsonStringify } from '../string/json';

/**
 * Memoizes an async factory per set of arguments, with TTL expiration.
 *
 * @example
 * const getUser = withCache((id: string) => fetchUser(id), FIVE_MINUTES);
 * await getUser("42");          // calls fetchUser("42"), caches result
 * await getUser("42");          // cache hit, no call
 * await getUser.reload("42");   // forces a fresh factory call, refreshes cache
 * getUser.set("42", promise);   // seed/override cache
 * getUser.set("42", undefined); // evict entry
 * getUser.clear();              // wipe everything
 *
 * @param factory   Async function to cache, keyed by its arguments.
 * @param expireIn  TTL per entry in ms. Defaults to `FIVE_MINUTES`.
 */
export const withCache = <F extends (...args: any[]) => Promise<any>>(
  factory: F,
  expireIn = FIVE_MINUTES
): F & {
  reload: F;
  set(...args: [...Parameters<F>, value: ReturnType<F> | undefined]): void;
  clear(): void;
} => {
  let cacheMap: Record<string, [number, Promise<any>]> = {};

  // args is always an array, so the serialized key always starts with "[" —
  // safe from JS's numeric-key reordering, cacheMap iteration order stays
  // pure insertion order.
  const getCacheKey = (args: any[]) => jsonStringify(args);

  // Lazy GC on every get()/set(), no timer needed: since expireIn is fixed
  // per instance, expiredTime is non-decreasing in insertion order, so
  // iteration order == expiration order. Stop at the first non-expired
  // entry — cost is O(expired entries), not O(cache size).
  const cleanExpired = () => {
    for (const key in cacheMap) {
      if (cacheMap[key][0] > Date.now()) return;
      delete cacheMap[key];
    }
  };

  const get = ((...args: any[]) => {
    cleanExpired();

    const key = getCacheKey(args);
    const cache = cacheMap[key];

    // The pending Promise is stored, not its resolved value, so concurrent
    // calls with the same args share the same in-flight call (single-flight).
    if (cache) return cache[1];

    const promise = factory(...args);
    cacheMap[key] = [Date.now() + expireIn, promise];
    return promise;
  }) as F & {
    reload: F;
    set(...args: [...Parameters<F>, value: ReturnType<F> | undefined]): void;
    clear(): void;
  };

  get.reload = ((...args) => {
    cleanExpired();
    const key = getCacheKey(args);
    const promise = factory(...args);
    cacheMap[key] = [Date.now() + expireIn, promise];
    return promise;
  }) as F;

  get.set = (...args: any[]) => {
    cleanExpired();

    const promise = args.pop();
    const key = getCacheKey(args);
    if (promise === undefined) delete cacheMap[key];
    else cacheMap[key] = [Date.now() + expireIn, promise];
  };

  get.clear = () => {
    cacheMap = {};
  };

  return get;
};
