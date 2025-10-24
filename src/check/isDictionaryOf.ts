import { isBoolean } from './isBoolean';
import { Dictionary, isDictionary } from './isDictionary';
import { isItem } from './isItem';
import { isNumber } from './isNumber';
import { isString } from './isString';

export const isDictionaryOf =
  <T>(is: (v: any) => v is T) =>
  (v: any): v is Dictionary<T> =>
    isDictionary(v) && Object.values(v).every(is);

export const isDictionaryOfNumber = isDictionaryOf(isNumber);

export const isDictionaryOfString = isDictionaryOf(isString);

export const isDictionaryOfBoolean = isDictionaryOf(isBoolean);

export const isDictionaryOfItem = isDictionaryOf(isItem);
