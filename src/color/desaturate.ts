import { saturate } from './saturate';
/**
 * decreases the saturation of a color
 * @param color - color in any supported format
 * @param amount - amount to decrease saturation (0-100), defaults to 10
 * @returns hex string of desaturated color
 */
export const desaturate = (color: any, amount: number = 10): string => saturate(color, -amount);
