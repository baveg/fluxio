export const isObject = <T extends Object>(v: unknown): v is T =>
  typeof v === 'object' && v !== null;