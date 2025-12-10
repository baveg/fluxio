import { setItem } from './setItem';

export const updateIndex = <T>(items: T[], index: number, changes: Partial<T>) =>
  setItem(items, index, { ...items[index], ...changes });
