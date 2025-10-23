import { Flux, Pipe, Unsubscribe } from "./Flux";

// Type utilities for Flux tuples
type UnwrapFlux<T extends readonly Flux<any>[]> = {
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
export const combineFlux = <const Sources extends readonly Flux[]>(
    sources: Sources,
    combineKey?: string
): Pipe<UnwrapFlux<Sources>> => {
    if (!combineKey) combineKey = sources.map((f) => f.key).join('+');
    
    return new Pipe(
        (listener) => {
            const offs: Unsubscribe[] = [];
            for (const source of sources) offs.push(source.on(listener));
            return () => {
                for (const off of offs) off();
                offs.length = 0;
            };
        },
        (pipe) => {
            pipe.set(sources.map((s) => s.get()) as UnwrapFlux<Sources>);
        },
        (pipe) => {
            const values = pipe.get();
            if (Array.isArray(values)) values.forEach((v: any, i) => sources[i]!.set(v));
        },
        combineKey
    );
}