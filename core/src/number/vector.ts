import type {
  Vector1,
  Vector2,
  Vector3,
  Vector4,
  Vector5,
  Vector6,
  Vector7,
  Vector8,
  Vector9,
  Vector,
  WVector,
} from '../types/Vector';
import { clamp } from './clamp';
import { isDefined } from '../check/isDefined';
import { max } from './max';
import { min } from './min';
import { isArray } from '../check/isArray';

export const VECTOR1_ZERO: Vector1<number> = [0];
export const VECTOR2_ZERO: Vector2<number> = [0, 0];
export const VECTOR3_ZERO: Vector3<number> = [0, 0, 0];
export const VECTOR4_ZERO: Vector4<number> = [0, 0, 0, 0];
export const VECTOR5_ZERO: Vector5<number> = [0, 0, 0, 0, 0];
export const VECTOR6_ZERO: Vector6<number> = [0, 0, 0, 0, 0, 0];
export const VECTOR7_ZERO: Vector7<number> = [0, 0, 0, 0, 0, 0, 0];
export const VECTOR8_ZERO: Vector8<number> = [0, 0, 0, 0, 0, 0, 0, 0];
export const VECTOR9_ZERO: Vector9<number> = [0, 0, 0, 0, 0, 0, 0, 0, 0];

const M = Number.MAX_VALUE;
export const VECTOR1_MAX: Vector1 = [M];
export const VECTOR2_MAX: Vector2 = [M, M];
export const VECTOR3_MAX: Vector3 = [M, M, M];
export const VECTOR4_MAX: Vector4 = [M, M, M, M];
export const VECTOR5_MAX: Vector5 = [M, M, M, M, M];
export const VECTOR6_MAX: Vector6 = [M, M, M, M, M, M];
export const VECTOR7_MAX: Vector7 = [M, M, M, M, M, M, M];
export const VECTOR8_MAX: Vector8 = [M, M, M, M, M, M, M, M];
export const VECTOR9_MAX: Vector9 = [M, M, M, M, M, M, M, M, M];

/**
 * Creates a standardized error for vector operations, naming the offending argument.
 *
 * @example
 * ```ts
 * throw vectorError('b'); // Error: VectorError (b)
 * ```
 */
export const vectorError = (prop: string) => new Error(`VectorError (${prop})`);

/**
 * Applies a binary operation component-wise between two vectors of the same length.
 * Throws a {@link vectorError} if either vector is missing or their lengths differ.
 *
 * @example
 * ```ts
 * opVector([1, 2, 3], [10, 20, 30], (a, b) => a + b); // [11, 22, 33]
 * ```
 */
export const opVector = <V extends Vector<any> = Vector>(
  a: V,
  b: V,
  op: (a: V[0], b: V[0]) => V[0]
): V => {
  if (!a || !b) throw vectorError(a ? 'b' : 'a');
  const l = a.length;
  if (b.length !== l) throw vectorError('b');
  const r: V[0][] = [];
  for (let i = 0; i < l; i++) r[i] = op(a[i]!, b[i]!);
  return r as unknown as V;
};

/**
 * Applies a ternary operation component-wise across three vectors of the same length.
 * Throws a {@link vectorError} if any vector is missing or their lengths differ.
 *
 * @example
 * ```ts
 * op3Vector([1, 5, 10], [0, 0, 0], [3, 3, 3], clamp); // [1, 3, 3]
 * ```
 */
export const op3Vector = <V extends Vector<any> = Vector>(
  a: V,
  b: V,
  c: V,
  op: (a: V[0], b: V[0], c: V[0]) => V[0]
): V => {
  if (!a || !b || !c)
    throw vectorError(
      a ?
        b ? 'c'
        : 'b'
      : 'a'
    );
  const l = a.length;
  if (b.length !== l) throw vectorError('b');
  if (c.length !== l) throw vectorError('c');
  const r: V[0][] = [];
  for (let i = 0; i < l; i++) r[i] = op(a[i]!, b[i]!, c[i]!);
  return r as unknown as V;
};

/**
 * Clamps each component of a vector between the matching components of `min` and `max`.
 *
 * @example
 * ```ts
 * clampVector([1, 5, 10], [0, 0, 0], [3, 3, 3]); // [1, 3, 3]
 * ```
 */
export const clampVector = <V extends Vector>(v: V, min: V, max: V) =>
  op3Vector<V>(v, min, max, clamp);

/**
 * Adds two vectors component-wise.
 *
 * @example
 * ```ts
 * addVector([1, 2, 3], [10, 20, 30]); // [11, 22, 33]
 * ```
 */
export const addVector = <V extends Vector>(a: V, b: V) => opVector<V>(a, b, (a, b) => a + b);

/**
 * Subtracts the second vector from the first, component-wise.
 *
 * @example
 * ```ts
 * subVector([10, 20, 30], [1, 2, 3]); // [9, 18, 27]
 * ```
 */
export const subVector = <V extends Vector>(a: V, b: V) => opVector<V>(a, b, (a, b) => a - b);

/**
 * Multiplies two vectors component-wise.
 *
 * @example
 * ```ts
 * mulVector([1, 2, 3], [10, 20, 30]); // [10, 40, 90]
 * ```
 */
export const mulVector = <V extends Vector>(a: V, b: V) => opVector<V>(a, b, (a, b) => a * b);

