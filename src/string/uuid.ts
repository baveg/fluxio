import { isUuid } from 'fluxio/check';
import { randHex } from './randString';

/**
 * Create random UUID V4
 * @returns
 */
export const uuid = (): string => {
  if (typeof crypto === 'object' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${randHex(8)}-${randHex(4)}-4${randHex(3)}-8${randHex(3)}-${randHex(12)}`;
};

export const minifyUuid = (uuid: string) => {
  if (!isUuid(uuid)) return '';
  return uuid.replace(/-/g, '');
};

export const prettifyUuid = (uuid: string) => {
  const h = minifyUuid(uuid);
  if (!h) return '';
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
};
