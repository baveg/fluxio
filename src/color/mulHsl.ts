import { isFloat } from '../check/isNumber';
import { toHsl } from './toHsl';
import { toColor } from './toColor';
import { HslColor } from './types';

export const mulHsl = (color: any, values: Partial<HslColor>) => {
  color = toHsl(color);
  if (isFloat(values.h)) color.h *= values.h;
  if (isFloat(values.s)) color.s *= values.s;
  if (isFloat(values.l)) color.l *= values.l;
  if (isFloat(values.a)) color.a *= values.a;
  return toColor(color);
};
