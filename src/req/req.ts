import { jsonStringify } from '../json';
import { logger } from '../logger';
import { ReqContext, ReqHeaders, ReqOptions, ReqResponseType } from './reqTypes';
import { reqError } from './ReqError';
import { formData } from './formData';
import { reqFetch } from './reqFetch';
import { reqXHR } from './reqXHR';
import { toError } from '../cast/toError';
import { isBetween } from '../check/isBetween';
import { retry } from '../async/retry';
import { sleep } from '../async/sleep';
import { createUrl } from '../url/createUrl';

const reqLog = logger('req');

const acceptJson = 'application/json';
const acceptMap: Partial<Record<ReqResponseType, string>> = {
  json: acceptJson,
  text: 'text/*; charset=utf-8',
  blob: '*/*',
  document: 'text/html, application/xhtml+xml, application/xml; q=0.9; charset=utf-8',
  arraybuffer: '*/*',
};

export const req = async <T>(options: ReqOptions<T>): Promise<T> => {
  const log = options.log || reqLog;
  log.d('req', options);

  const o = { ...options };

  if (o.base) o.base(o);
  if (!o.url) {
    const error = reqError('no-url', { options } as ReqContext);
    o.onError && o.onError(error);
    throw error;
  }

  const headers: ReqHeaders = {};
  const params = o.params || {};
  const resType = o.resType || 'json';
  const json = o.json;

  const method = (o.method || 'GET').toUpperCase();
  const timeout = o.timeout;
  const fData = formData(o.form);

  if (o.noCache) {
    headers['Cache-Control'] = 'no-cache, no-store, max-age=0';
    headers.Expires = 'Thu, 1 Jan 1970 00:00:00 GMT';
    headers.Pragma = 'no-cache';
    params.noCache = Date.now();
  }

  headers.Accept = acceptMap[resType] || acceptJson;

  const body =
    o.body || (json ? (fData ? formData(json, fData) : jsonStringify(json)) : fData);

  if (json) headers['Content-Type'] = 'application/json';

  const oHeaders = o.headers;
  if (oHeaders) Object.assign(headers, oHeaders);

  const url = createUrl(o.baseUrl, o.url, params);

  const ctx = {
    options: o,
    url,
    method,
    resType,
    params,
    headers,
    body,
    timeout,
    ok: false,
    toString: () => `${ctx.method} ${ctx.url}`,
    log,
  } as ReqContext<T>;

  const request =
    o.request || typeof o.fetch === 'function'
      ? reqFetch
      : typeof o.xhr === 'function'
        ? reqXHR
        : o.xhr && typeof XMLHttpRequest === 'function'
          ? reqXHR
          : typeof fetch === 'function'
            ? reqFetch
            : null;

  if (!request) {
    throw toError('no request xhr or fetch');
  }

  await retry(async () => {
    try {
      await request(ctx as any);
      if (o.cast) ctx.data = await o.cast(ctx);
      if (o.after) await o.after(ctx);
      if (!isBetween(ctx.status ?? 0, 200, 299)) throw ctx.status;
      if (ctx.error) throw ctx.error;
    } catch (e) {
      ctx.error = e;
      o.onError && o.onError(reqError(e, ctx));
      if (ctx.error && isBetween(ctx.status ?? 0, 500, 600)) {
        await sleep(5000);
        throw ctx.error;
      }
    }
  }, o.retry || 3).catch((e) => {
    ctx.error = e;
  });

  if (ctx.error || !ctx.ok) {
    throw (ctx.error = reqError(ctx.error || ctx.status, ctx));
  }

  return ctx.data as T;
};
