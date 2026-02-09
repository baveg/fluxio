import { isString } from '../../check';
import { flux } from '../../flux';
import { Dictionary } from '../../types/Dictionary';

const _trsChanged$ = flux(Date.now());
export const trsChanged$ = _trsChanged$.debounce(100);

export type Tr = ReturnType<typeof newTr>;

export const trs: Dictionary<Tr> = {};

export interface TrUpdate {
  <T extends string>(changes: { [K in T]: string }): Tr;
  (changes: Dictionary<string>, replace?: boolean): Tr;
}

const newTr = (namespace: string) => {
  const dico: Dictionary<string> = {};
  const _changed$ = flux(Date.now());
  const changed$ = _changed$.debounce(100);

  const notifyChanged = () => {
    const now = Date.now();
    _changed$.set(now);
    _trsChanged$.set(now);
  };

  const update: TrUpdate = (changes: Dictionary<string>, replace = false) => {
    if (replace) {
      for (const key in dico) {
        delete dico[key];
      }
    }
    Object.assign(dico, changes);
    notifyChanged();
    return tr;
  };

  const defaults: TrUpdate = (changes: Dictionary<string>) => {
    for (const key in changes) {
      if (!(key in dico)) {
        dico[key] = changes[key]!;
      }
    }
    notifyChanged();
    return tr;
  };

  const set = (key: string, value: string) => {
    dico[key] = value;
    notifyChanged();
    return value;
  };

  const tr = (strings: string | TemplateStringsArray, ...values: unknown[]): string => {
    const key = isString(strings) ? strings : strings.join('{}');
    const template = dico[key] || set(key, key);
    let i = 0;
    return template.replace(/\{\}/g, () => String(values[i++]));
  };

  tr.namespace = namespace;
  tr.dico = dico;
  tr.update = update;
  tr.defaults = defaults;
  tr.set = set;
  tr.changed$ = changed$;

  return tr;
};

export const getTr = (namespace: string) => trs[namespace] || (trs[namespace] = newTr(namespace));

export const setTrChanges = (changesDico: Dictionary<Dictionary<string>>, replace = false) => {
  for (const namespace in changesDico) {
    const changes = changesDico[namespace];
    if (changes) {
      getTr(namespace).update(changes, replace);
    }
  }
};
