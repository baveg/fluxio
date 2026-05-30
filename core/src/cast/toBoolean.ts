import { isDefined } from '../check/isDefined';
import { isBoolean } from '../check/isBoolean';
import { isNil } from '../check/isNil';

const boolMap: Record<string, boolean> = {
  true: true,
  false: false,
  ok: true,
  ko: false,
  on: true,
  off: false,
  '1': true,
  '0': false,
};

interface ToBool {
  (v: boolean | string | number): boolean;
  (v: any): boolean | undefined;
  <T>(v: any, defVal: T): boolean | T;
}
export const toBoolean = (<T = boolean>(v: any, defVal?: T | boolean): boolean | T | undefined =>
  isBoolean(v) ? v
  : isNil(v) ? defVal
  : isDefined((v = boolMap[String(v).toLowerCase()])) ? (v as boolean)
  : defVal) as ToBool;
