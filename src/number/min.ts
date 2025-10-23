import { isNumber } from '../check/isNumber';

export const min = (a: number, b?: number): number => (b !== undefined && b < a ? b : a);
