export type WVector1<T = number> = [T];
export type WVector2<T = number> = [T, T];
export type WVector3<T = number> = [T, T, T];
export type WVector4<T = number> = [T, T, T, T];
export type WVector5<T = number> = [T, T, T, T, T];
export type WVector6<T = number> = [T, T, T, T, T, T];
export type WVector7<T = number> = [T, T, T, T, T, T, T];
export type WVector8<T = number> = [T, T, T, T, T, T, T, T];
export type WVector9<T = number> = [T, T, T, T, T, T, T, T, T];

export type Vector1<T = number> = Readonly<WVector1<T>>;
export type Vector2<T = number> = Readonly<WVector2<T>>;
export type Vector3<T = number> = Readonly<WVector3<T>>;
export type Vector4<T = number> = Readonly<WVector4<T>>;
export type Vector5<T = number> = Readonly<WVector5<T>>;
export type Vector6<T = number> = Readonly<WVector6<T>>;
export type Vector7<T = number> = Readonly<WVector7<T>>;
export type Vector8<T = number> = Readonly<WVector8<T>>;
export type Vector9<T = number> = Readonly<WVector9<T>>;

export type WVector<T = number> =
  | WVector1<T>
  | WVector2<T>
  | WVector3<T>
  | WVector4<T>
  | WVector5<T>
  | WVector6<T>
  | WVector7<T>
  | WVector8<T>
  | WVector9<T>;

export type Vector<T = number> =
  | Vector1<T>
  | Vector2<T>
  | Vector3<T>
  | Vector4<T>
  | Vector5<T>
  | Vector6<T>
  | Vector7<T>
  | Vector8<T>
  | Vector9<T>;
