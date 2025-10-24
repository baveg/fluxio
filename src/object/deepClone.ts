import { isArray } from '../check/isArray';

export const deepClone = <T>(obj: T): T => {
  if (typeof obj !== 'object' || obj === null) return obj;
  let c: any;
  if (isArray(obj)) {
    c = [];
    for (let i = 0, l = obj.length; i < l; i++) {
      c[i] = deepClone(obj[i]);
    }
  } else {
    c = {};
    const keys = Object.keys(obj);
    for (let i = 0, l = keys.length; i < l; i++) {
      const key = keys[i];
      if (key) {
        c[key] = deepClone((obj as any)[key]);
      }
    }
  }
  return c as T;
};
