export const isNil = (v: any): v is null | undefined => v === null || v === undefined;
export const isNotNil = <T>(v: T | null | undefined): v is NonNullable<T> => !isNil(v);