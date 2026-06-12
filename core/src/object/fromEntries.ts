import { Dictionary } from '../types';

export const fromEntries = <T>(entries: [string, T][]) =>
  Object.fromEntries(entries) as Dictionary<T>;
