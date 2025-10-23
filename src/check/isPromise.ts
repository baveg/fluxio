import { isFun } from './isFunction';

export const isPromise = (v: any): v is Promise<any> => isFun(v?.then);
