import { isUndefined } from 'fluxio/check';
import { floor } from 'fluxio/number/floor';
import { padStart } from 'fluxio/string/pad';

export const formatSeconds = (seconds: number | undefined): string | undefined => {
  if (isUndefined(seconds)) return undefined
  const t = Math.abs(seconds);
  const h = floor(t / 3600);
  const m = floor((t % 3600) / 60);
  const s = floor(t % 60);
  const r = `${padStart(h, 2)}:${padStart(m, 2)}:${padStart(s, 2)}`;
  console.debug('formatSeconds', seconds, r);
  return seconds < 0 ? `-${r}` : r;
};
