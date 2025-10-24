export const compact = <T>(value: T[]) => value.filter(Boolean) as T[];
