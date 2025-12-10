import { Vector1, Vector2, Vector3, Vector4, Vector5, Vector6, Vector7, Vector8, Vector9, Vector, WVector } from '../types/Vector';
import { clamp } from './clamp';
import { isDefined } from '../check/isDefined';

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

export const vectorError = (prop: string) => new Error(`VectorError (${prop})`);

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

export const clampVector = <V extends Vector>(v: V, min: V, max: V) =>
  op3Vector<V>(v, min, max, clamp);

export const addVector = <V extends Vector>(a: V, b: V) => opVector<V>(a, b, (a, b) => a + b);

export const subVector = <V extends Vector>(a: V, b: V) => opVector<V>(a, b, (a, b) => a - b);

export const mulVector = <V extends Vector>(a: V, b: V) => opVector<V>(a, b, (a, b) => a * b);

export const mergeVector = <V extends Vector>(a: V, b: Vector<V[0] | undefined>) =>
  opVector<V>(a, b as V, (a, b) => (isDefined(b) ? b : a));

export const cloneVector = <T>(vector: Vector<T>) => [...vector] as WVector<T>;
