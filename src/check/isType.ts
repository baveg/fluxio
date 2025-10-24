import { isArray } from './isArray';
import { isItems } from './isArrayOf';
import { isBoolean } from './isBoolean';
import { isDate } from './isDate';
import { isError } from './isError';
import { isFileOrBlob } from './isFileOrBlob';
import { isFunction } from './isFunction';
import { isItem } from './isItem';
import { isInt, isNumber, isPositive } from './isNumber';
import { isString, isStringValid } from './isString';
import { Dictionary, isDictionary } from './isDictionary';

const typeMap: Dictionary<(v: any) => boolean> = {
  array: isArray,
  item: isItem,
  boolean: isBoolean,
  date: isDate,
  error: isError,
  file: isFileOrBlob,
  function: isFunction,
  number: isNumber,
  positive: isPositive,
  int: isInt,
  string: isString,
  stringValid: isStringValid,
  dictionary: isDictionary,
  items: isItems,
};
type TypeMap = typeof typeMap;

export const isType = <K extends keyof TypeMap>(v: any, type: K): boolean => {
  const is = typeMap[type];
  return !!(is && is(v));
};
