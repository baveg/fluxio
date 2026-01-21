import { Flux, Pipe } from "./Flux";
import { isItem } from "fluxio/check/isItem";

export const fluxProp = <T extends {}, P extends keyof T>(source: Flux<T>, prop: P): Pipe<T[P], T[P]> => {
  return new Pipe<T[P], T[P]>(
    source as any,
    (pipe) => {
      const obj = source.get();
      const value = isItem(obj) ? obj[prop] : undefined;
      pipe.set(value as T[P]);
    },
    (value) => {
      const item = source.get();
      source.set({ ...item, [prop]: value } as T);
    }
  );
} 