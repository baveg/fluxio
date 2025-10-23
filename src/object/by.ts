import { Dictionary } from "../check/isDictionary";
import { _groupBy, ArRecKey, ArRecVal, RecKey, RecVal } from "./_groupBy";

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
export const by = ((items: any, key: any, val?: any): Dictionary<any> => {
  const r: Dictionary<any> = {};
  _groupBy(items, key, val, (k: any, v: any) => {
    r[k] = v;
  });
  return r;
}) as By;
