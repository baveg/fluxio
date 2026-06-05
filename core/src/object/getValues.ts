export const getValues = <T extends Record<string | number | symbol, any>>(
  obj: T
): T[keyof T][] => Object.values(obj);
