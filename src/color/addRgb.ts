import { isNumber } from '../check/isNumber';
import { toRgb } from './toRgb';
import { toColor } from './toColor';
import { RgbColor } from './types';

export const addRgb = (color: any, values: Partial<RgbColor>) => {
  color = toRgb(color);
  if (isNumber(values.r)) color.r += values.r;
  if (isNumber(values.g)) color.g += values.g;
  if (isNumber(values.b)) color.b += values.b;
  if (isNumber(values.a)) color.a += values.a;
  return toColor(color);
};
