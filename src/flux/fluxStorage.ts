import { getStorage } from '../storage';
import { flux } from './Flux';
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
export const fluxStorage = <T>(
  key: string,
  init: T,
  check?: (value: T) => boolean,
  storage = getStorage()
) =>
  findFlux(key, () => {
    const value = storage.get(key, init, check);
    const target = flux(value);
    target.on((value) => storage.set(key, value));
    return target;
  });
