export type NextState<T> = T | ((prev: T) => T);
