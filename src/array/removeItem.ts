import { removeIndex } from './removeIndex';

export const removeItem = <T>(items: T[], item: T) => {
  const index = items.indexOf(item);
  if (index === -1) return items;
  return removeIndex(items, index);
};
