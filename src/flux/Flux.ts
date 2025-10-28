import { throttle } from '../async/throttle';
import { debounce } from '../async/debounce';
import { isDefined } from '../check/isDefined';
import { isFunction } from '../check/isFunction';
import { toVoid } from '../cast/toVoid';
import { logger } from '../logger/Logger';
import { removeItem } from '../array/removeItem';

export const fluxLog = logger('Flux');

export type FListener<T> = (value: T, error?: any) => void;
export type FUnsubscribe = () => void;
export type FNext<T> = T | ((prev: T) => T);

export type PipeSource<T, U> = Flux<U> | ((listener: () => void) => FUnsubscribe);
export type PipeOnSync<T, U> = (pipe: Pipe<T, U>) => void;
export type PipeOnSet<T, U> = (value: T, pipe: Pipe<T, U>) => void;
export type PipeOnInit<T, U> = (pipe: Pipe<T, U>) => void;

/**
 * Reactive state container with observable pattern.
 * Supports subscriptions, transformations, and persistence.
 */
export class Flux<T = any> {
  public readonly listeners: FListener<T>[] = [];
  public log = fluxLog;
  public v: T;
  private _get?: typeof this.get;
  private _set?: typeof this.set;

  constructor(init: T) {
    this.v = init;
  }

  /**
   * Compares two values for equality. Override for custom equality logic.
   * @param prev Previous value
   * @param next Next value
   * @returns True if values are equal
   */
  isEqual(prev: T, next: T) {
    return prev === next;
  }

  /**
   * Get the current value.
   * @returns Current value
   */
  get() {
    return this.v;
  }

  /**
   * Returns the current value for JSON serialization.
   * Allows Flux to be used directly in JSON.stringify().
   * @example
   * const flux$ = flux({ a: 1, b: 2 });
   * JSON.stringify(flux$) // '{"a":1,"b":2}'
   */
  toJSON() {
    return this.get();
  }

  /**
   * Returns the string representation of the current value.
   * Allows Flux to be used in string contexts.
   * @example
   * const flux$ = flux('hello');
   * String(flux$) // 'hello'
   * flux$ + ' world' // 'hello world'
   * const num$ = flux(42);
   * String(num$) // '42'
   */
  toString() {
    return String(this.get());
  }

  /**
   * Set a new value and notify listeners if changed.
   * @param next New value or updater function
   * @param force Force notification even if value hasn't changed
   */
  set(next: FNext<T>, force?: boolean) {
    const value = isFunction(next) ? next(this.get()) : next;
    if (!force && this.isEqual(this.v, value)) {
      this.log.d('set isEqual', value, this.v, this.listeners);
      return;
    }
    this.log.d('set', value, this.listeners);
    this.v = value;
    for (const listener of this.listeners) listener(value);
  }

  error(error: any) {
    const value = this.v;
    this.log.w('error', error, this.listeners);
    for (const listener of this.listeners) listener(value, error);
  }

  /**
   * Forces notification of all listeners without changing the value.
   * Useful when the internal state has mutated but the reference is the same.
   */
  notify() {
    this.set(this.get(), true);
  }

  /**
   * Get bound getter function.
   * @returns Bound get method
   */
  public getter() {
    return this._get || (this._get = this.get.bind(this));
  }

  /**
   * Get bound setter function.
   * @returns Bound set method
   */
  public setter() {
    return this._set || (this._set = this.get.bind(this));
  }

  /**
   * Subscribe to value changes.
   * @param listener Callback function to receive new values
   * @param isRepeat If true, immediately call listener with current value
   * @returns Unsubscribe function
   */
  on(listener: FListener<T>, isRepeat?: boolean): FUnsubscribe {
    if (isRepeat) listener(this.get());
    this.listeners.push(listener);
    return () => this.off(listener);
  }

  /**
   * Unsubscribe a specific listener.
   * @param listener Listener function to remove
   * @returns This instance for chaining
   */
  off(listener: FListener<T>) {
    if (removeItem(this.listeners, listener).length === 0) {
      this.clear();
    }
    return this;
  }

  /**
   * Remove all listeners.
   */
  clear() {
    this.listeners.length = 0;
  }

  /**
   * Wait for a value that passes the filter condition.
   * @param filter Predicate function to test values
   * @returns Promise that resolves with the matching value
   * @example
   * const user$ = flux(null);
   * const user = await user$.wait(); // Waits for non-null value
   */
  async wait(filter: (value: T, error: any) => boolean = isDefined) {
    return new Promise<T>((resolve, reject) => {
      const off = this.on((value, error) => {
        try {
          if (filter(value, error)) {
            off();
            resolve(value);
          }
        } catch (e) {
          reject(e);
        }
      });
    });
  }

  /**
   * Creates a bidirectional pipe with custom sync logic.
   * @param sync Function called to sync source value to pipe
   * @param onSet Function called when pipe value is set (for reverse sync)
   * @returns A new Pipe instance
   */
  pipe<U = T>(
    onSync: PipeOnSync<U, T>,
    onSet: PipeOnSet<U, T> = toVoid,
    onInit: PipeOnInit<U, T> = toVoid,
  ) {
    return new Pipe<U, T>(this, onSync, onSet, onInit);
  }

