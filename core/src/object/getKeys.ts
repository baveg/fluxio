export const getKeys = <T extends Record<string | number | symbol, any>>(obj: T): string[] =>
  Object.keys(obj);
