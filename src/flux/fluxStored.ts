import { isFunction } from 'fluxio/check';
import { getStorage } from '../storage';
import { Flux, flux } from './Flux';
import { findFlux } from './findFlux';

/**
 * Persist Flux value to localStorage and sync changes.
 * Requires a key to be set on the Flux instance.
 */
export const fluxStored = <T>(
  key: string,
  startValue: T,
  clean?: (value: T) => T|undefined,
  factory?: T | (() => T),
  storage = getStorage()
): Flux<T> =>
  findFlux<T>(key, () => {
    const target = flux<T>(startValue);

    storage.get(key).then(value => {
      if (value !== undefined && clean) value = clean(value);
      if (value === undefined && factory)
        value = isFunction(factory) ? factory() : factory;
      if (value !== undefined) target.set(value);
    });

    target.throttle(100).on((value) => {
      storage.set(key, value);
    });

    return target;
  });
