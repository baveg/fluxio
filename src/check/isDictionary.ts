export type Dictionary<T = any> = Record<string, T>;

export const isDictionary = <T extends Dictionary = Dictionary>(v: any): v is T =>
  typeof v === 'object' && !Array.isArray(v);
