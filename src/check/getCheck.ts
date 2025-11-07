import { Check } from '../types/Check';
import { isArray } from './isArray';
import { isBoolean } from './isBoolean';
import { isDictionary } from './isDictionary';
import { isFloat } from './isNumber';
import { isString } from './isString';

export const getCheck = (v: any): Check =>
  isString(v) ? isString
  : isFloat(v) ? isFloat
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
