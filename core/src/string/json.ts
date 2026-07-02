import { isArray, isObject } from '../check';
import { logger } from '../logger/Logger';
import { by } from '../object/by';

export const log = logger('json');

export const jsonStringify = (
  value: any,
  replacer?: ((this: any, key: string, value: any) => any) | undefined,
  space?: string | number | undefined,
  depth: number = 1,
): string => {
  try {
    return JSON.stringify(value, replacer, space);
  } catch (e) {
    log.w('stringify error', value, e);
    if (isArray(value)) {
      if (!depth) return '[]';
      const copy = value.map(v => jsonParse(jsonStringify(v, replacer, space, depth - 1)));
      return jsonStringify(copy);
    }
    if (isObject(value)) {
      if (!depth) return '{}';
      const copy = by(value, null, v => jsonParse(jsonStringify(v, replacer, space, depth - 1)));
      return jsonStringify(copy);
    }
    return String(value);
  }
};

export const jsonParse = (
  text: string | null | undefined,
  reviver?: ((this: any, key: string, value: any) => any) | undefined,
  errorValue: any = null,
): any => {
  try {
    return text ? JSON.parse(text, reviver) : null;
  } catch (e) {
    log.e('parse', e);
    return errorValue;
  }
};
