import { isArray } from './isArray';
import { isBoolean } from './isBoolean';
import { isItem } from './isItem';
import { isNumber } from './isNumber';
import { isString } from './isString';

export const isArrayOf =
  <T>(is: (v: any) => v is T) =>
  (v: any): v is T[] =>
    isArray(v) && v.every(is);

export const isArrayOfNumber = isArrayOf(isNumber);

export const isArrayOfString = isArrayOf(isString);

export const isArrayOfBoolean = isArrayOf(isBoolean);

export const isArrayOfItem = isArrayOf(isItem);

export const isItems = isArrayOfItem;
