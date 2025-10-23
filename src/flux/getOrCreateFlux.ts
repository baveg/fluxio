import { isFunction } from "../check/isFunction";
import { Flux } from "./Flux";

export const fluxByKey: Record<string, Flux<any>> = {};

export type FluxFactory<T> = T | (() => T) | (() => Flux<T>);

const createFlux = <T>(factory: FluxFactory<T>, key?: string) => {
    const value = isFunction(factory) ? factory() : factory;
    const flux = value instanceof Flux ? value : new Flux<T>(value, key);
    if (key) fluxByKey[key] = flux;
    return flux;
}

/**
 * Get or create a singleton Flux instance by key.
 * @param factory Value, factory function, or Flux factory
 * @param key Optional unique key for singleton lookup
 * @returns Existing or new Flux instance
 */
export const getOrCreateFlux = <T>(factory: T | (() => T) | (() => Flux<T>), key?: string) =>
    key && fluxByKey[key] || createFlux(factory, key);

/**
 * Get or create a singleton Flux instance by key.
 * @param factory Value, factory function, or Flux factory
 * @param key Optional unique key for singleton lookup
 * @returns Existing or new Flux instance
 */
export const flux = getOrCreateFlux;