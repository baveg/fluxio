import { toRgb } from './toRgb';

/**
 * Converts any color to hexadecimal string format
 * @param color - Color in any supported format
 * @returns Hex color string (#RRGGBB or #RRGGBBAA)
 */
export const isHexColor = (value: string): boolean =>
  /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(value);

export const toHexColor = (color: any): string => {
  const { r, g, b, a } = toRgb(color);
  const hex = (n: number) => n.toString(16).toUpperCase().padStart(2, '0');
  return a !== 1 ?
      `#${hex(r)}${hex(g)}${hex(b)}${hex(Math.round(a * 255))}`
    : `#${hex(r)}${hex(g)}${hex(b)}`;
};
