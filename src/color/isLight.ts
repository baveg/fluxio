import { isBetween } from 'fluxio/check/isBetween';
import { toHsl } from './toHsl';

/**
 * Determines if a color is light (lightness > 50%)
 * @param color - Color in any supported format
 * @returns True if the color is light, false otherwise
 */
export const isLight = (color: any): boolean => {
  const { h, l } = toHsl(color);
  if (isBetween(h, 45, 100) || isBetween(h, 150, 185)) return l > 38;
  return l > 50;
};
