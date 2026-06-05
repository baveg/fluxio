import { camelCase, kebabCase, pascalCase, snakeCase } from '../string/cases';
import { getKeys } from './getKeys';

export const topCaseConverter = (obj: any, converter: (k: string) => string): any => {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return obj;
  const out: any = {};
  for (const k of getKeys(obj)) out[converter(k as string)] = obj[k];
  return out;
};

export const topCamelCase = (obj: any): any => topCaseConverter(obj, camelCase);
export const topPascalCase = (obj: any): any => topCaseConverter(obj, pascalCase);
export const topKebabCase = (obj: any): any => topCaseConverter(obj, kebabCase);
export const topSnakeCase = (obj: any): any => topCaseConverter(obj, snakeCase);
