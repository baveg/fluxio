import { Pipe } from "./Flux";

export type FluxElement<E extends Event = Event, K extends string = string> = {
    addEventListener: (type: K, listener: (event: E) => void, ...args: any[]) => void;
    removeEventListener: (type: K, listener: (event: E) => void, ...args: any[]) => void;
}

export const eventFlux = <E extends Event = Event, K extends string = string>(
    element: FluxElement<E, K>,
    type: K,
    options?: any,
    key?: string
): Pipe<E> => {
    let lastEvent: E;
    return new Pipe<E>(
        (listener) => {
            const onEvent = (event: E) => {
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
};