import { logger } from '../logger/Logger';

export const jsonLog = logger('json');

export const jsonStringify = (
  value: any,
  replacer?: ((this: any, key: string, value: any) => any) | undefined,
  space?: string | number | undefined
): string => {
  try {
    return JSON.stringify(value, replacer, space);
  } catch (e) {
    jsonLog.e('stringify', e);
    return String(value);
  }
};

export const jsonParse = (
  text: string,
  reviver?: ((this: any, key: string, value: any) => any) | undefined
): any => {
  try {
    return JSON.parse(text, reviver);
  } catch (e) {
    jsonLog.e('parse', e);
    return null;
  }
};
