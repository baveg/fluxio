import { isArray, isObject } from '../check';
import { logger } from '../logger/Logger';
import { by } from '../object/by';

const log = logger('json');

export const toJsonReplacer = (k: string, v: any) => {
	if (v instanceof Uint8Array) return { Uint8Array: v.length };
	if (v instanceof Error) return { name: v.name, message: v.message };
	return v;
}

export const toJson = (v: any) => {
	try {
		return JSON.stringify(v, toJsonReplacer);
	}
	catch (e) {
    log.e('toJson', e);
		return String(v);
	}
}

export const fromJson = (json: string | null | undefined): any => {
  try {
    return json ? JSON.parse(json.toString()) : undefined;
  } catch (e) {
    log.e('fromJson', e);
    return undefined;
  }
};

export const jsonClone = (v: any): any => fromJson(toJson(v));

export const jsonStringify = (
  value: any,
  replacer?: ((this: any, key: string, value: any) => any) | undefined,
  space?: string | number | undefined,
  depth: number = 1
): string => {
  try {
    return JSON.stringify(value, replacer, space);
  } catch (e) {
    log.w('stringify error', value, e);
    if (isArray(value)) {
      if (!depth) return '[]';
      const copy = value.map((v) => jsonParse(jsonStringify(v, replacer, space, depth - 1)));
      return jsonStringify(copy);
    }
    if (isObject(value)) {
      if (!depth) return '{}';
      const copy = by(value, null, (v) => jsonParse(jsonStringify(v, replacer, space, depth - 1)));
      return jsonStringify(copy);
    }
    return String(value);
  }
};

export const jsonParse = (
  text: string | null | undefined,
  reviver?: ((this: any, key: string, value: any) => any) | undefined,
  errorValue: any = null
): any => {
  try {
    return text ? JSON.parse(text, reviver) : null;
  } catch (e) {
    log.e('parse', e);
    return errorValue;
  }
};
