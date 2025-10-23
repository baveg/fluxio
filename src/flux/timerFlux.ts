import { Pipe } from "./Flux";
import { flux } from "./getOrCreateFlux";

export const timerFlux = (ms: number, key?: string) => flux(
    () => new Pipe<number>(
        (listener) => {
            const timer = setInterval(listener, ms);
            return () => clearInterval(timer);
        },
        (pipe) => {
            pipe.set(Date.now())
        }
    ),
    key
);