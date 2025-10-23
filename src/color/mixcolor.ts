import { toRgb } from './toRgb';
import { toColor } from './toColor';

/**
 * mixes two colors with a specified ratio
 * @param color1 - first color in any supported format
 * @param color2 - second color in any supported format
 * @param ratio - mix ratio (0-1) where 0 is color1 and 1 is color2, defaults to 0.5
 * @returns hex string of mixed color
 */
export const mixcolor = (color1: any, color2: any, ratio: number = 0.5): string => {
  const a = toRgb(color1);
  const b = toRgb(color2);

  return toColor([
    a.r * (1 - ratio) + b.r * ratio,
    a.g * (1 - ratio) + b.g * ratio,
    a.b * (1 - ratio) + b.b * ratio,
    a.a * (1 - ratio) + b.a * ratio,
  ]);
};
