import { deepClone } from '../object/deepClone';
import { Dictionary } from '../types/Dictionary';
import { flux, Flux, Pipe } from './Flux';
import { isEmpty } from '../check/isEmpty';
import { isNil } from '../check/isNil';
import { merge } from '../object/merge';
import { isDefined } from 'fluxio/check';

export class FluxDictionary<T> extends Pipe<Dictionary<T>> {
  constructor(source: Flux<Dictionary<T>>) {
    super(
      source,
      () => {
        this.set(source.get());
      },
      (value) => {
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
    if (!prev) return;

    for (const key in changes) {
      if (changes[key] === prev[key]) {
        delete changes[key];
      }
    }

    if (isEmpty(changes)) return;

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

    this.set(next);
  }

  update(changes: Record<string, T>) {
    this.merge(changes, true);
  }

  getItem(id: string): T | undefined {
    return this.get()[id];
  }

  setItem(id: string, item?: T | undefined) {
    this.update({ [id]: item as T });
  }

  delete(id: string) {
    this.update({ [id]: null as T });
  }

  getItems() {
    return Object.values(this.get());
  }

  getItem$(id?: string) {
    return this.map((d) => (id ? d[id] : undefined));
  }
}

export const fluxDictionary = <T>(source: Flux<Dictionary<T>> = flux({})) =>
  new FluxDictionary(source);
