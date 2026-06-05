import { Dictionary } from "../types";

export const getValues = <T>(obj: Dictionary<T>) => Object.values(obj) as T[];
