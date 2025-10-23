import { Dictionary } from '../check/isDictionary';
import { ArRecVal, RecVal } from './_groupBy';
import { by } from './by';

interface ByKey {
  <T extends { key?: string }>(items: T[]): Dictionary<T>;
  <T extends { key?: string }, U>(items: T[], val: ArRecVal<T, U>): Dictionary<U>;
  <T extends { key?: string }>(items: Dictionary<T>): Dictionary<T>;
  <T extends { key?: string }, U>(items: Dictionary<T>, val: RecVal<T, U>): Dictionary<U>;
}
export const byKey = ((items: any, val?: any) => by(items, (i: any) => i.key, val)) as ByKey;
