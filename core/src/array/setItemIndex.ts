import { moveIndex } from './moveIndex';

export const setItemIndex = <T>(items: T[], item: T, index: number) => {
  const from = items.indexOf(item);
  return moveIndex(items, from, index);
};
