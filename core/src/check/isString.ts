export const isString = (v: any): v is string => typeof v === 'string';

export const isStringValid = (v: any): v is string => isString(v) && v.trim() !== '';
