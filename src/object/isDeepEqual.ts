import { isArray } from '../check/isArray';
import { count } from './count';

export const isDeepEqual = (a: any, b: any): boolean => {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (typeof a === 'object' && a !== null) {
    if (isArray(a)) {
      if (a.length !== b.length) return false;
      for (let i = 0, l = a.length; i < l; i++) if (!isDeepEqual(a[i], b[i])) return false;
      return true;
    }
    if (count(a) !== count(b)) return false;
    for (const p in a) if (!isDeepEqual(a[p], b[p])) return false;
    return true;
  }
  return false;
};
