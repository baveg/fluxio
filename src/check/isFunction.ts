export type Function<T extends any[] = any[], U = any> = (...args: T) => U;

export const isFunction = (v: any): v is Function => typeof v === 'function';
