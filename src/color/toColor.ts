import { toRgb } from './toRgb';
/**
 * Converts any color format to hexadecimal string
 * @param color - Color in any supported format
 * @returns Hex color string (#RRGGBB or #RRGGBBAA if alpha < 1)
 */
export const toColor = (color: any): string => {
  const { r, g, b, a } = toRgb(color);

  // Function to convert numeric value to padded hex without rounding up
  const f = (n: number): string => {
    // Use floor instead of round to avoid rounding up values like FE to FF
    const hex = Math.floor(n).toString(16);
    return hex.length < 2 ? '0' + hex : hex;
  };

  // Return #RRGGBB if alpha is 1 else #RRGGBBAA
  const hex = '#' + f(r) + f(g) + f(b);
  return a === 1 ? hex : hex + f(a * 255);
};
