import { removeAccents } from './removeAccents';
import { lower } from './lower';
import type { Item } from '../types';
import { humanize } from './humanize';

export const cleanSearch = (search: string | null | undefined) => (
  search ? lower(removeAccents(search)).trim() : ''
)

export const getSearchTags = (item: Item|null|undefined) => item ? cleanSearch(humanize(Object.values(item))) : '';

export const isSearched = (
  source: string | null | undefined,
  search: string | null | undefined,
  clean = true,
) => {
  if (!search) return true;
  if (!source) return false;
  if (clean) {
    source = cleanSearch(source);
    search = cleanSearch(search);
  }
  const searchTags = search.split(' ');
  for (const tag of searchTags) {
    if (source.indexOf(tag) === -1) return false;
  }
  return true;
};
