import { isNumber } from '../check/isNumber';

export const clamp = (v: number, min?: number, max?: number): number =>
  isFloat(min) && v < min ? min
  : isFloat(max) && v > max ? max
  : v;
