export const setKey = <T, K extends keyof T>(record: T, key: K, value: T[K]): T => {
  record[key] = value;
  return record;
};
