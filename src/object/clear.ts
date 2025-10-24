import { isArray } from '../check/isArray';
import { isItem, Item } from '../check/isItem';

export const clear = <T extends Item | any[]>(v: T): T => {
  if (isArray(v)) v.length = 0;
  else if (isItem(v)) for (const key in v) delete v[key];
  return v;
};
