import { isFunction } from '../check/isFunction';
import { flux, Flux, isFlux } from './Flux';

export const map: Record<string, Flux<any>> = {};

export type FFactory<T> = () => Flux<T> | T | (() => T);

const createFlux = <T>(key: string, factory: FFactory<T>): Flux<T> => {
  const value = isFunction(factory) ? factory() : factory;
  const result = isFlux(value) ? (value as Flux<T>) : flux<T>(value as T);
  result.key = key;
  return result;
};

interface FindFlux {
  <T>(key: string, factory: () => Flux<T>): Flux<T>;
  <T>(key: string, factory: T | (() => T)): Flux<T>;
}

/**
 * Get or create a singleton Flux instance by key.
 * @param factory Value, factory function, or Flux factory
 * @param key Optional unique key for singleton lookup
 * @returns Existing or new Flux instance
 */
export const findFlux: FindFlux = <T>(key: string, factory: FFactory<T>): Flux<T> =>
  map[key] || (map[key] = createFlux(key, factory));
