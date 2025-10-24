import { isFunction } from '../check/isFunction';
import { flux, Flux } from './Flux';

export const map: Record<string, Flux<any>> = {};

export type FFactory<T> = T | (() => T) | (() => Flux<T>);

const createFlux = <T>(factory: FFactory<T>) => {
  const value = isFunction(factory) ? factory() : factory;
  return value instanceof Flux ? value : flux<T>(value);
};

/**
 * Get or create a singleton Flux instance by key.
 * @param factory Value, factory function, or Flux factory
 * @param key Optional unique key for singleton lookup
 * @returns Existing or new Flux instance
 */
export const findFlux = <T>(key: string, factory: FFactory<T>) =>
  map[key] || (map[key] = createFlux(factory));
