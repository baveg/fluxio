import { toHsl } from './toHsl';

/**
 * Converts any color to CSS HSL/HSLA string format
 * @param color - Color in any supported format
 * @returns CSS color string (hsl or hsla)
 */
export const toHslString = (color: any): string => {
  const { h, s, l, a } = toHsl(color);
  return a !== 1 ? `hsla(${h}, ${s}%, ${l}%, ${a})` : `hsl(${h}, ${s}%, ${l}%)`;
};
