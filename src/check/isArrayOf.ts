import { isArray } from './isArray';

export const isArrayOf =
  <T>(is: (v: any) => v is T) =>
  (v: any): v is T[] =>
    isArray(v) && v.every(is);
