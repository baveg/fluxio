import { toString } from '../cast/toString';

export const upper = (v: any): string => toString(v).toUpperCase();

export const firstUpper = (v: any): string =>
  (v = toString(v)) ? upper(v[0]) + v.substring(1) : v;
