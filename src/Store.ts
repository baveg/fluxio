import { glb } from './glb';
import { toError } from './cast/toError';
import { logger } from './logger';

export class Store {
  private static instance?: Store;

  public static get(): Store {
    if (!this.instance) this.instance = new Store();
    return this.instance;
  }

  public log = logger('Store');
  public readonly storage? = glb.localStorage;
  public readonly prefix: string = '';
  public readonly data: Record<string, any> = {};

  get<T = any>(key: string, init: T, check?: (value: T) => boolean): T {
    if (!key) throw toError('no key');
    const { log, storage, prefix, data } = this;
    try {
      let v: any;
      if (storage) {
        const json = storage.getItem(prefix + key);
        v = json ? JSON.parse(json) : undefined;
      } else {
        v = data[key];
      }
      if (check && v !== undefined && !check(v)) throw 'no check';
      return v !== undefined ? v : init;
    } catch (error) {
      log.e('get', key, init, check, error);
      return init;
    }
  }

  set<T = any>(key: string, value?: T): void {
    const { log, storage, prefix, data } = this;
    try {
      if (!key) throw toError('no key');
      if (value === undefined) {
        delete data[key];
        if (storage) storage.removeItem(prefix + key);
        return;
      }
      data[key] = value;
      if (storage) storage.setItem(prefix + key, JSON.stringify(value));
    } catch (error) {
      log.e('set', key, value, error);
      throw error;
    }
  }
}
