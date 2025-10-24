import { replaceIndex } from './replaceIndex';

export const updateIndex = <T>(items: T[], index: number, changes: Partial<T>) =>
  replaceIndex(items, index, { ...items[index], ...changes });
