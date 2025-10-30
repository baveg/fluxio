import { isFunction, isUndefined } from 'fluxio/check';
import { isArray } from 'fluxio/check/isArray';
import { isDefined } from 'fluxio/check/isDefined';
import { isFloat } from 'fluxio/check/isNumber';

type Factory<T, U> = U | ((v: T) => U);
type Is<T> = (v: T) => boolean;
type NN<T> = NonNullable<T>;

interface GetPath {
  <T = any, U = any>(obj: T, path: string): U | undefined;
  <T = any, U = any>(obj: T, path: string, factory: Factory<T, U>, is?: (v: U) => boolean): U;

  <T, A extends keyof T>(obj: T, path: [A]): T[A] | undefined;
  <T, A extends keyof T, B extends keyof NN<T[A]>>(obj: T, path: [A, B]): NN<T[A]>[B] | undefined;
  <T, A extends keyof T, B extends keyof NN<T[A]>, C extends keyof NN<NN<T[A]>[B]>>(
    obj: T,
    path: [A, B, C]
  ): NN<NN<T[A]>[B]>[C] | undefined;
  <
    T,
    A extends keyof T,
    B extends keyof NN<T[A]>,
    C extends keyof NN<NN<T[A]>[B]>,
    D extends keyof NN<NN<NN<T[A]>[B]>[C]>,
  >(
    obj: T,
    path: [A, B, C, D]
  ): NN<NN<NN<T[A]>[B]>[C]>[D] | undefined;

  <T, A extends keyof T>(obj: T, path: [A], factory: Factory<T, T[A]>, is?: Is<T[A]>): T[A];
  <T, A extends keyof T, B extends keyof NN<T[A]>>(
    obj: T,
    path: [A, B],
    factory: Factory<T, NN<NN<T[A]>[B]>>,
    is?: Is<NN<NN<T[A]>[B]>>
  ): NN<NN<T[A]>[B]>;
  <T, A extends keyof T, B extends keyof NN<T[A]>, C extends keyof NN<NN<T[A]>[B]>>(
    obj: T,
    path: [A, B, C],
    factory: Factory<T, NN<NN<NN<T[A]>[B]>[C]>>,
    is?: Is<NN<NN<NN<T[A]>[B]>[C]>>
  ): NN<NN<NN<T[A]>[B]>[C]>;
  <
    T,
    A extends keyof T,
    B extends keyof NN<T[A]>,
    C extends keyof NN<NN<T[A]>[B]>,
    D extends keyof NN<NN<NN<T[A]>[B]>[C]>,
  >(
    obj: T,
    path: [A, B, C, D],
    factory: Factory<T, NN<NN<NN<NN<T[A]>[B]>[C]>[D]>>,
    is?: Is<NN<NN<NN<NN<T[A]>[B]>[C]>[D]>>
  ): NN<NN<NN<NN<T[A]>[B]>[C]>[D]>;
}

export const getPath = (<T, U>(
  obj: any,
  path: string | string[],
  factory?: Factory<T, U>,
  is?: Is<T>
): U | undefined => {
  const keys = isArray(path) ? [...path] : path.split('/');

  if (keys.length === 0) return obj as any;

  if (factory) {
    const lastKey = keys.pop() || '';
    let node = obj;
    for (const key of keys) node = node[key] || (node[key] = {});
    const value = node[lastKey];
    if (!is) is = isDefined;
    return is(value) ? value : (node[lastKey] = isFunction(factory) ? factory(obj) : factory);
  } else {
    let node = obj;
    for (const key of keys) {
      if (isUndefined(node)) return undefined;
      node = node[key];
    }
    return node;
  }
}) as GetPath;

// const a = { items: [{}, {}, {}, {}, { id: 5 }] };
// getPath(a, ['items', 5, 'id']);
// getPath(a, ['items', 5, 'id'], () => 5, isFloat);
