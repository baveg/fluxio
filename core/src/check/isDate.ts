export const isDate = (v: any): v is Date => v instanceof Date;

export const isValidDate = (v: any): v is Date => isDate(v) && Number.isFinite(+v);