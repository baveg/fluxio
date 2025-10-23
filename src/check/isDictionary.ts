export const isDictionary = <T extends Record<string, any> = Record<string, any>>(v: any): v is T =>
  typeof v === 'object' && !Array.isArray(v);