import { isArray } from 'fluxio/check/isArray';
import { removeIndex } from './removeIndex';

export const removeItem = <T>(items: null | undefined | T[], item: T): T[] => {
  if (!isArray(items)) return [];
  const index = items.indexOf(item);
  if (index === -1) return items;
  return removeIndex(items, index);
};
