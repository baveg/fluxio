import { isDictionary } from '../check/isDictionary';
import { isNil } from '../check/isNil';
import { isFun } from '../check/isFun';
import { isArray } from '../check/isArray';

export type ArRecKey<T> = undefined | null | keyof T | ((item: T, index: number) => any);
export type ArRecVal<T, U> = undefined | null | keyof T | ((item: T, index: number) => U);
export type RecKey<T> = undefined | null | keyof T | ((item: T, key: string) => any);
export type RecVal<T, U> = undefined | null | keyof T | ((item: T, key: string) => U);

export const _groupBy = (items: any, key: any, val: any, add: any) => {
  const getK: (item: any, index: any) => any =
    isFun(key) ? key
    : isNil(key) ? (i: any) => i
    : (i: any) => i[key];
  const getV: (item: any, index: any) => any =
    isFun(val) ? val
    : isNil(val) ? (i: any) => i
    : (i: any) => i[val];
  if (isArray(items)) {
    items.forEach((item, index) => {
      add(getK(item, index), getV(item, index));
    });
  }
  if (isDictionary(items)) {
    Object.entries(items).forEach(([key, val]) => {
      add(getK(val, key), getV(val, key));
    });
  }
};
