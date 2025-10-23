import { isString } from "../check/isString";
import { glb } from "../glb";
import { setUrlParams } from "./setUrlParams";
import { urlJoin } from "./urlJoin";

export const createUrl = (
  baseUrl?: string | null,
  url?: string | null | URL,
  params?: Record<string, any> | null
) => {
  if (!isString(url)) url = String(url);

  if (!url.match(/^https?:\/\//)) {
    if (!isString(baseUrl)) {
      const location = glb.location || {};
      baseUrl = (location.protocol || 'http:') + '//' + (location.host || '0.0.0.0');
    }
    url = urlJoin(baseUrl, url);
  }

  url = setUrlParams(url, params);

  return url;
};