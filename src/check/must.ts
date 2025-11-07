import { Check } from '../types/Check';
import { toError } from '../cast/toError';
import { isNotEmpty } from './isEmpty';
import { isFunction } from './isFunction';
import { isNotNil } from './isNil';
import { isFloat } from './isNumber';
import { isString } from './isString';

type MustError = string | ((prop: string) => string | Error);

export const must = <T>(
  value: any,
  check: Check = isNotNil,
  prop: string = 'this',
  error: MustError = (prop) => `${prop} is not valid`
): T => {
  if (!check(value)) {
    throw toError(isFunction(error) ? error(prop) : error);
  }
  return value as T;
};

export const mustNotEmpty = <T>(value: T | null | undefined, prop?: string, error?: MustError) =>
  must<T>(value, isNotEmpty, prop, error || ((prop) => `${prop} is empty`));

export const mustExist = <T>(value: T | null | undefined, prop?: string, error?: MustError) =>
  must<T>(value, isNotNil, prop, error || ((prop) => `${prop} is null`));

export const mustFloat = (value: any, prop?: string, error?: MustError) =>
  must<number>(value, isFloat, prop, error || ((prop) => `${prop} is not number`));

export const mustString = (value: any, prop?: string, error?: MustError) =>
  must<string>(value, isString, prop, error || ((prop) => `${prop} is not string`));
