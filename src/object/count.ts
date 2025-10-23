import { isArray } from '../check/isArray';
import { isString } from '../check/isString';
import { isObject } from '../check/isObject';

export const count = (items: any): number =>
  isObject(items) ?
    isArray(items) ? items.length
    : Object.keys(items).length
  : isString(items) ? items.length
  : 0;
