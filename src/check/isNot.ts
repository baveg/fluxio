import { isEmpty } from './isEmpty';
import { isNil } from './isNil';

export const isNot = (is: (v: any) => boolean) => (v: any) => !is(v);

export const isNotNil = <T>(v: T | null | undefined): v is NonNullable<T> => !isNil(v);

export const isNotEmpty = isNot(isEmpty);
