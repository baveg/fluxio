import { replaceIndex } from './replaceIndex';

export const replaceItem = <T>(items: T[], item: T, replace: T) => {
  const index = items.indexOf(item);
  if (index === -1) return items;
  return replaceIndex(items, index, replace);
};
