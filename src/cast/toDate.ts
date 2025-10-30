import { isDate, isPositive } from '../check';

interface ToDate {
  (v: any): Date;
  <TDef>(v: any, defVal: TDef): Date | TDef;
  <TDef>(v: any, defVal?: TDef): Date | TDef | undefined;
}
export const toDate = (<TDef>(v: any, defVal?: TDef): Date | TDef | undefined =>
  isDate(v) ? v
  : isUFloat((v = new Date(v)).getTime()) ? v
  : defVal) as ToDate;
