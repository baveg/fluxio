import { isDate, isValidDate } from '../check/isDate';
import { isString } from '../check/isString';

interface ToDate {
  (v: any): Date;
  <TDef>(v: any, defVal: TDef): Date | TDef;
  <TDef>(v: any, defVal?: TDef): Date | TDef | undefined;
}

/**
 * Convert value to Date object
 * @param v - Value to convert (Date, string, number, or time string HH:MM:SS)
 * @param defVal - Default value if conversion fails
 * @returns Date object or default value
 * @example
 * toDate('2025-02-09') -> Date object
 * toDate(1739059200000) -> Date object
 * toDate('15:30:45') -> Date object (today at 15:30:45)
 * toDate('invalid', new Date(0)) -> new Date(0)
 */
export const toDate = (<TDef>(v: any, defVal?: TDef): Date | TDef | undefined => {
  // Handle time format HH:MM:SS or HH:MM
  if (isString(v) && /^\d{2}:\d{2}(:\d{2})?$/.test(v)) {
    const parts = v.split(':').map(Number);
    v = new Date();
    v.setHours(parts[0], parts[1], parts[2] || 0, 0);
  }
  else if (!isDate(v)) {
    v = new Date(v);
  }
  return isValidDate(v) ? v : defVal;
}) as ToDate;
