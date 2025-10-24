import { count } from '../object/count';
import { isNil } from './isNil';

export const isEmpty = (v: any): boolean => isNil(v) || count(v) === 0;
