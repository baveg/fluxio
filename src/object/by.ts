import { isFunction } from '../check/isFunction';
import { isNil } from '../check/isNil';
import { isArray } from '../check/isArray';
import { isItem } from '../check/isItem';
import { Dictionary } from '../types/Dictionary';

export type ArRecKey<T> = undefined | null | keyof T | ((item: T, index: number) => any);
export type ArRecVal<T, U> = undefined | null | keyof T | ((item: T, index: number) => U);
export type RecKey<T> = undefined | null | keyof T | ((item: T, key: string) => any);
export type RecVal<T, U> = undefined | null | keyof T | ((item: T, key: string) => U);

export const byGetId = (v: any) => v.id;
export const byGetKey = (v: any) => v.key;
export const byGetValue = (v: any) => v;
export const byGetIndex = (_: any, i: any) => i;

export const byForEach = (items: any, key: any, val: any, callback: any) => {
  const getK: (item: any, index: any) => any =
    isFunction(key) ? key
    : isNil(key) ? byGetValue
    : (i: any) => i[key];

  const getV: (item: any, index: any) => any =
    isFunction(val) ? val
    : isNil(val) ? byGetValue
    : (i: any) => i[val];

  if (isArray(items)) {
    for (let i = 0, l = items.length; i < l; i++) {
      const item = items[i];
      callback(getK(item, i), getV(item, i));
    }
  }

  if (isItem(items)) {
    for (const key in items) {
      const val = items[key];
      callback(getK(val, key), getV(val, key));
    }
  }
};

interface GroupBy {
  <T>(items: T[], key?: ArRecKey<T>): Dictionary<T[]>;
  <T, U>(items: T[], key: ArRecKey<T>, val: ArRecVal<T, U>): Dictionary<U[]>;
  <T>(items: Dictionary<T>, key?: RecKey<T>): Dictionary<T[]>;
  <T, U>(items: Dictionary<T>, key: RecKey<T>, val: RecVal<T, U>): Dictionary<U[]>;
}
/**
 * @example
 * var a = { x:5 }, b = { x:6 }, c = { x:6 };
 * isDeepEqual( groupBy([ 5, 6, 6 ], v => v), { 5: [5], 6: [6, 6] } );
 * isDeepEqual( groupBy([ 5, 6, 6 ], v => v, (v, i) => i), { 5: [0], 6: [1, 2] } );
 * isDeepEqual( groupBy([ a, b, c ], v => v.x), { 5: [a], 6: [b, c] } );
 * isDeepEqual( groupBy({ a, b, c }, null, v => v.x), { a: [5], b: [6], c: [6] } );
 * isDeepEqual( groupBy([ a, b, c ]), groupBy({ 0:a, 1:b, 2:c }) );
 */
export const groupBy = ((items: any, key?: any, val?: any): Dictionary<any[]> => {
  const r: Dictionary<any[]> = {};
  byForEach(items, key, val, (k: any, v: any) => {
    (r[k] || (r[k] = [])).push(v);
  });
  return r;
}) as GroupBy;

interface By {
  <T>(items: T[], key?: ArRecKey<T>): Dictionary<T>;
  <T, U>(items: T[], key: ArRecKey<T>, val: ArRecVal<T, U>): Dictionary<U>;
  <T>(items: Dictionary<T>, key?: RecKey<T>): Dictionary<T>;
  <T, U>(items: Dictionary<T>, key: RecKey<T>, val: RecVal<T, U>): Dictionary<U>;
}
/**
 * @example
 * var a = { x:5 }, b = { x:6 }, c = { x:6 };
 * isDeepEqual( by([ 5, 6, 6 ], v => v), { 5: 5, 6: 6 } );
 * isDeepEqual( by([ 5, 6, 6 ], v => v, (v, i) => i), { 5: 0, 6: 2 } );
 * isDeepEqual( by([ a, b, c ], v => v.x), { 5: a, 6: b } );
 * isDeepEqual( by({ a, b, c }, null, v => v.x), { a: 5, b: 6, c: 6 } );
 * isDeepEqual( by([ a, b, c ]), valueBy({ 0:a, 1:b, 2:c }) );
 */
export const by = ((items: any, key?: any, val?: any): Dictionary<any> => {
  const r: Dictionary<any> = {};
  byForEach(items, key, val, (k: any, v: any) => {
    r[k] = v;
  });
  return r;
}) as By;

interface ById {
  <T extends { id?: string }>(items: T[]): Dictionary<T>;
  <T extends { id?: string }, U>(items: T[], val: ArRecVal<T, U>): Dictionary<U>;
  <T extends { id?: string }>(items: Dictionary<T>): Dictionary<T>;
  <T extends { id?: string }, U>(items: Dictionary<T>, val: RecVal<T, U>): Dictionary<U>;
}
export const byId = ((items: any, val?: any) => by(items, byGetId, val)) as ById;

interface ByKey {
  <T extends { key?: string }>(items: T[]): Dictionary<T>;
  <T extends { key?: string }, U>(items: T[], val: ArRecVal<T, U>): Dictionary<U>;
  <T extends { key?: string }>(items: Dictionary<T>): Dictionary<T>;
  <T extends { key?: string }, U>(items: Dictionary<T>, val: RecVal<T, U>): Dictionary<U>;
}
export const byKey = ((items: any, val?: any) => by(items, byGetKey, val)) as ByKey;

interface IndexBy {
  <T>(items: T[], key?: ArRecKey<T>): Dictionary<number>;
  <T>(items: Dictionary<T>, key?: RecKey<T>): Dictionary<number>;
}
export const indexBy = ((items: any, key?: any) => by(items, key, byGetIndex)) as IndexBy;

export const keyByValue = (dico: Dictionary<string>) => {
  const result: Dictionary<string> = {};
  for (const key in dico) result[dico[key] || ''] = key;
  return result;
};
