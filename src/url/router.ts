import { createUrl, Dictionary, flux, glb, logger, onEvent, removeIndex, isString, isArray, notImplemented, keyByValue, fluxCombine } from 'fluxio';

const log = logger('router');

// URL Helpers

export const extractBaseUrl = (url: string) =>
  (url.replace('://', '::').split('/', 1)[0] || '').replace('::', '://');

export const extractUrlSegments = (url: string) => (
  removeIndex(
    (url.replace('://', '').split('?', 1)[0] || '').split('/'),
    0
  )
);

// URL Streams

export const url$ = flux('');
export const baseUrl$ = url$.map(extractBaseUrl);
export const urlSegments$ = url$.map(extractUrlSegments);

// Navigation

export const navTo = (
  url: string | string[],
  query?: Dictionary<string>,
) => {
  const baseUrl = baseUrl$.get();
  if (isString(url) && url.startsWith('http') && !url.startsWith(baseUrl)) {
    log.w('navTo notImplemented', url, query);
    throw notImplemented(url);
  }

  const segments = isArray(url) ? url : extractUrlSegments(url);
  const urlPath = segments.join('/');

  const nextUrl = createUrl(baseUrl, urlPath, query);

  log.d('navTo', url, query, nextUrl);
  
  url$.set(nextUrl);
  glb.history?.pushState(null, '', nextUrl);

  log.d('navTo2', url, url$.get(), urlSegments$.get());
};

export const navBack = () => {
  log.d('back');
  glb.history?.back();
};

// Sync

const syncUrl = (): void => {
  if (glb.location) {
    url$.set(glb.location.href);
  }
};

// Init

log.d('init');

if (glb.history && glb.location) {
  onEvent(glb, 'hashchange', syncUrl);
  onEvent(glb, 'popstate', syncUrl);
  syncUrl();
}
