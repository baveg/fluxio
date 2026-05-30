import { toColor } from './toColor';

/**
 * Generates a random color with optional constraints
 * @param h - Maximum hue (0-360), defaults to 360
 * @param s - Maximum saturation (0-100), defaults to 100
 * @param l - Maximum lightness (0-100), defaults to 100
 * @param a - Maximum alpha transparency (0-1), defaults to 0
 * @returns Hex string of random color
 */
export const randColor = (
  h: number = 360,
  s: number = 100,
  l: number = 100,
  a: number = 0
): string => {
  const r = (max: number) => (max > 0 ? Math.random() * max : 0);
  return toColor({ h: r(h), s: r(s), l: r(l), a: 1 - r(a) });
};
