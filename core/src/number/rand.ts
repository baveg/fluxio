import { isArray } from "../check/isArray";
import { floor } from "./floor";
import { round } from "./round";

interface Rand {
  /** float in `[0, 1[` (like `Math.random`) */
  (): number;
  /** float in `[0, max]` */
  (max: number): number;
  /** value in `[min, max]` snapped to a `decimals`-digit grid (default `0` → integer), both ends included */
  (min: number, max: number, decimals?: number): number;
  /** a random element of the array */
  <T>(items: readonly T[]): T;
}

export const rand = ((
  a?: number | readonly unknown[],
  b?: number,
  decimals = 0,
): unknown => {
  if (a === undefined) return Math.random();
  if (isArray(a)) return a[floor(rand() * a.length)];
  if (b === undefined) return rand() * (a as number);

  let [min, max] = [a as number, b];
  if (min > max) [min, max] = [max, min];

  const step = 10 ** -decimals;
  const steps = round((max - min) / step);
  return round(min + floor(rand() * (steps + 1)) * step, decimals);
}) as Rand;
