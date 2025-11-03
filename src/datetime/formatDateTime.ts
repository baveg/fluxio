import { toDate } from 'fluxio/cast/toDate';
import { formatDate } from './formatDate';
import { formatTime } from './formatTime';

/** Format date and time as DD/MM/YYYY HH:MM:SS */
export const formatDateTime = (date: any): string => {
  const d = toDate(date);
  if (!d) return '';
  return `${formatDate(d)} ${formatTime(d)}`;
};
