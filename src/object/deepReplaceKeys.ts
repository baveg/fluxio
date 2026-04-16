import { isArray } from '../check/isArray';
import { isObject } from '../check/isObject';

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
        for (const k of Object.keys(v)) {
          const val = walk(v[k]);
          const newKey = replace(k, val, v);
          delete v[k];
          v[newKey] = val;
        }
      }
    }
    return v;
  };
  return walk(obj);
};
