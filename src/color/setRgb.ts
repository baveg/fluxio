import { isNumber } from '../check/isNumber';
import { toRgb } from './toRgb';
import { toColor } from './toColor';
import { RgbColor } from './types';

export const setRgb = (color: any, values: Partial<RgbColor>) => {
  color = toRgb(color);
  if (isFloat(values.r)) color.r = values.r;
  if (isFloat(values.g)) color.g = values.g;
  if (isFloat(values.b)) color.b = values.b;
  if (isFloat(values.a)) color.a = values.a;
  return toColor(color);
};
