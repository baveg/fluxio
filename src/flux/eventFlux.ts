import { Pipe } from "./Flux";

type ObjectListener<K, E> = {
    addEventListener: (type: K, listener: (event: E) => void, ...args: any[]) => void;
    removeEventListener: (type: K, listener: (event: E) => void, ...args: any[]) => void;
}
type ExtractType<T> = T extends ObjectListener<infer K, any> ? K : never;
type ExtractEvent<T, K extends ExtractType<T>> = T extends ObjectListener<K, infer E> ? E : never;

interface EventFlux {
    <
        T extends ObjectListener<K, E>,
        K = ExtractType<T>,
        E = ExtractEvent<T, K>
    >(
        element: T,
        type: K,
        options?: any,
        key?: string
    ): Pipe<E>;
}

export const eventFlux = ((element: any, type: string, options?: any, key?: string) => {
    let lastEvent: Event;
    return new Pipe<Event>(
        (listener) => {
            const onEvent = (event: Event) => {
                lastEvent = event;
                listener();
            }
            element.addEventListener(type, onEvent, options);
            return () => element.removeEventListener(type, onEvent, options);
        },
        (pipe) => {
            pipe.set(lastEvent)
        },
        undefined,
        key
    );
}) as EventFlux;

const div = document.createElement('div');

eventFlux(div, 'click').on(event => event)