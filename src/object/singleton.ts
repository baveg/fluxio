import { logger } from '../logger';
import type { Dictionary } from '../types/Dictionary';

const log = logger('singleton');
export const singletons: Dictionary<any> = {};

export const singleton = <T>(clazz: { prototype: T, name: string }): {
    (): T;
    set(instance: T): void;
    reset(): void;
} => {
  const name = String(clazz.name);

  const get = () => {
    let singleton = singletons[name];
    if (!singleton) {
      log.d('create', name, singletons);
      singleton = new (clazz as unknown as new () => T)()
      singletons[name] = singleton;
    }
    return singleton;
  }
  
  get.set = (instance: T) => {
    log.d('set', name, instance);
    singletons[name] = instance;
  };

  get.reset = () => {
    log.d('reset', name);
    singletons[name] = undefined;
  };

  return get;
}