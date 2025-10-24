import { isString } from '../check/isString';

interface ToNumber {
  (v: number): number;
  (v: any): number | undefined;
  <D>(v: any, nanVal: D): number | D;
}
export const toNumber = (<D>(v: any, nanVal?: D): number | D | undefined => {
  const clean = isString(v) ? v.replace(/,/g, '.').replace(/[^0-9\-\.]/g, '') : String(v);
  const nbr = clean !== '' ? Number(clean) : Number.NaN;
  return Number.isNaN(nbr) || !Number.isFinite(nbr) ? nanVal : nbr;
}) as ToNumber;
