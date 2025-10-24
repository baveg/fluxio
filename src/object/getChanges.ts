import { Item } from '../check/isItem';
import { isDeepEqual } from './isDeepEqual';

export const getChanges = <T extends Item = Item>(source: T, target: Partial<T>): Partial<T> => {
  if (source === target) return {};
  const changes: Partial<T> = {};
  for (const key in target) {
    if (!isDeepEqual(source[key], target[key])) {
      changes[key] = target[key];
    }
  }
  return changes;
};
