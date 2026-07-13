import { isFunction } from '../check/isFunction';

type P<T> = Promise<T> | (() => Promise<T>);

interface Parallel {
  <T>(promises: P<T>[], concurrency?: number): Promise<T[]>;
  <A, B>(promises: [P<A>, P<B>], concurrency?: number): Promise<[A, B]>;
  <A, B, C>(promises: [P<A>, P<B>, P<C>], concurrency?: number): Promise<[A, B, C]>;
  <A, B, C, D>(promises: [P<A>, P<B>, P<C>, P<D>], concurrency?: number): Promise<[A, B, C, D]>;
  <A, B, C, D, E>(
    promises: [P<A>, P<B>, P<C>, P<D>, P<E>],
    concurrency?: number
  ): Promise<[A, B, C, D, E]>;
  <A, B, C, D, E, F>(
    promises: [P<A>, P<B>, P<C>, P<D>, P<E>, P<F>],
    concurrency?: number
  ): Promise<[A, B, C, D, E, F]>;
  <A, B, C, D, E, F, G>(
    promises: [P<A>, P<B>, P<C>, P<D>, P<E>, P<F>, P<G>],
    concurrency?: number
  ): Promise<[A, B, C, D, E, F, G]>;
  <A, B, C, D, E, F, G, H>(
    promises: [P<A>, P<B>, P<C>, P<D>, P<E>, P<F>, P<G>, P<H>],
    concurrency?: number
  ): Promise<[A, B, C, D, E, F, G, H]>;
}

export const parallel = (async <T>(promises: P<T>[], concurrency: number = 3): Promise<T[]> => {
  const results: T[] = new Array(promises.length);
  let i = 0;
  let running = 0;
  let err: Error | null = null;

  return new Promise((resolve, reject) => {
    const run = () => {
      if (err) return;

      if (i >= promises.length && running === 0) {
        resolve(results);
        return;
      }

      while (running < concurrency && i < promises.length && !err) {
        const curr = i++;
        running++;

        const p = promises[curr];
        (isFunction(p) ? p() : p)
          .then((value) => {
            if (err) return;
            results[curr] = value;
            running--;
            run();
          })
          .catch((e) => {
            if (!err) reject((err = e));
          });
      }
    };

    run();
  });
}) as Parallel;
