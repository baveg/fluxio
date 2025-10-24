import { pipe } from './Flux';

export type FElement<E extends Event = Event, K extends string = string> = {
  addEventListener: (type: K, listener: (event: E) => void, ...args: any[]) => void;
  removeEventListener: (type: K, listener: (event: E) => void, ...args: any[]) => void;
};

export const fluxEvent = <E extends Event = Event, K extends string = string>(
  element: FElement<E, K>,
  type: K,
  options?: any
) => {
  let lastEvent: E;
  return pipe<E>(
    (listener) => {
      const onEvent = (event: E) => {
        lastEvent = event;
        listener();
      };
      element.addEventListener(type, onEvent, options);
      return () => element.removeEventListener(type, onEvent, options);
    },
    (pipe) => {
      pipe.set(lastEvent);
    },
    undefined
  );
};
