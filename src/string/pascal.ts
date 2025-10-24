import { firstLower } from './lower';
import { splitWords } from './splitWords';
import { firstUpper } from './upper';

export const pascal = (v: any): string => splitWords(v).map(firstUpper).join('');

export const camel = (v: any): string => firstLower(pascal(v));
