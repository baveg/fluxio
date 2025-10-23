import { round } from '../number/round';
import { toRgb } from './toRgb';
import { HslColor } from './HslColor';
/**
 * Converts any color format to HSL
 * @param color - Color in any supported format
 * @returns HSL tuple [h, s, l, a] with h: 0-360, s: 0-100, l: 0-100, a: 0-1
 */
export const toHsl = (color: any): HslColor => {
  const rgb = toRgb(color);

  // Normalize RGB values to 0-1 range
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    // Calculate hue
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h = h * 60; // Convert to degrees
  }

  return {
    h: round(h, 1),
    s: round(s * 100, 2),
    l: round(l * 100, 2),
    a: rgb.a,
  };
};
