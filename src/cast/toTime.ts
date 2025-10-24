import { isList, isDate, isNil, isStr, isItem, isPositive, isError, isBool, isDef } from '../check';
import { toDate } from './toDate';
export const toTime = (v: any): number => (isDate((v = toDate(v))) ? v.getTime() : 0);
