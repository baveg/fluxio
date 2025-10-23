import { isNumber } from '../check/isNumber';

export const floor = (number: number, digits = 0, base = Math.pow(10, digits)): number =>
  Math.floor(base * number) / base + 0;
