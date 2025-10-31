import { sortItems } from '../array/sortItems';

export const sortKey = <T extends Record<any, any>>(record: T): T =>
  Object.fromEntries(sortItems(Object.entries(record))) as T;
