import { Dictionary } from "../check/isDictionary";

const names: Dictionary<number> = {};

export const nextName = (key: string) => {
    const count = names[key] = (names[key] || 0) + 1;
    if (count === 1) return key;
    return `${key}${count}`;
}