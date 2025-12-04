import { isFloat } from '../check/isNumber';
import { toHsl } from './toHsl';
import { toColor } from './toColor';
import { HslColor } from './types';

export const setHsl = (color: any, values: Partial<HslColor>) => {
  color = toHsl(color);
  if (isFloat(values.h)) color.h = values.h;
  if (isFloat(values.s)) color.s = values.s;
  if (isFloat(values.l)) color.l = values.l;
  if (isFloat(values.a)) color.a = values.a;
  return toColor(color);
};

export const setHue = (color: any, h: HslColor['h']) => setHsl(color, { h });
export const setSaturation = (color: any, s: HslColor['s']) => setHsl(color, { s });
export const setLight = (color: any, l: HslColor['l']) => setHsl(color, { l });
export const setAlpha = (color: any, a: HslColor['a']) => setHsl(color, { a });