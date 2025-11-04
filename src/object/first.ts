import { isString } from '../check/isString';
import { isArray } from '../check/isArray';
import { isItem } from '../check/isItem';
import { Item } from '../types/Item';

const _firstKey = (v: Item): string | undefined => {
  for (const k in v) return k;
};

export const first = (v: any): string | undefined => (
  isItem(v) ? v[_firstKey(v)!] :
  isArray(v) || isString(v) ? v[0] :
  undefined
);

export const firstKey = (v: any): string | number | undefined => (
  isItem(v) ? _firstKey(v) :
  (isArray(v) || isString(v)) && v.length > 0 ? 0 :
  undefined
);
