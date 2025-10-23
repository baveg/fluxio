import { Dictionary } from '../check/isDictionary';
import { ArRecVal, by, RecVal } from './by';

interface ById {
  <T extends { id?: string }>(items: T[]): Dictionary<T>;
  <T extends { id?: string }, U>(items: T[], val: ArRecVal<T, U>): Dictionary<U>;
  <T extends { id?: string }>(items: Dictionary<T>): Dictionary<T>;
  <T extends { id?: string }, U>(items: Dictionary<T>, val: RecVal<T, U>): Dictionary<U>;
}
export const byId = ((items: any, val?: any) => by(items, (i: any) => i.key, val)) as ById;
