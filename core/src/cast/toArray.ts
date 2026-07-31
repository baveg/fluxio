import { isDefined } from '../check';
import { isArray } from '../check/isArray';
import { isNil } from '../check/isNil';
import { Item } from '../types';
import { toBool } from './toBoolean';
import { toItem } from './toItem';
import { toNbr } from './toNumber';
import { toStr } from './toString';

interface ToList {
  <T = any>(v: T[] | T | null | undefined): T[];
  <T = any>(v: any, def: T[]): T[];
}
export const toArray = (<T = any>(v: any, def: T[] = []): T[] =>
  isNil(v) ? def
  : isArray(v) ? v
  : [v]) as ToList;

export const toArrayOf =
  <T = any>(to: (v: any) => T) =>
  (v: any): T[] => toArray<T>(v).map(to).filter(isDefined);

export const toArrayOfNumber = toArrayOf<number>(toNbr);
export const toArrayOfString = toArrayOf<string>(toStr);
export const toArrayOfBoolean = toArrayOf<boolean>(toBool);
export const toArrayOfItem = toArrayOf<Item>(toItem);
