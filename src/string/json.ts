import { logger } from '../logger';

export const jsonLog = logger('json');

export const jsonStringify = (value: any) => {
  try {
    return JSON.stringify(value);
  } catch (e) {
    jsonLog.e('stringify', e);
    return String(value);
  }
};

export const jsonParse = (text: string) => {
  try {
    return JSON.parse(text);
  } catch (e) {
    jsonLog.e('parse', e);
    return null;
  }
};
