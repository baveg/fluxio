import { isArray } from '../check/isArray';
import { isObject } from '../check/isObject';
import { getKeys } from './getKeys';

export const deepReplaceKeys = (
  obj: any,
  replace: (k: string, v: any, parent: any) => string
): any => {
  const walk = (v: any): any => {
    if (isObject(v)) {
      if (isArray(v)) {
        for (let i = 0, l = v.length; i < l; i++) {
          v[i] = walk(v[i]);
        }
      } else {
        for (const k of getKeys(v)) {
          const val = walk(v[k]);
          const newKey = replace(k as string, val, v);
          delete v[k];
          v[newKey] = val;
        }
      }
    }
    return v;
  };
  return walk(obj);
};
