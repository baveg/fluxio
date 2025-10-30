import { isArray } from "./isArray";

export type Dictionary<T = any> = Record<string, T>;

export const isDictionary = <T extends Dictionary = Dictionary>(v: any): v is T =>
  v && typeof v === 'object' && !isArray(v);
