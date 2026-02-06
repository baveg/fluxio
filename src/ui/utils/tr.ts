import { isString } from "fluxio/check";
import { flux } from "../../flux";
import { Dictionary } from "../../types/Dictionary";

export type Tr = ReturnType<typeof newTr>;

export const trs: Dictionary<Tr> = {};

const newTr = (namespace: string) => {
    const translates: Dictionary<string> = {};
    const _changed$ = flux(Date.now());
    const changed$ = _changed$.debounce(10);

    const update = (changes: Dictionary<string>, replace = false) => {
        if (replace) {
            for (const key in translates) {
                delete translates[key];
            }
        }
        Object.assign(translates, changes);
        _changed$.set(Date.now());
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

    return {
        namespace,
        set,
        update,
        translates,
        changed$,
        tr,
    };
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