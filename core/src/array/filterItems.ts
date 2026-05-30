export const filterItems = <T = any>(
  items: T[],
  predicate?: (value: T, index: number, array: T[]) => boolean
) => {
  if (!predicate) return items;
  const next = items.filter(predicate);
  if (next.length === items.length) return items;
  items.length = 0;
  items.push(...next);
  return items;
};
