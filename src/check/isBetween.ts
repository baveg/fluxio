import { isNumber } from './isNumber';

export const isBetween = (v: number, min?: number, max?: number): boolean =>
  isFloat(min) && v < min ? false
  : isFloat(max) && v > max ? false
  : true;
