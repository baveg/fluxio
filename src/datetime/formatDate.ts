import { toDate } from 'fluxio/cast/toDate';
import { padStart } from 'fluxio/string/pad';

/** Format date as DD/MM/YYYY */
export const formatDate = (date?: any): string => {
  const d = toDate(date);
  if (!d) return '';
  const day = padStart(d.getDate(), 2);
  const month = padStart(d.getMonth() + 1, 2);
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
};
