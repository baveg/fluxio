export const fromEntries = <K extends string | number | symbol, V>(
  entries: Iterable<readonly [K, V]>
): Record<K, V> => Object.fromEntries(entries) as Record<K, V>;
