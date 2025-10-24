import { isList, isDate, isNil, isStr, isItem, isPositive, isError, isBool, isDef } from '../check';
export const toDate = (<TDef>(v: any, defVal?: TDef): Date | TDef | undefined =>
  isDate(v) ? v
  : isPositive((v = new Date(v)).getTime()) ? v
  : defVal) as ToDate;
