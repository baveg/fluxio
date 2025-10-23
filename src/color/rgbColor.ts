import { round } from '../number/round';
import { clamp } from '../number/clamp';
import { RgbColor } from './RgbColor';
/**
 * Creates a new RGB color array with properly rounded values
 * @param r - Red component (0-255)
 * @param g - Green component (0-255)
 * @param b - Blue component (0-255)
 * @param a - Alpha component (0-1), defaults to 1
 * @returns RGB tuple with properly rounded values
 */
export const rgbColor = (r: number, g: number, b: number, a: number = 1): RgbColor => {
  // RGB values must be integers between 0-255, alpha must be between 0-1 with 2 decimal places
  return {
    r: round(clamp(r, 0, 255)),
    g: round(clamp(g, 0, 255)),
    b: round(clamp(b, 0, 255)),
    a: round(clamp(a, 0, 1), 2),
  };
};