  /**
   * Transform values with a mapping function.
   * @param convert Function to transform values
   * @param reverse Optional reverse transform for bidirectional sync
   * @returns Pipe with transformed values
   * @example
   * const count$ = flux(5);
   * const doubled$ = count$.map(n => n * 2, n => n / 2);
   * doubled$.get() // 10
   */
  map<U>(convert: (value: T) => U, reverse?: (value: U) => T) {
    return this.pipe<U>(
      (pipe) => {
        try {
          pipe.set(convert(this.get()));
        } catch (e) {
          pipe.error(e);
        }
      },
      reverse ?
        (value) => {
          this.set(reverse(value));
        }
      : undefined
    );
  }

  /**
   * Transform values asynchronously with a mapping function.
   * @param convert Async function to transform values
   * @param reverse Optional async reverse transform
   * @returns Pipe with async transformed values
   * @example
   * const userId$ = flux(123);
   * const user$ = userId$.mapAsync(id => fetchUser(id));
   */
  mapAsync<U>(convert: (value: T) => Promise<U>, reverse?: (value: U) => Promise<T>) {
    return this.pipe<U>(
      (pipe) => {
        convert(this.get())
          .then(value => pipe.set(value))
          .catch((error) => pipe.error(error));
      },
      reverse ?
        (value) => {
          reverse(value)
            .then(this.setter())
            .catch((error) => this.error(error));
        }
      : undefined
    );
  }

  /**
   * Debounce emissions - only emit after silence period.
   * @param ms Milliseconds to wait after last emission
   * @returns Debounced Pipe
   * @example
   * const search$ = flux('');
   * const debounced$ = search$.debounce(300);
   * // Only emits 300ms after user stops typing
   */
  debounce(ms: number) {
    return this.pipe(
      debounce((pipe: Pipe<T, T>) => pipe.set(this.get()), ms),
      (value) => this.set(value),
      (pipe) => pipe.set(this.get()),
    );
  }

  /**
   * Throttle emissions - emit at most once per time period.
   * @param ms Minimum milliseconds between emissions
   * @returns Throttled Pipe
   * @example
   * const scroll$ = flux(0);
   * const throttled$ = scroll$.throttle(100);
   * // Emits at most once every 100ms
   */
  throttle(ms: number) {
    return this.pipe(
      throttle((pipe: Pipe<T, T>) => pipe.set(this.get()), ms),
      (value) => this.set(value),
      (pipe) => pipe.set(this.get()),
    );
  }

  /**
   * Delay emissions by specified time.
   * @param ms Milliseconds to delay
   * @returns Delayed Pipe
   */
  delay(ms: number): Pipe<T, T> {
    return this.pipe((pipe) => {
      const val = this.get();
      setTimeout(() => pipe.set(val), ms);
    }, undefined);
  }

  /**
   * Creates a new Flux that only emits values that pass the filter predicate.
   * @param predicate Function that tests each value
   * @returns A new Pipe that only emits filtered values
   */
  filter(predicate: (value: T) => boolean) {
    return this.pipe((pipe) => {
      const value = this.get();
      if (predicate(value)) {
        pipe.set(value);
      }
    }, undefined);
  }

  /**
   * Apply an accumulator function, emitting each intermediate result.
   * Similar to Array.reduce but emits all intermediate values.
   *
   * @example
   * const count$ = flux(1);
   * const sum$ = count$.scan((acc, n) => acc + n, 0);
   * // count$ changes: 1 → 2 → 3
   * // sum$ emits:     1 → 3 → 6
   */
  scan<U>(accumulator: (acc: U, value: T) => U, seed: U) {
    let acc = seed;
    return this.pipe<U>((pipe) => {
      acc = accumulator(acc, this.get());
      pipe.set(acc);
    }, undefined);
  }
}

export class Pipe<T = any, U = T> extends Flux<T> {
  private sourceOff?: () => void;
  public isInit?: boolean;

  constructor(
    public readonly source: PipeSource<T, U>,
    public readonly onSync: PipeOnSync<T, U>,
    public readonly onSet: PipeOnSet<T, U> = toVoid,
    public readonly onInit: PipeOnInit<T, U> = toVoid,
  ) {
    super(undefined as T);
  }

  get() {
    if (!this.isInit) {
      this.isInit = true;
      this.onInit(this);
      this.onSync(this);
    }
    return super.get();
  }

  set(next: FNext<T>, force?: boolean) {
    if (isFunction(next)) next = next(this.get());
    super.set(next, force);
    this.onSet(next, this);
  }

  on(listener: FListener<T>, isRepeat?: boolean) {
    const off = super.on(listener, isRepeat);

    if (!this.sourceOff) {
      const listener = () => {
        if (!this.isInit) {
          this.isInit = true;
          this.onInit(this);
        }
        this.onSync(this);
      };
      this.sourceOff = isFunction(this.source) ? this.source(listener) : this.source.on(listener);
    }

    return off;
  }

  clear() {
    super.clear();

    if (this.sourceOff) {
      this.sourceOff();
      this.sourceOff = undefined;
    }
  }
}

/**
 * Create Flux instance.
 * @param factory Value, factory function, or Flux factory
 * @returns Existing or new Flux instance
 */
export const flux = <T>(init: T) => new Flux<T>(init);

/**
 * Create Pipe instance.
 * @param source Flux, or listener
 * @returns Existing or new Flux instance
 */
export const pipe = <T = any, U = T>(
  source: PipeSource<T, U>,
  onSync: PipeOnSync<T, U>,
  onSet?: PipeOnSet<T, U>,
  onInit?: PipeOnInit<T, U>,
) => new Pipe<T, U>(source, onSync, onSet, onInit);

export const isFlux = (v: any): v is Flux => v instanceof Flux;
