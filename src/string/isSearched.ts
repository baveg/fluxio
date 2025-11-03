import { removeAccents } from './removeAccents';
import { lower } from './lower';

export const isSearched = (
  source: string | null | undefined,
  search: string | null | undefined
) => {
  if (!search) return true;
  if (!source) return false;
  const sourceCleaned = lower(removeAccents(source)).trim();
  const searchTags = lower(removeAccents(search)).trim().split(' ');
  for (const tag of searchTags) {
    if (sourceCleaned.indexOf(tag) === -1) return false;
  }
  return true;
};
