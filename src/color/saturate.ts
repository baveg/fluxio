import { addHsl } from './addHsl';

/**
 * increases the saturation of a color
 * @param color - color in any supported format
 * @param amount - amount to increase saturation (0-100), defaults to 10
 * @returns hex string of saturated color
 */
export const saturate = (color: any, amount: number = 10): string => addHsl(color, { s: amount });
