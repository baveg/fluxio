import { Pipe } from "./Flux";
import { flux } from "./getOrCreateFlux";

type AddListener<K, E> = (type: K, listener: (event: E) => void, ...args: any[]) => void;
type RemoveListener<K, E> = (type: K, listener: (event: E) => void, ...args: any[]) => void;
type ExtractType<F> = F extends AddListener<infer K, any> ? K : never;
type ExtractEvent<F> = F extends AddListener<any, infer E> ? E : never;
type ObjectListener<K extends string, E> = {
    addEventListener: AddListener<K, E>;
    removeEventListener: RemoveListener<K, E>;
}

interface EventFlux {
    <T extends ObjectListener<K, E>, K extends string, E extends Event>(
        element: T, type: K, options?: any, key?: string
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

eventFlux(document.body, 'click').on(event => event)