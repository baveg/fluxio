import { createUrl, Dictionary, flux, glb, logger, onEvent, singleton, defer, removeIndex, ReadonlyFlux, isString, isArray, notImplemented } from 'fluxio';

export const getBaseUrl = (url: string) => (
  (url.replace('://', '::').split('/', 1)[0] || '').replace('::', '://')
);

export const getUrlPath = (url: string) => (
  removeIndex(url.replace('://', '').split('/'), 0)
);

export class Router {
  static get = singleton(Router);
  
  log = logger('Router');
  history = glb.history;
  location = glb.location;
  url$ = flux('');
  baseUrl$ = this.url$.map(getBaseUrl);
  path$ = this.url$.map(getUrlPath);
  
  translates: Dictionary<string> = {};
  untranslates: Dictionary<string> = {};

  private _p$: Dictionary<ReadonlyFlux<string|undefined>> = {}

  p$(index: number) {
    return this._p$[index] || (this._p$[index] = this.path$.map(p => p[0]));
  }

  private constructor() {
    defer(() => this.init());
  }

  async init() {
    this.log.d('init', this);

    if (!this.history || !this.location) return;

    const sync = () => this.sync();
    onEvent(glb.window, 'hashchange', sync);
    onEvent(glb.window, 'popstate', sync);
    sync();
  }

  sync() {
    this.url$.set(this.location.href);
  }

  public go(url: string | string[], query?: Dictionary<string>) {
    const baseUrl = this.baseUrl$.get();
    if (isString(url) && url.startsWith('http') && !url.startsWith(baseUrl)) {
      throw notImplemented(url);
    }

    const path = isArray(url) ? url : getUrlPath(url);
    const ts = this.translates;
    const pathTr = path.map(p => ts[p] || p).join('/');

    const nextUrl = createUrl(baseUrl, pathTr, query);
    this.url$.set(nextUrl);
    this.history?.pushState(null, '', nextUrl);
  }

  public back() {
    this.log.d('back');
    glb.history?.back();
  }
}

export const getRouter = Router.get;
