import { sortItems } from '../array/sortItems';
import { fromEntries } from './fromEntries';
import { getEntries } from './getEntries';

export const sortKey = <T extends Record<any, any>>(record: T): T =>
  fromEntries(sortItems(getEntries(record))) as T;
