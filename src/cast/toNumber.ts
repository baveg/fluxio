import { isString } from '../check/isString';

interface ToNumber {
  (v: number): number;
  (v: any): number | undefined;
  <D>(v: any, nanVal: D): number | D;
}
export const toNumber = (<D>(v: any, defaultValue?: D): number | D | undefined => {
  const clean = isString(v) ? v.replace(/,/g, '.').replace(/[^0-9\-\.]/g, '') : String(v);
  const nbr = clean !== '' ? Number(clean) : Number.NaN;
  return Number.isNaN(nbr) || !Number.isFinite(nbr) ? defaultValue : nbr;
}) as ToNumber;

export const pInt = (v: any): number | undefined =>
  Number.isNaN((v = parseInt(v))) || !Number.isFinite(v) ? undefined : v;

export const pFloat = (v: any): number | undefined =>
  Number.isNaN((v = parseFloat(v))) || !Number.isFinite(v) ? undefined : v;

export const toInt = pInt;
export const toFloat = pFloat;
