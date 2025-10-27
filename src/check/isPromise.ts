import { isFunction } from './isFunction';

export const isPromise = (v: any): v is Promise<any> => isFunction(v?.then);
