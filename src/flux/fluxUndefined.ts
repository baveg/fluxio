import { flux, Pipe } from './Flux';

export const fluxUndefined = flux<undefined>(undefined).map(() => undefined) as Pipe<
  undefined,
  any
>;
