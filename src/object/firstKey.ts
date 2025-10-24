import { isItem } from '../check/isItem';

export const firstKey = (v: any): string | undefined => {
  if (isItem(v)) for (const k in v) return k;
  return undefined;
};
