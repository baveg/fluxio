import { isArray } from '../check/isArray';
import { isString } from '../check/isString';
import { isObject } from '../check/isObject';
import { getKeys } from './getKeys';

export const count = (items: any): number =>
  isObject(items) ?
    isArray(items) ? items.length
    : getKeys(items).length
  : isString(items) ? items.length
  : 0;
