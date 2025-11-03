import { toDate } from 'fluxio/cast/toDate';

/** Check if date is expired (date + delay < now) */
export const isExpired = (date: any, delayMs: number = 0): boolean => {
  const d = toDate(date);
  if (!d) return true;
  return d.getTime() + delayMs < Date.now();
};
