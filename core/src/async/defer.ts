import { sleep } from './sleep';

export const defer = async <T = any>(callback: () => T | Promise<T>, ms = 0): Promise<T> =>
  sleep(ms).then(callback);
