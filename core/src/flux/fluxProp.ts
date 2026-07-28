import { Flux, Pipe } from './Flux';
import { isItem } from '../check/isItem';

export const fluxProp = <T extends {}, P extends keyof T>(
  source: Flux<T>,
  prop: P,
  clean?: (v: T[P]) => T[P],
): Pipe<T[P], T[P]> => {
  return new Pipe<T[P], T[P]>(
    source as any,
    (pipe) => {
      const obj = source.get();
      let value = isItem(obj) ? obj[prop] : undefined;
      if (clean) value = clean(value as T[P]);
      pipe.set(value as T[P], true);
    },
    (value) => {
      if (clean) value = clean(value);
      const item = source.get();
      if (isItem(item) && item[prop] === value) return;
      source.set({ ...item, [prop]: value } as T);
    }
  );
};
