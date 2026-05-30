export const isNumber = (v: any): v is number =>
  typeof v === 'number' && !Number.isNaN(v) && Number.isFinite(v);

export const isFloat = isNumber;

export const isInt = (v: any): v is number => isFloat(v) && Number.isInteger(v);

export const isNegative = (v: any): v is number => isFloat(v) && v < 0;

export const isUFloat = (v: any): v is number => isFloat(v) && v >= 0;

export const isUInt = (v: any): v is number => isInt(v) && v >= 0;
