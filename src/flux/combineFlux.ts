import { Flux, pipe, FUnsubscribe } from './Flux';

// Type utilities for Flux tuples
type FUnwrapSources<T extends readonly Flux<any>[]> = {
  [K in keyof T]: T[K] extends Flux<infer U> ? U : never;
};

/**
 * Combine multiple Flux instances into a single Pipe that emits tuples.
 * Updates whenever any source Flux changes.
 * @param sources Array of Flux instances to combine
 * @param key Optional key for the combined Pipe
 * @returns Pipe emitting tuple of all source values
 * @example
 * const name$ = flux('John');
 * const age$ = flux(30);
 * const combined$ = combineFlux([name$, age$], 'name+age');
 * combined$.on(([name, age]) => console.log(name, age));
 */
export const combineFlux = <const Sources extends readonly Flux[]>(sources: Sources) =>
  pipe<FUnwrapSources<Sources>>(
    (listener) => {
      const offs: FUnsubscribe[] = [];
      for (const source of sources) offs.push(source.on(listener));
      return () => {
        for (const off of offs) off();
        offs.length = 0;
      };
    },
    (pipe) => {
      pipe.set(sources.map((s) => s.get()) as FUnwrapSources<Sources>);
    },
    (pipe) => {
      const values = pipe.get();
      if (Array.isArray(values)) values.forEach((v: any, i) => sources[i]!.set(v));
    }
  );
