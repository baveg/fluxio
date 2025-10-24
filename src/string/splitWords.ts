import { clean } from './clean';

/**
 * words("abc") -> ["abc"]
 * words("abcDef") -> ["abc", "def"]
 * words("abc def") -> ["abc", "def"]
 * @param arg
 * @returns
 */
export const splitWords = (arg: string): string[] =>
  clean(arg)
    .replace(/[a-z0-9][A-Z]/g, (s) => s[0] + ' ' + (s[1] || '').toLowerCase())
    .replace(/[^a-z0-9A-Z]+/g, () => ' ')
    .toLowerCase()
    .split(' ')
    .filter((s) => s);
