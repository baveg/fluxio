import { deepClone } from '@common/utils';
import { Dictionary } from '../check/isDictionary';
import { Flux, Pipe } from './Flux';

export class FluxDictionary<T> extends Pipe<Dictionary<T>> {
  apply(cb: (next: Dictionary<T>) => void) {
    const prev = this.get();
    const next = deepClone({ ...prev });
    cb(next);
    this.set(next);
    return this;
  }

  merge(changes: Record<string, Partial<T>>, isReplace?: boolean) {
    const prev = this.v;
    if (!prev) return this;

    for (const key in changes) {
      if (changes[key] === prev[key]) {
        delete changes[key];
      }
    }

    if (isItemEmpty(changes)) return this;

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
    return this.v[id];
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
}

export const fluxDictionary = <T>(source: Flux<T>) => new FluxDictionary(source);
