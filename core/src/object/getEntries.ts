export const getEntries = <T extends Record<string | number | symbol, any>>(
  obj: T
): [keyof T, T[keyof T]][] => Object.entries(obj) as [keyof T, T[keyof T]][];
