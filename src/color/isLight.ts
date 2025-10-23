import { toHsl } from './toHsl';

/**
 * Determines if a color is light (lightness > 50%)
 * @param color - Color in any supported format
 * @returns True if the color is light, false otherwise
 */
export const isLight = (color: any): boolean => toHsl(color).l > 50;
