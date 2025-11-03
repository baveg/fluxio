import { toDate } from 'fluxio/cast/toDate';

/** Convert date to seconds since midnight */
export const dateToSeconds = (date?: any): number => {
  const d = toDate(date);
  if (!d) return 0;
  const hours = d.getHours();
  const minutes = d.getMinutes();
  const seconds = d.getSeconds();
  return hours * 3600 + minutes * 60 + seconds;
};
