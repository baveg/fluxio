import { glb } from '../glb';
import { toError } from '../cast/toError';
import { clear } from '../object/clear';
import { logger } from '../logger/Logger';
import { isFunction } from 'fluxio/check';

export interface IStorage {
  getItem: (key: string) => string | null | undefined | Promise<string | null | undefined>;
  setItem: (key: string, value: string) => void | Promise<void>;
  removeItem: (key: string) => void | Promise<void>;
  clear: () => void | Promise<void>;
}

export class Storage {
  public log = logger('Storage');
  public readonly ls?: IStorage = glb.localStorage;
  public readonly prefix: string = '';
  public readonly data: Record<string, any> = {};

  async get<T = any>(key: string, factory: T | Promise<T> | (() => T | Promise<T>), check?: (value: T) => boolean): Promise<T> {
    if (!key) throw toError('no key');
    const { log, ls, prefix, data } = this;
    try {
      let value: any;
      if (ls) {
        const json = await ls.getItem(prefix + key);
        value = json ? JSON.parse(json) : undefined;
      } else {
        value = data[key];
      }
      if (value !== undefined) {
        if (check && !check(value)) throw 'no check';
        return value;
      }
    } catch (error) {
      log.e('get', key, check, error);
    }
    const init = await (isFunction(factory) ? factory() : factory);
    await this.set(key, init);
    return init;
  }

  async set<T = any>(key: string, value?: T): Promise<void> {
    const { log, ls, prefix, data } = this;
    try {
      if (!key) throw toError('no key');
      if (value === undefined) {
        delete data[key];
        if (ls) await ls.removeItem(prefix + key);
        return;
      }
      data[key] = value;
      if (ls) await ls.setItem(prefix + key, JSON.stringify(value));
    } catch (error) {
      log.e('set', key, value, error);
      throw error;
    }
  }

  async clear() {
    await this.ls?.clear();
    clear(this.data);
  }
}
