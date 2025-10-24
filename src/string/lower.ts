import { toString } from '../cast/toString';

export const lower = (v: any): string => toString(v).toLowerCase();

export const firstLower = (v: any): string =>
  (v = toString(v)) ? lower(v[0]) + v.substring(1) : v;
