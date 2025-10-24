import { Dictionary, isDictionary } from './isDictionary';

export type Item = Dictionary<any>;

export const isItem = isDictionary as <T extends Item = Item>(v: any) => v is T;
