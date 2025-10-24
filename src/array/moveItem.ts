import { moveIndex } from './moveIndex';

export const moveItem = <T>(items: T[], item: T, offset: number) => {
  const from = items.indexOf(item);
  if (from === -1) return items;
  const to = from + offset;
  return moveIndex(items, from, to);
};
