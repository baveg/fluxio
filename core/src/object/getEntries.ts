import { Dictionary } from "../types";

export const getEntries = <T>(obj: Dictionary<T>) => Object.entries(obj) as [string, T][];
