import { Dictionary } from '../types/Dictionary';
import { toItem } from './toItem';
import { toString } from './toString';
import { toBoolean } from './toBoolean';
import { toNumber } from './toNumber';

interface ToDictionary {
  <T = any>(value?: Dictionary<T> | null | undefined): Dictionary<T>;
  <T = any, U = any>(value: Dictionary<T> | null | undefined, defaultValue: U): Dictionary<T> & U;
}
export const toDictionary = toItem as ToDictionary;

export const toDictionaryOf = <T = any>(
  to: (v: any) => T,
) => (
  (v: any): Dictionary<T> => {
    const dico = toDictionary<T>(v);
    for (const key in dico) {
      const from = dico[key];
      const next = to(from);
      if (next === undefined) delete dico[key];
      else if (next !== from) dico[key] = next;
    }
    return dico;
  }
)

export const toDictionaryOfNumber = toDictionaryOf(toNumber);

export const toDictionaryOfString = toDictionaryOf(toString);

export const toDictionaryOfBoolean = toDictionaryOf(toBoolean);

export const toDictionaryOfItem = toDictionaryOf(toItem);
