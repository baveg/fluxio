import { Dictionary, isDefined } from 'fluxio/check';

export const keepIf = <T = any>(
  items: Dictionary<T>,
  predicate?: (value: T, key: string, dictionary: Dictionary<T>) => boolean
) => {
  if (!predicate) return items;
  for (const key in items) {
    const item = items[key];
    if (isDefined(item) && predicate(item, key, items)) continue;
    delete items[key];
  }
  return items;
};
