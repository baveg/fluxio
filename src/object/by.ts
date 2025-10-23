import { isDictionary, type Dictionary } from '../check/isDictionary';
import { isNil } from '../check/isNil';
import { isFun } from '../check/isFun';
import { isArray } from '../check/isArray';

export type ArRecKey<T> = undefined | null | keyof T | ((item: T, index: number) => any);
export type ArRecVal<T, U> = undefined | null | keyof T | ((item: T, index: number) => U);
export type RecKey<T> = undefined | null | keyof T | ((item: T, key: string) => any);
export type RecVal<T, U> = undefined | null | keyof T | ((item: T, key: string) => U);

interface GroupBy {
  <T>(items: T[], key?: ArRecKey<T>): Dictionary<T[]>;
  <T, U>(items: T[], key: ArRecKey<T>, val: ArRecVal<T, U>): Dictionary<U[]>;
  <T>(items: Dictionary<T>, key?: RecKey<T>): Dictionary<T[]>;
  <T, U>(items: Dictionary<T>, key: RecKey<T>, val: RecVal<T, U>): Dictionary<U[]>;
}

interface By {
  <T>(items: T[], key?: ArRecKey<T>): Dictionary<T>;
  <T, U>(items: T[], key: ArRecKey<T>, val: ArRecVal<T, U>): Dictionary<U>;
  <T>(items: Dictionary<T>, key?: RecKey<T>): Dictionary<T>;
  <T, U>(items: Dictionary<T>, key: RecKey<T>, val: RecVal<T, U>): Dictionary<U>;
}

const _groupBy = (items: any, key: any, val: any, add: any) => {
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

/**
 * @example
 * var a = { x:5 }, b = { x:6 }, c = { x:6 };
 * isDeepEqual( groupBy([ 5, 6, 6 ], v => v), { 5: [5], 6: [6, 6] } );
 * isDeepEqual( groupBy([ 5, 6, 6 ], v => v, (v, i) => i), { 5: [0], 6: [1, 2] } );
 * isDeepEqual( groupBy([ a, b, c ], v => v.x), { 5: [a], 6: [b, c] } );
 * isDeepEqual( groupBy({ a, b, c }, null, v => v.x), { a: [5], b: [6], c: [6] } );
 * isDeepEqual( groupBy([ a, b, c ]), groupBy({ 0:a, 1:b, 2:c }) );
 */
export const groupBy = ((items: any, key: any, val?: any): Dictionary<any[]> => {
  const r: Dictionary<any[]> = {};
  _groupBy(items, key, val, (k: any, v: any) => {
    (r[k] || (r[k] = [])).push(v);
  });
  return r;
}) as GroupBy;

/**
 * @example
 * var a = { x:5 }, b = { x:6 }, c = { x:6 };
 * isDeepEqual( by([ 5, 6, 6 ], v => v), { 5: 5, 6: 6 } );
 * isDeepEqual( by([ 5, 6, 6 ], v => v, (v, i) => i), { 5: 0, 6: 2 } );
 * isDeepEqual( by([ a, b, c ], v => v.x), { 5: a, 6: b } );
 * isDeepEqual( by({ a, b, c }, null, v => v.x), { a: 5, b: 6, c: 6 } );
 * isDeepEqual( by([ a, b, c ]), valueBy({ 0:a, 1:b, 2:c }) );
 */
export const by = ((items: any, key: any, val?: any): Dictionary<any> => {
  const r: Dictionary<any> = {};
  _groupBy(items, key, val, (k: any, v: any) => {
    r[k] = v;
  });
  return r;
}) as By;
