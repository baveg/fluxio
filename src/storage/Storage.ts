import { glb } from '../glb';
import { toError } from '../cast/toError';
import { toMe } from '../cast/toMe';
import { clear } from '../object/clear';
import { logger } from '../logger/Logger';
import { Dictionary } from '../types/Dictionary';
import { isDefined } from '../check/isDefined';
import { isFunction } from '../check/isFunction';

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
  public readonly data: Dictionary<any> = {};

  get<T = any>(
    key: string,
    factory: T | (() => T),
    check?: (value: T) => boolean,
    clean: (value: T) => T = toMe
  ): T {
    if (!key) throw toError('no key');

    const { log, ls, prefix, data } = this;
    if (isDefined(data[key])) return data[key];

    const init = isFunction(factory) ? factory() : factory;
    // log.d('get init', key, init);

    if (!ls) return init;

    try {
      const json = ls.getItem(prefix + key);
      const value = json ? JSON.parse(json) : undefined;

      if (isDefined(value)) {
        if (check && value !== init && !check(value)) throw 'no check';
        // log.d('get item', key, value);
        if (key === '') debugger;
        return (data[key] = clean(value));
      }
    } catch (error) {
      log.e('get error', key, factory, check, error);
    }

    // log.d('get undefined', key, init);
    data[key] = init;
    return init;
  }

  set<T = any>(key: string, value?: T): void {
    const { log, ls, prefix, data } = this;
    try {
      // log.d('set', key, value);
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
