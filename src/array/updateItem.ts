import { updateIndex } from './updateIndex';

export const updateItem = <T>(items: T[], item: T, changes: Partial<T>) => {
  const index = items.indexOf(item);
  if (index === -1) return items;
  return updateIndex(items, index, changes);
};
