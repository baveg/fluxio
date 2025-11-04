import { isString } from 'fluxio/check';
import { isArray } from '../check/isArray';
import { isItem } from '../check/isItem';

export const last = (v: any): any | undefined => {
  if (isItem(v)) last(Object.values(v));
  if (isArray(v) || isString(v)) return v[v.length - 1];
  return undefined;
};