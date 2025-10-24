import { toStr } from '../cast';
import { isDef, isStr } from '../check';

export const sortItems = <T = any>(
  items: T[],
  prop: (item: T) => string | number | Date | undefined = toStr
) => {
  const list = items.map((i) => [prop(i), i]) as [string | number | Date, T][];
  list.sort(([a], [b]) =>
    isStr(a) || isStr(b) ? String(a).localeCompare(String(b)) : Number(a) - Number(b)
  );
  items.length = 0;
  items.push(...list.map(([, item]) => item));
  return items;
};
