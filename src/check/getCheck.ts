import { isArray } from './isArray';
import { isBoolean } from './isBoolean';
import { isDictionary } from './isDictionary';
import { isNumber } from './isNumber';
import { isString } from './isString';

export type Check = (v: any) => boolean;

export const getCheck = (v: any): Check =>
  isString(v) ? isString
  : isNumber(v) ? isNumber
  : isBoolean(v) ? isBoolean
  : isArray(v) ? isArray
  : isDictionary(v) ? isDictionary
  : () => true;

export class CheckError extends Error {
  constructor(prop?: string, type?: string) {
    super(`${prop || 'property'} is not ${type || 'valid'}`);
  }
}

export const checkError = (prop?: string, type?: string) => new CheckError(prop, type);
