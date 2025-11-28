import { PosXY } from 'fluxio/types';
import { isNumber } from '../check/isNumber';

export const getEventXY = (e: any): PosXY | undefined => {
  if (!e) return undefined;

  const x = e.clientX;
  const y = e.clientY;

  if (isNumber(x) && isNumber(y)) return [x, y];

  const touch = (e as TouchEvent).touches?.[0] || (e as TouchEvent).changedTouches?.[0];
  if (touch) return getEventXY(touch);

  return undefined;
};
