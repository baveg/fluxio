import { isDefined } from 'fluxio/check';
import { getStorage } from '../storage';
import { Flux, flux, fluxLog } from './Flux';
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
  factory: T | (() => T),
  check?: (value: T) => boolean,
  storage = getStorage()
): Flux<T> =>
  findFlux(key, () => {
    const init = storage.get(key, factory, check);
    const target = flux<T>(init);
    target.throttle(50).on((value) => {
      fluxLog.d('fluxStored set', key, value);
      storage.set(key, value);
    });
    return target;
  });
