import { toString } from '../cast';
import { isString } from '../check';

export const sortItems = <T = any>(
  items: T[],
  prop: (item: T) => string | number | Date | undefined = toString
) => {
  const list = items.map((i) => [prop(i), i]) as [string | number | Date, T][];
  list.sort(([a], [b]) =>
    isString(a) || isString(b) ? String(a).localeCompare(String(b)) : Number(a) - Number(b)
  );
  items.length = 0;
  items.push(...list.map(([, item]) => item));
  return items;
};
