import { camelCase, kebabCase, pascalCase, snakeCase } from '../string/cases';
import { deepReplaceKeys } from './deepReplaceKeys';

export const deepCaseConverter = (obj: any, converter: (k: string) => string): any =>
  deepReplaceKeys(obj, (k) => converter(k));

export const deepCamelCase = (obj: any): any => deepCaseConverter(obj, camelCase);
export const deepPascalCase = (obj: any): any => deepCaseConverter(obj, pascalCase);
export const deepKebabCase = (obj: any): any => deepCaseConverter(obj, kebabCase);
export const deepSnakeCase = (obj: any): any => deepCaseConverter(obj, snakeCase);
