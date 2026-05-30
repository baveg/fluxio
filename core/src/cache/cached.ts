/**
 * Internal cache storage: [timestamp, promise]
 */
const _cache: Record<string, [number, Promise<any>]> = {};

interface SetCacheFunction {
  <T>(name: string, value: T): T;
  <T, A1>(name: string, value: T, arg1: A1): T;
  <T, A1, A2>(name: string, value: T, arg1: A1, arg2: A2): T;
  <T, A1, A2, A3>(name: string, value: T, arg1: A1, arg2: A2, arg3: A3): T;
  <T, A1, A2, A3, A4>(name: string, value: T, arg1: A1, arg2: A2, arg3: A3, arg4: A4): T;
}

interface CacheFunction {
  <T>(name: string, expired: number, factory: () => Promise<T>): Promise<T>;
  <T, A1>(name: string, expired: number, factory: (arg1: A1) => Promise<T>, arg1: A1): Promise<T>;
  <T, A1, A2>(
    name: string,
    expired: number,
    factory: (arg1: A1, arg2: A2) => Promise<T>,
    arg1: A1,
    arg2: A2
  ): Promise<T>;
  <T, A1, A2, A3>(
    name: string,
    expired: number,
    factory: (arg1: A1, arg2: A2, arg3: A3) => Promise<T>,
    arg1: A1,
    arg2: A2,
    arg3: A3
  ): Promise<T>;
  <T, A1, A2, A3, A4>(
    name: string,
    expired: number,
    factory: (arg1: A1, arg2: A2, arg3: A3, arg4: A4) => Promise<T>,
    arg1: A1,
    arg2: A2,
    arg3: A3,
    arg4: A4
  ): Promise<T>;
}

/**
 * Generates a unique cache key from arguments by JSON stringifying them
 *
 * @param args - Variable arguments to create cache key from
 * @returns JSON stringified cache key
 *
 * @example
 * ```typescript
 * const key1 = getCacheKey('users', 123);
 * // Returns: '["users",123]'
 *
 * const key2 = getCacheKey('posts', { status: 'active' });
 * // Returns: '["posts",{"status":"active"}]'
 * ```
 */
export const getCacheKey = (...args: any[]) => JSON.stringify(args);

/**
 * Manually sets a value in the cache
 *
 * @param name - Cache namespace
 * @param value - Value to cache
 * @param args - Additional arguments for cache key generation
 * @returns The cached value
 *
 * @example
 * ```typescript
 * // Simple cache
 * const user = setCache('user', { id: 1, name: 'Alice' });
 *
 * // Cache with arguments
 * const post = setCache('post', { id: 42, title: 'Hello' }, 42);
 * ```
 */
export const setCache: SetCacheFunction = <T>(name: string, value: T, ...args: any[]): T => {
  const key = getCacheKey(name, ...args);
  const now = Date.now();
  _cache[key] = [now, Promise.resolve(value)];
  return value;
};

/**
 * Caches the result of an async factory function with automatic expiration
 *
 * - Returns cached value if still valid (expired time not reached)
 * - Executes factory and caches result if expired or missing
 * - Handles promise deduplication (multiple calls share same promise)
 * - Errors are NOT cached (failed promises are removed)
 *
 * @param name - Cache namespace
 * @param expired - Cache expiration time in milliseconds (default: 2 minutes)
 * @param factory - Async function to execute if cache miss
 * @param args - Arguments passed to factory function
 * @returns Cached or freshly computed value
 *
 * @example
 * ```typescript
 * // Simple async cache (2 minutes default)
 * const user = await cached('user', 2 * 60 * 1000, async () => {
 *   return await db.select().from(users).where(eq(users.id, 1));
 * });
 *
 * // With arguments
 * const posts = await cached('posts', 5 * 60 * 1000, async (userId: number) => {
 *   return await db.select().from(posts).where(eq(posts.userId, userId));
 * }, 123);
 *
 * // Multiple arguments
 * const data = await cached('search', 60 * 1000, async (query: string, limit: number) => {
 *   return await fetch(`/api/search?q=${query}&limit=${limit}`);
 * }, 'fastify', 10);
 * ```
 */
export const cached: CacheFunction = async <T>(
  name: string,
  expired: number,
  factory: (...args: any[]) => Promise<T>,
  ...args: any[]
): Promise<T> => {
  const key = getCacheKey(name, ...args);
  const now = Date.now();

  if (_cache[key]) {
    const [cachedTime, cachedPromise] = _cache[key];
    if (now - cachedTime < expired) {
      return await cachedPromise;
    }
  }

  const promise = factory(...args);
  _cache[key] = [now, promise];

  try {
    return await promise;
  } catch (error) {
    // Remove failed promise from cache
    delete _cache[key];
    throw error;
  }
};
