import { clamp } from "../number/clamp";
import { rgbColor } from "./rgbColor";
import { HslColor, RgbColor } from "./types";

export const hslToRgb = (hsl: HslColor): RgbColor => {
  // Handle HSL format
  const h = hsl.h / 360; // Normalize to 0-1 range
  // Handle both 0-1 and 0-100 scale for s and l
  const s = clamp(hsl.s / 100, 0, 1);
  const l = clamp(hsl.l / 100, 0, 1);
  const a = typeof hsl.a === 'number' ? hsl.a : 1;
  let r, g, b;

  if (s === 0) {
    // Achromatic (gray)
    r = g = b = l;
  } else {
    // HSL to RGB conversion algorithm
    const hue2rgb = (p: number, q: number, t: number): number => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return rgbColor(r * 255, g * 255, b * 255, a);
};