import { isArray } from './isArray';
import { isBoolean } from './isBoolean';
import { isDate } from './isDate';
import { isError } from './isError';
import { isFileOrBlob } from './isFileOrBlob';
import { isFunction } from './isFunction';
import { isItem } from './isItem';
import { isFloat, isUFloat, isInt, isUInt } from './isNumber';
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
  float: isFloat,
  ufloat: isUFloat,
  int: isInt,
  uint: isUInt,
  string: isString,
  stringValid: isStringValid,
  dictionary: isDictionary,
};
type TypeMap = typeof typeMap;

export const isType = <K extends keyof TypeMap>(v: any, type: K): boolean => {
  const is = typeMap[type];
  return !!(is && is(v));
};
