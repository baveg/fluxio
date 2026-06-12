import type { Dictionary } from '../types/Dictionary';
import { jsonStringify } from '../string/json';
import { getValues } from '../object/getValues';
import { isString } from '../check/isString';
import { isNumber } from '../check/isNumber';

interface Uniq {
  <T>(a: T[]): T[];
  <T, U>(a: T[], map: (v: T) => U): U[];
}

/**
 * Returns an array with unique values. Optionally applies a mapping function before deduplication.
 *
 * @example
 * uniq([1, 2, 2, 3, 1]) // [1, 2, 3]
 * uniq(['a', 'b', 'a']) // ['a', 'b']
 * uniq([{id: 1}, {id: 2}, {id: 1}]) // [{id: 1}, {id: 2}]
 * uniq([{id: 1, name: 'a'}, {id: 2, name: 'b'}, {id: 1, name: 'c'}], v => v.id) // [1, 2]
 */
export const uniq: Uniq = <T, U>(a: T[], map?: (v: T) => U): U[] => {
  const o: Dictionary<any> = {};
  let v: T | U;
  for (v of a) {
    if (map) v = map(v);
    o[
      isString(v) ? v
      : isNumber(v) ? String(v)
      : jsonStringify(v)
    ] = v;
  }
  return getValues(o);
};
