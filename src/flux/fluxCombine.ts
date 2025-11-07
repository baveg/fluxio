import { Unsubscribe } from '../types/Unsubscribe';
import { Flux, pipe } from './Flux';

// Type utilities for Flux tuples
type FUnwrapSources<T extends readonly Flux<any>[]> = {
  [K in keyof T]: T[K] extends Flux<infer U> ? U : never;
};

/**
 * Combine multiple Flux instances into a single Pipe that emits tuples.
 * Updates whenever any source Flux changes.
 * @param sources Flux instances to combine
 * @returns Pipe emitting tuple of all source values
 * @example
 * const name$ = flux('John');
 * const age$ = flux(30);
 * const combined$ = fluxCombine(name$, age$);
 * combined$.on(([name, age]) => console.log(name, age));
 */
export const fluxCombine = <const Sources extends readonly Flux[]>(...sources: Sources) =>
  pipe<FUnwrapSources<Sources>>(
    (listener) => {
      const offs: Unsubscribe[] = [];
      for (const source of sources) offs.push(source.on(listener));
      return () => {
        for (const off of offs) off();
        offs.length = 0;
      };
    },
    (pipe) => {
      pipe.set(sources.map((s) => s.get()) as FUnwrapSources<Sources>);
    },
    (values) => {
      if (Array.isArray(values)) values.forEach((v: any, i) => sources[i]!.set(v));
    }
  );
