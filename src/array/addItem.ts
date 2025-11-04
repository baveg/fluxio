import { isDefined } from '../check/isDefined';

export const addItem = <T>(items: T[], item: T, index?: number) => {
  if (isDefined(index)) {
    items.splice(index, 0, item);
  } else {
    items.push(item);
  }
  return items;
};
