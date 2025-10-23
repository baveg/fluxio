import { Pipe } from "./Flux";
import { flux } from "./getOrCreateFlux";

type AddListener<K, E> = (type: K, listener: (event: E) => void, ...args: any[]) => void;
type RemoveListener<K, E> = (type: K, listener: (event: E) => void, ...args: any[]) => void;
type ExtractType<F> = F extends AddListener<infer K, infer E> ? K : never;
type ExtractEvent<F> = F extends AddListener<infer K, infer E> ? E : never;
type Element<K, E> = {
    addEventListener: AddListener<K, E>;
    removeEventListener: RemoveListener<K, E>;
}

export const eventFlux = <
    T extends Element<K, E>,
    K extends ExtractType<T> = ExtractType<T>,
    E extends ExtractEvent<T> = ExtractEvent<T>,
>(
    element: T,
    type: K,
    options?: any,
    key?: string
) => flux(
    () => {
        let event: E;
        return new Pipe<E>(
            (listener) => {
                const onEvent = (e: E) => {
                    event = e;
                    listener();
                }
                element.addEventListener(type as any, onEvent as any, options);
                return () => element.removeEventListener(type as any, onEvent as any, options);
            },
            (pipe) => {
                pipe.set(event)
            }
        )
    },
    key
);

eventFlux(document.body, 'click', {}, 'bodyClick')