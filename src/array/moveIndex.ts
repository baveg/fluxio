import { normalizeIndex } from './normalizeIndex';

export const moveIndex = <T>(items: T[], from: number, to: number) => {
  // Normaliser les index avant tout traitement
  from = normalizeIndex(from, items.length);
  to = normalizeIndex(to, items.length);

  if (from === to) return items;

  const removes = items.splice(from, 1);
  items.splice(to, 0, removes[0]!);
  return items;
};
