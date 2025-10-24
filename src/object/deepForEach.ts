import { isArray } from '../check/isArray';
import { isObject } from '../check/isObject';

export const deepForEach = (
  obj: any,
  cb: (v: any, k: string | number | null, parent: any) => void
): void => {
  const walk = (v: any, k: string | number | null, parent: any) => {
    if (isObject(v)) {
      if (isArray(v)) {
        for (let i = 0, l = v.length; i < l; i++) walk(v[i], i, v);
      } else {
        for (const k in v) walk(v[k], k, v);
      }
    }
    cb(v, k, parent);
  };
  walk(obj, null, null);
};
