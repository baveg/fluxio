import { logger } from '../logger/Logger';

export const jsonLog = logger('json');

export const jsonStringify = (value: any): string => {
  try {
    return JSON.stringify(value);
  } catch (e) {
    jsonLog.e('jsonStringify', e);
    return String(value);
  }
};

export const jsonParse = (text: string): any => {
  try {
    return JSON.parse(text);
  } catch (e) {
    jsonLog.e('parse', e);
    return null;
  }
};
