import { TMap } from '../types';
import { stringify } from '../json';

export const uniq = <T>(a: T[]): T[] => {
  const o: TMap<any> = {};
  for (const v of a) {
    o[stringify(v) || String(v)] = v;
  }
  return Object.values(o);
};
