import type { Vector4 } from '../types';

export const getElBounds = (el?: HTMLElement|null): Vector4 | undefined => {
  if (!el) return undefined;
  const r = el.getBoundingClientRect();
  return [r.left, r.bottom, r.width, r.height];
};
