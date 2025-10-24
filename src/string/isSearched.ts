import { clean } from './clean';
import { lower } from './lower';

export const isSearched = (
  source: string | null | undefined,
  search: string | null | undefined
) => {
  if (!search) return true;
  if (!source) return false;
  const sourceCleaned = lower(clean(source));
  const searchTags = lower(clean(search)).split(' ');
  for (const tag of searchTags) {
    if (sourceCleaned.indexOf(tag) === -1) return false;
  }
  return true;
};
