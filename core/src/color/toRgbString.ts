import { toRgb } from './toRgb';

/**
 * Converts any color to CSS RGB/RGBA string format
 * @param color - Color in any supported format
 * @returns CSS color string (rgb or rgba)
 */
export const toRgbString = (color: any): string => {
  const { r, g, b, a } = toRgb(color);
  return a !== 1 ? `rgba(${r}, ${g}, ${b}, ${a})` : `rgb(${r}, ${g}, ${b})`;
};
