import { isDefined } from 'fluxio/check';
import { getStorage } from '../storage';
import { Flux, flux } from './Flux';
import { findFlux } from './findFlux';

/**
 * Persist Flux value to localStorage and sync changes.
 * Requires a key to be set on the Flux instance.
 * @param check Optional validation function for stored value
 * @returns This instance for chaining
 * @example
 * const count$ = flux(0, 'counter');
 * count$.store(); // Loads from localStorage and auto-saves changes
 */
export const fluxStored = <T>(
  key: string,
  init: T,
  check?: (value: T) => boolean,
  storage = getStorage()
): Flux<T> =>
  findFlux(key, () => {
    const target = flux<T>(init);
    storage.get(key, init, check).then(value => {
      if (isDefined(value)) target.set(value);
      target.throttle(100).on((value) => {
        storage.set(key, value);
      });
    });
    return target;
  });
