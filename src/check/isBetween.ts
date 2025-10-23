import { isNumber } from "./isNumber";

export const isBetween = (v: number, min?: number, max?: number): boolean =>
  isNumber(min) && v < min ? false : isNumber(max) && v > max ? false : true;