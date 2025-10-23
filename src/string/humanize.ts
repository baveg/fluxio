import { toError } from '../cast/toError';
import { isArray } from '../check/isArray';
import { isError } from '../check/isError';
import { isObject } from '../check/isObject';
import { jsonStringify } from './json';

export const humanize = (a: any): string =>
  isArray(a) ? a.map(humanize).join(' ')
  : isError(a) ? toError(a).toString()
  : isObject(a) ? jsonStringify(a)
  : String(a);
