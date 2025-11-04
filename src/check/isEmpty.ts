import { firstKey } from '../object/first';

export const isEmpty = (v: any): boolean => firstKey(v) === undefined;
export const isNotEmpty = <T>(v: T | null | undefined): v is NonNullable<T> => !isEmpty(v)