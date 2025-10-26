import { Dictionary } from '../check/isDictionary';
import { jsonStringify } from '../string/json';

export const uniq = <T>(a: T[], isJson = true): T[] => {
  const o: Dictionary<any> = {};
  for (const v of a) {
    o[(isJson ? jsonStringify(v) : null) || String(v)] = v;
  }
  return Object.values(o);
};
