import { glb } from '../glb';
import { toError } from '../cast/toError';
import { clear } from '../object/clear';
import { logger } from '../logger/Logger';
import { isFunction } from 'fluxio/check';

export interface IStorage {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
  clear: () => void;
}

export class Storage {
  public log = logger('Storage');
  public readonly ls?: IStorage = glb.localStorage;
  public readonly prefix: string = '';
  public readonly data: Record<string, any> = {};

  get<T = any>(key: string, factory: T | (() => T), check?: (value: T) => boolean): T {
    if (!key) throw toError('no key');
    const { log, ls, prefix, data } = this;
    let value: any;
    try {
      if (ls) {
        const json = ls.getItem(prefix + key);
        value = json ? JSON.parse(json) : undefined;
      } else {
        value = data[key];
      }
      if (value !== undefined) {
        if (check && !check(value)) throw 'no check';
        log.d('get', key, value);
        return value;
      }
    } catch (error) {
      log.e('get', key, value, factory, check, error);
    }
    const init = (isFunction(factory) ? factory() : factory);
    log.d('get init', key, init);
    this.set(key, init);
    return init;
  }

  set<T = any>(key: string, value?: T): void {
    const { log, ls, prefix, data } = this;
    try {
      log.d('set', key, value);
      if (!key) throw toError('no key');
      if (value === undefined) {
        delete data[key];
        if (ls) ls.removeItem(prefix + key);
        return;
      }
      data[key] = value;
      if (ls) ls.setItem(prefix + key, JSON.stringify(value));
    } catch (error) {
      log.e('set', key, value, error);
      throw error;
    }
  }

  clear() {
    this.ls?.clear();
    clear(this.data);
  }
}
