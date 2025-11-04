import { Item } from '../types/Item';
import { isDictionary } from './isDictionary';

export const isItem = isDictionary as <T extends Item = Item>(v: any) => v is T;