/**
 * Takes the component-wise minimum of two vectors.
 *
 * @example
 * ```ts
 * minVector([1, 5, 3], [4, 2, 6]); // [1, 2, 3]
 * ```
 */
export const minVector = <V extends Vector>(a: V, b: V) => opVector<V>(a, b, min);

/**
 * Takes the component-wise maximum of two vectors.
 *
 * @example
 * ```ts
 * maxVector([1, 5, 3], [4, 2, 6]); // [4, 5, 6]
 * ```
 */
export const maxVector = <V extends Vector>(a: V, b: V) => opVector<V>(a, b, max);

/**
 * Merges two vectors component-wise, preferring `b`'s components when defined,
 * falling back to `a`'s otherwise.
 *
 * @example
 * ```ts
 * mergeVector([1, 2, 3], [undefined, 20, undefined]); // [1, 20, 3]
 * ```
 */
export const mergeVector = <V extends Vector>(a: V, b: Vector<V[0] | undefined>) =>
  opVector<V>(a, b as V, (a, b) => (isDefined(b) ? b : a));

/**
 * Checks whether two vectors have the same length and equal components.
 * Returns `false` if only one of the two is `null`/`undefined`.
 *
 * @example
 * ```ts
 * eqVector([1, 2, 3], [1, 2, 3]); // true
 * eqVector([1, 2, 3], [1, 2, 4]); // false
 * ```
 */
export const eqVector = <V extends Vector>(
  a: V | null | undefined,
  b: V | null | undefined
): boolean => {
  if (!a || !b) return a === b;
  const l = a.length;
  if (b.length !== l) return false;
  for (let i = 0; i < l; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
};

/**
 * Returns a shallow copy of a vector as a mutable array.
 *
 * @example
 * ```ts
 * cloneVector([1, 2, 3]); // [1, 2, 3] (new array instance)
 * ```
 */
export const cloneVector = <T>(vector: Vector<T>) => [...vector] as WVector<T>;

/**
 * Builds a `toVectorN` converter for a fixed length: wraps a scalar into a
 * single-element array if needed, then fills each of the `length` slots from
 * the input, replacing missing (`undefined`/`null`) values with `defaultValue`.
 *
 * @example
 * ```ts
 * const toVector3 = getToVector<Vector3>(3);
 * toVector3([1, undefined, 3], 0); // [1, 0, 3]
 * toVector3(5, 0); // [5, 0, 0]
 * ```
 */
const getToVector = <T extends Vector>(length: number) => (vector: any, defaultValue?: T[0]): T => {
  const vec = isArray(vector) ? vector : [vector];
  const r = [];
  for (let i = 0; i < length; i++) {
    const v = vec[i];
    r[i] = isDefined(v) ? v : defaultValue;
  }
  return r as unknown as T;
}

/**
 * Converts a value into a `Vector1`, filling missing components with `defaultValue`.
 *
 * @example
 * ```ts
 * toVector1(5); // [5]
 * toVector1(undefined, 0); // [0]
 * ```
 */
export const toVector1 = getToVector<Vector1>(1);

/**
 * Converts a value into a `Vector2`, filling missing components with `defaultValue`.
 *
 * @example
 * ```ts
 * toVector2([1], 0); // [1, 0]
 * ```
 */
export const toVector2 = getToVector<Vector2>(2);

/**
 * Converts a value into a `Vector3`, filling missing components with `defaultValue`.
 *
 * @example
 * ```ts
 * toVector3([1, 2], 0); // [1, 2, 0]
 * ```
 */
export const toVector3 = getToVector<Vector3>(3);

/**
 * Converts a value into a `Vector4`, filling missing components with `defaultValue`.
 *
 * @example
 * ```ts
 * toVector4([1, 2, 3], 0); // [1, 2, 3, 0]
 * ```
 */
export const toVector4 = getToVector<Vector4>(4);

/**
 * Converts a value into a `Vector5`, filling missing components with `defaultValue`.
 *
 * @example
 * ```ts
 * toVector5([1, 2, 3, 4], 0); // [1, 2, 3, 4, 0]
 * ```
 */
export const toVector5 = getToVector<Vector5>(5);

/**
 * Converts a value into a `Vector6`, filling missing components with `defaultValue`.
 *
 * @example
 * ```ts
 * toVector6([1, 2, 3, 4, 5], 0); // [1, 2, 3, 4, 5, 0]
 * ```
 */
export const toVector6 = getToVector<Vector6>(6);

/**
 * Converts a value into a `Vector7`, filling missing components with `defaultValue`.
 *
 * @example
 * ```ts
 * toVector7([1, 2, 3, 4, 5, 6], 0); // [1, 2, 3, 4, 5, 6, 0]
 * ```
 */
export const toVector7 = getToVector<Vector7>(7);

/**
 * Converts a value into a `Vector8`, filling missing components with `defaultValue`.
 *
 * @example
 * ```ts
 * toVector8([1, 2, 3, 4, 5, 6, 7], 0); // [1, 2, 3, 4, 5, 6, 7, 0]
 * ```
 */
export const toVector8 = getToVector<Vector8>(8);

/**
 * Converts a value into a `Vector9`, filling missing components with `defaultValue`.
 *
 * @example
 * ```ts
 * toVector9([1, 2, 3, 4, 5, 6, 7, 8], 0); // [1, 2, 3, 4, 5, 6, 7, 8, 0]
 * ```
 */
export const toVector9 = getToVector<Vector9>(9);
