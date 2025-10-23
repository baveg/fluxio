import { isNumber } from '../check/isNumber';

export const clamp = (v: number, min?: number, max?: number): number =>
  isNumber(min) && v < min ? min
  : isNumber(max) && v > max ? max
  : v;
