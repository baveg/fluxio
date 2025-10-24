import { isList, isDate, isNil, isStr, isItem, isPositive, isError, isBool, isDef } from '../check';
export const toItem = ((v: any, d: any) =>
  isItem(v) ? v
  : isItem(d) ? d
  : {}) as ToItem;
