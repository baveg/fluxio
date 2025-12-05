import { toError } from '../cast/toError';
import { isArray } from '../check/isArray';
import { isError } from '../check/isError';
import { isObject } from '../check/isObject';

export const humanize = (a: any, indent = 0): string => {
  const sp = '  '.repeat(indent);
  const nextIndent = indent + 1;

  if (isArray(a)) {
    return a
      .map((v) => (isObject(v) || isArray(v) ? '\n' + humanize(v, nextIndent) : humanize(v, 0)))
      .join('\n' + sp);
  }

  if (isError(a)) return sp + toError(a).toString();

  if (isObject(a)) {
    return Object.entries(a)
      .map(([k, v]) => {
        if (isObject(v) || isArray(v)) {
          return sp + k + ':\n' + humanize(v, nextIndent);
        }
        return sp + k + ': ' + humanize(v, 0);
      })
      .join('\n');
  }

  return (indent ? sp : '') + String(a);
};
