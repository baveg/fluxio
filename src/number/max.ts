import { isNumber } from '../check/isNumber';

export const max = (a: number, b?: number): number => (b !== undefined && b > a ? b : a);
