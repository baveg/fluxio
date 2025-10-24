import { isDef, isStr } from '../check';

export const addItem = <T>(items: T[], item: T, index?: number) => {
  if (isDef(index)) {
    items.splice(index, 0, item);
  } else {
    items.push(item);
  }
  return items;
};
