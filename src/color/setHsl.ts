import { isNumber } from '../check/isNumber';
import { toHsl } from './toHsl';
import { toColor } from './toColor';
import { HslColor } from './types';

export const setHsl = (color: any, values: Partial<HslColor>) => {
  color = toHsl(color);
  if (isNumber(values.h)) color.h = values.h;
  if (isNumber(values.s)) color.s = values.s;
  if (isNumber(values.l)) color.l = values.l;
  if (isNumber(values.a)) color.a = values.a;
  return toColor(color);
};
