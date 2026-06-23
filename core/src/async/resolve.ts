export interface Resolve {
  <T>(value: T): Promise<T>;
  (): Promise<void>;
}

export const resolve = (<T>(val: T) => Promise.resolve(val)) as Resolve;
