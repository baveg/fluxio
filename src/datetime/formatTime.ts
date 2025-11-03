import { toDate } from 'fluxio/cast/toDate';
import { padStart } from 'fluxio/string/pad';

/** Format time as HH:MM:SS */
export const formatTime = (date?: any): string => {
  const d = toDate(date);
  if (!d) return '';
  const hours = padStart(d.getHours(), 2);
  const minutes = padStart(d.getMinutes(), 2);
  const secondes = padStart(d.getSeconds(), 2);
  return secondes === '00' ? `${hours}:${minutes}` : `${hours}:${minutes}:${secondes}`;
};
