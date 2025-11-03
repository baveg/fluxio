import { firstLower } from './lower';
import { firstUpper } from './upper';

export const pascalToKebabCase = (v: string): string =>
  v.replace(/[A-Z]/g, (chr) => `-${chr}`).toLowerCase();

export const getWords = (v: string) =>
  v
    .replace(/[a-z0-9][A-Z]/g, (s) => s[0] + ' ' + (s[1] || ''))
    .replace(/[^a-z0-9A-Z]+/g, () => ' ')
    .trim()
    .toLowerCase()
    .split(' ');

export const pascalCase = (v: any): string => getWords(v).map(firstUpper).join('');

export const camelCase = (v: any): string => firstLower(pascalCase(v));

export const kebabCase = (v: string): string => pascalToKebabCase(pascalCase(v));
