import { isString } from '../check';
import { isArray } from '../check/isArray';
import { isItem } from '../check/isItem';
import { getValues } from './getValues';

export const last = (v: any): any | undefined => {
  if (isItem(v)) last(getValues(v));
  if (isArray(v) || isString(v)) return v[v.length - 1];
  return undefined;
};
