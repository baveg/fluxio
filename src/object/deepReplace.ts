import { isArray } from '../check/isArray';
import { isObject } from '../check/isObject';

export const deepReplace = (
  obj: any,
  replace: (v: any, k: string | number | null, parent: any) => any
): any => {
  const walk = (v: any, k: string | number | null, parent: any) => {
    if (isObject(v)) {
      if (isArray(v)) {
        for (let i = 0, l = v.length; i < l; i++) {
          v[i] = walk(v[i], i, v);
        }
      } else {
        for (const k in v) {
          v[k] = walk(v[k], k, v);
        }
      }
    }
    return replace(v, k, parent);
  };
  return walk(obj, null, null);
};
