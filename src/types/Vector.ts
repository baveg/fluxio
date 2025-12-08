export type Vector1<T = number> = Readonly<[T]>;
export type Vector2<T = number> = Readonly<[T, T]>;
export type Vector3<T = number> = Readonly<[T, T, T]>;
export type Vector4<T = number> = Readonly<[T, T, T, T]>;
export type Vector5<T = number> = Readonly<[T, T, T, T, T]>;
export type Vector6<T = number> = Readonly<[T, T, T, T, T, T]>;
export type Vector7<T = number> = Readonly<[T, T, T, T, T, T, T]>;
export type Vector8<T = number> = Readonly<[T, T, T, T, T, T, T, T]>;
export type Vector9<T = number> = Readonly<[T, T, T, T, T, T, T, T, T]>;

export type Vector<T = number> = Vector1<T> | Vector2<T> | Vector3<T> | Vector4<T> | Vector5<T> | Vector6<T> | Vector7<T> | Vector8<T> | Vector9<T>;

export type PosXY = Vector2;
export type SizeWH = Vector2;
export type Transform = Vector4;
