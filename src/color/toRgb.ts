import { isArrayOfNumber } from '../check/isArrayOfNumber';
import { rgbColor } from './rgbColor';
import { stringToColor } from './stringToColor';
import { RgbColor } from './RgbColor';
/**
 * Converts any color format to RGB
 * @param color - Color in any supported format
 * @returns RGB tuple [r, g, b, a]
 */
export const toRgb = (c: any): RgbColor => {
  if (typeof c === 'object') {
    // Handle object formats
    if (typeof c.r === 'number') {
      // Handle { r, g, b, a? } object
      return rgbColor(c.r, c.g, c.b, typeof c.a === 'number' ? c.a : 1);
    }
    if (typeof c.h === 'number') {
      // Handle { h, s, l, a? } object
      return hslToRgb(c);
    }
    if (isArrayOfNumber(c) && c.length >= 3) {
      // Handle array format [r, g, b] or [r, g, b, a]
      return rgbColor(c[0]!, c[1]!, c[2]!, c.length >= 4 ? c[3] : 1);
    }
    throw new Error('toRgb object' + JSON.stringify(c));
  }
  if (typeof c === 'string') {
    // Handle string formats
    return toRgb(stringToColor(c));
  }
  if (typeof c === 'number') {
    // Handle grayscale (single number)
    return rgbColor(c, c, c, 1);
  }

  console.error('toRgb fallback' + JSON.stringify(c));
  return toRgb('#FF0000');
};
