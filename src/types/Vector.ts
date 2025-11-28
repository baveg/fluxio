export type Vector1<T=number> = Readonly<[T]>;
export type Vector2<T=number> = Readonly<[T, T]>;
export type Vector3<T=number> = Readonly<[T, T, T]>;
export type Vector4<T=number> = Readonly<[T, T, T, T]>;
export type Vector5<T=number> = Readonly<[T, T, T, T, T]>;

export type Vector<T=number> = Vector1<T>|Vector2<T>|Vector3<T>|Vector4<T>|Vector5<T>;

export type PosXY = Vector2;
export type SizeWH = Vector2;
export type Transform = Vector4;