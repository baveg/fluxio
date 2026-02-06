import { isString } from "fluxio/check";
import { flux } from "../../flux";
import { Dictionary } from "../../types/Dictionary";

export type Tr = ReturnType<typeof newTr>;

export const trs: Dictionary<Tr> = {};

export interface TrUpdate {
    <T extends string>(changes: { [K in T]: string }): void;
    (changes: Dictionary<string>, replace?: boolean): void;
}

const newTr = (namespace: string) => {
    const translates: Dictionary<string> = {};
    const _changed$ = flux(Date.now());
    const changed$ = _changed$.debounce(10);

    const update: TrUpdate = (changes: Dictionary<string>, replace = false) => {
        if (replace) {
            for (const key in translates) {
                delete translates[key];
            }
        }
        Object.assign(translates, changes);
        _changed$.set(Date.now());
    }

    const defaults: TrUpdate = (changes: Dictionary<string>) => {
        let changed = false;
        for (const key in changes) {
            if (!(key in translates)) {
                translates[key] = changes[key]!;
                changed = true;
            }
        }
        if (changed) _changed$.set(Date.now());
    }

    const set = (key: string, value: string) => {
        translates[key] = value;
        _changed$.set(Date.now());
        return value;
    }

    const tr = (strings: string|TemplateStringsArray, ...values: unknown[]): string => {
        const key = isString(strings) ? strings : strings.join("{}");
        const template = translates[key] || set(key, key);
        let i = 0;
        return template.replace(/\{\}/g, () => String(values[i++]));
    }

    tr.namespace = namespace;
    tr.translates = translates;
    tr.update = update;
    tr.defaults = defaults;
    tr.set = set;
    tr.changed$ = changed$;

    return tr;
}

export const getTr = (namespace: string) => (
    trs[namespace] || (
        trs[namespace] = newTr(namespace)
    )
);

export const setTrChanges = (changesDico: Dictionary<Dictionary<string>>, replace = false) => {
    for (const namespace in changesDico) {
        const changes = changesDico[namespace];
        if (changes) {
            getTr(namespace).update(changes, replace);
        }
    }
}