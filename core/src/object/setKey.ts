/**
 * Sets `record[key]` to `value`, or deletes the key when `value` is `undefined`. Mutates and returns `record`.
 * @example
 * setKey({ a: 1, b: 2 }, 'a', 5); // { a: 5, b: 2 }
 * setKey({ a: 1, b: 2 }, 'a', undefined); // { b: 2 }
 */
export const setKey = <T, K extends keyof T>(record: T, key: K, value?: T[K] | undefined): T => {
  if (value === undefined) delete record[key];
  else record[key] = value;
  return record;
};
