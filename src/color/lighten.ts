import { addHsl } from './addHsl';
/**
 * lightens a color by a specified amount
 * @param color - color in any supported format
 * @param amount - amount to lighten (0-100), defaults to 10
 * @returns hex string of lightened color
 */
export const lighten = (color: any, amount: number = 10): string => addHsl(color, { l: amount });
