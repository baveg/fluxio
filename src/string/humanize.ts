import { toError } from '../cast/toError';
import { isArray } from '../check/isArray';
import { isError } from '../check/isError';
import { isObject } from '../check/isObject';

export const humanize = (a: any): string =>
  isArray(a) ? a.map(humanize).join(' ')
  : isError(a) ? toError(a).toString()
  : isObject(a) ?
    Object.entries(a)
      .map(([k, v]) => `${k}: ${humanize(v)}`)
      .join(' ')
  : String(a);
