export const isNumber = (v: any, allowNaN = false, allowInfinity = false): v is number =>
  typeof v === 'number' && (allowNaN || !Number.isNaN(v)) && (allowInfinity || Number.isFinite(v));

export const isInt = (v: any): v is number => isNumber(v) && Number.isInteger(v);

export const isNegative = (v: any): v is number => isNumber(v) && v < 0;

export const isPositive = (v: any): v is number => isNumber(v) && v > 0;
