import { Flux, pipe } from './Flux';

/**
 * Merge multiple Flux instances into a single Pipe that emits the latest value from any source.
 * Updates whenever any source Flux changes, emitting only that source's value.
 * @param sources Array of Flux instances to merge
 * @returns Pipe emitting the latest value from any source
 * @example
 * const a$ = flux(1);
 * const b$ = flux(2);
 * const merged$ = mergeFlux([a$, b$]);
 * merged$.on(value => console.log(value)); // logs: 1 (initial)
 * a$.set(3); // merged$ emits: 3
 * b$.set(4); // merged$ emits: 4
 */
export const fluxUnion = <T>(...sources: Flux<T>[]) => {
  let last: T | undefined = undefined;
  return pipe<T | undefined>(
    (listener) => {
      const handle = (value: T) => {
        last = value;
        listener();
      };
      const offs = sources.map((source) => source.on(handle));
      return () => {
        for (const off of offs) off();
        offs.length = 0;
      };
    },
    (pipe) => {
      pipe.set(last);
    }
  );
};
