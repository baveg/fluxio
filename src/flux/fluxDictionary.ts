import { deepClone } from '../object/deepClone';
import { Dictionary } from '../check/isDictionary';
import { Flux, Pipe } from './Flux';
import { isEmpty } from '../check/isEmpty';
import { isNil } from '../check/isNil';
import { merge } from '../object/merge';

export class FluxDictionary<T> extends Pipe<Dictionary<T>> {
  constructor(source: Flux<Dictionary<T>>) {
    super(
      source,
      () => {
        this.set(source.get());
      },
      (_, value) => {
        source.set(value);
      }
    );
  }

  apply(cb: (next: Dictionary<T>) => void) {
    const prev = this.get();
    const next = deepClone({ ...prev });
    cb(next);
    this.set(next);
    return this;
  }

  merge(changes: Record<string, Partial<T>>, isReplace?: boolean) {
    const prev = this.get();
    if (!prev) return this;

    for (const key in changes) {
      if (changes[key] === prev[key]) {
        delete changes[key];
      }
    }

    if (isEmpty(changes)) return this;

    const next = { ...prev };

    for (const key in changes) {
      if (isNil(changes[key])) {
        delete next[key];
      } else if (!isReplace) {
        next[key] = merge(next[key], changes[key]);
      } else {
        next[key] = changes[key] as T;
      }
    }

    return this.set(next);
  }

  update(changes: Record<string, T>) {
    return this.merge(changes, true);
  }

  getItem(id: string): T | undefined {
    return this.get()[id];
  }

  setItem(id: string, item: T | undefined) {
    return this.update({ [id]: item as T });
  }

  delete(id: string) {
    return this.update({ [id]: null as T });
  }

  getItems() {
    return Object.values(this.get());
  }

  getItem$(id: string) {
    return this.map((d) => d[id]);
  }
}

export const fluxDictionary = <T>(source: Flux<Dictionary<T>>) => new FluxDictionary(source);
