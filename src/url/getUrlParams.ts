import { glb } from '../glb';

export const getUrlParams = (url?: string): Record<string, string> => {
  if (!url) url = glb.location?.href;
  let match;
  const pl = /\+/g;
  const search = /([^&=]+)=?([^&]*)/g;
  const decode = (s: string) => decodeURIComponent(s.replace(pl, ' '));
  const queryIndex = url.indexOf('?');
  const query = queryIndex >= 0 ? url.substring(queryIndex + 1) : '';
  const params: Record<string, string> = {};
  while ((match = search.exec(query))) {
    const key = match[1];
    const value = match[2];
    if (key && value) {
      params[decode(key)] = decode(value);
    }
  }
  return params;
};
