import { lighten } from './lighten';

/**
 * darkens a color by a specified amount
 * @param color - color in any supported format
 * @param amount - amount to darken (0-100), defaults to 10
 * @returns hex string of darkened color
 */
export const darken = (color: any, amount: number = 10): string => lighten(color, -amount);
