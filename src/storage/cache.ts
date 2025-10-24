import { isArray } from '../check/isArray';
import { getStorage } from './getStorage';

const version = 'V1';
type Cache<T> = [typeof version, number, T];

export const cache = async <T>(
  key: string,
  load: () => Promise<T>,
  expiredMs = 60 * 60 * 1000,
  storage = getStorage()
): Promise<T> => {
  const last = storage.get<Cache<T> | undefined>(
    key,
    undefined,
    (v) => isArray(v) && v[0] === version
  );
  if (last) {
    const expired = last[1] + expiredMs;
    const isExpired = expired < Date.now();
    if (!isExpired) return last[2];
  }
  const value = await load();
  const next: Cache<T> = [version, Date.now(), value];
  storage.set(key, next);
  return value;
};
