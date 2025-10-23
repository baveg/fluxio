import { isBoolean } from "../check/isBoolean";
import { isString } from "../check/isString";
import { count } from "../object/count";
import { jsonStringify } from "../json";
import { getUrlParams } from "./getUrlParams";

export const setUrlParams = (url: string, changes?: Record<string, any> | null): string => {
  if (!changes || count(changes) === 0) return url;

  const parts = url.split('#');
  const baseUrl = parts[0] || '';
  const hash = parts[1];
  const path = baseUrl.split('?', 1)[0];
  const params = getUrlParams(url);

  for (const key in changes) {
    const value = changes[key];
    if (value === undefined) {
    } else if (value === null) delete params[key];
    else if (isString(value)) params[key] = value;
    else if (isBoolean(value)) params[key] = value ? '1' : '0';
    else params[key] = jsonStringify(value);
  }

  const pairs: string[] = [];
  for (const key in params) {
    const value = params[key];
    if (value !== undefined) {
      pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
    }
  }
  const newQuery = pairs.join('&');

  return path + (newQuery ? '?' + newQuery : '') + (hash ? '#' + hash : '');
};