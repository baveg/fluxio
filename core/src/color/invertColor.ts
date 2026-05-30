import { toRgb } from './toRgb';
import { toColor } from './toColor';

/**
 * Inverts a color
 * @param color - Color in any supported format
 * @returns Hex string of inverted color
 */
export const invertColor = (color: any): string => {
  const { r, g, b, a } = toRgb(color);
  return toColor([255 - r, 255 - g, 255 - b, a]);
};
