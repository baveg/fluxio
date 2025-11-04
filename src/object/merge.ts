import { isArray } from '../check/isArray';
import { isDefined } from '../check/isDefined';
import { Item } from '../types/Item';
import { isItem } from '../check/isItem';
import { isNil } from '../check/isNil';
import { isUndefined } from '../check/isUndefined';
import { max } from '../number/max';

export const merge = (a: any, b: any): any => {
  if (isNil(a) || isNil(b) || typeof a !== typeof b) return b;
  if (isItem(a) && isItem(b)) {
    const r: Item = { ...a };
    for (const k in b) {
      r[k] = merge(r[k], b[k]);
      if (isUndefined(r[k])) delete r[k];
    }
    return r;
  }
  if (isArray(a) && isArray(b)) {
    const l = max(a.length, b.length);
    const r: any[] = [];
    for (let i = 0; i < l; i++) {
      r[i] = isDefined(b[i]) ? merge(a[i], b[i]) : a[i];
    }
    return r;
  }
  return b;
};

export const mergeAll = (...args: any[]): any => args.reduce(merge);
