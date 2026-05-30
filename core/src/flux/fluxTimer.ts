import { pipe } from './Flux';

export const fluxTimer = (ms: number) =>
  pipe<number>(
    (listener) => {
      const timer = setInterval(listener, ms);
      return () => clearInterval(timer);
    },
    (pipe) => {
      pipe.set(Date.now());
    },
    undefined
  );
