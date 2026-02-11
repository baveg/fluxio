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
  clean?: (value: T) => T | undefined,
  factory?: T | (() => T),
  storage = getStorage()
): Flux<T> =>
  findFlux<T>(key, () => {
    const target = flux<T>(startValue);

    let isStoredInit = false;
    let stored: T|undefined;

    storage.get(key).then((value) => {
      isStoredInit = true;

      stored = value !== undefined && clean ? clean(value) : value;
      
      if (stored === undefined && factory) {
        stored = isFunction(factory) ? factory() : factory;
      }

      if (stored !== undefined) {
        target.set(value);
      }
    });

    target.throttle(100).on((value) => {
      if (isStoredInit && value !== stored) {
        storage.set(key, value);
      }
    });

    return target;
  });
