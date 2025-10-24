import { Dictionary } from '../check/isDictionary';

interface DeleteKey {
  <T, K1 extends keyof T>(record: T, k1: K1): Omit<T, K1>;
  <T, K1 extends keyof T, K2 extends keyof T>(record: T, k1: K1, k2: K2): Omit<Omit<T, K1>, K2>;
  <T, K1 extends keyof T, K2 extends keyof T, K3 extends keyof T>(
    record: T,
    k1: K1,
    k2: K2,
    k3: K3
  ): Omit<Omit<Omit<T, K1>, K2>, K3>;
  <T>(record: Dictionary<T>, ...keys: string[]): Dictionary<T>;
}
export const deleteKey = ((record: any, ...keys: string[]): any => {
  for (const key of keys) delete record[key];
  return record;
}) as DeleteKey;
