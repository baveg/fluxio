import { firstLower } from './lower';
import { firstUpper } from './upper';

/**
 * Converts PascalCase to kebab-case
 * @example
 * pascalToKebabCase('HelloWorld') // 'hello-world'
 * pascalToKebabCase('XMLHttpRequest') // 'x-m-l-http-request'
 */
export const pascalToKebabCase = (v: string): string =>
  v.replace(/[A-Z]/g, (chr) => `-${chr}`).toLowerCase();

/**
 * Extracts words from any case format
 * @example
 * getWords('helloWorld') // ['hello', 'world']
 * getWords('hello-world') // ['hello', 'world']
 * getWords('hello_world') // ['hello', 'world']
 */
export const getWords = (v: string) =>
  v
    .replace(/[a-z0-9][A-Z]/g, (s) => s[0] + ' ' + (s[1] || ''))
    .replace(/[^a-z0-9A-Z$]+/g, () => ' ')
    .trim()
    .toLowerCase()
    .split(' ');

/**
 * Converts to PascalCase
 * @example
 * pascalCase('hello-world') // 'HelloWorld'
 * pascalCase('hello_world') // 'HelloWorld'
 * pascalCase('hello world') // 'HelloWorld'
 */
export const pascalCase = (v: any): string => getWords(v).map(firstUpper).join('');

/**
 * Converts to camelCase
 * @example
 * camelCase('hello-world') // 'helloWorld'
 * camelCase('HelloWorld') // 'helloWorld'
 * camelCase('hello_world') // 'helloWorld'
 */
export const camelCase = (v: any): string => firstLower(pascalCase(v));

/**
 * Converts to kebab-case
 * @example
 * kebabCase('helloWorld') // 'hello-world'
 * kebabCase('HelloWorld') // 'hello-world'
 * kebabCase('hello_world') // 'hello-world'
 */
export const kebabCase = (v: string): string => getWords(v).join('-');

/**
 * Converts to snake_case
 * @example
 * snakeCase('helloWorld') // 'hello_world'
 * snakeCase('HelloWorld') // 'hello_world'
 * snakeCase('hello-world') // 'hello_world'
 */
export const snakeCase = (v: string): string => getWords(v).join('_');
