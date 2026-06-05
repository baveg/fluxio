export const getKeys = <T extends Record<string | number | symbol, any>>(
  obj: T
): (keyof T)[] => Object.keys(obj) as (keyof T)[];
