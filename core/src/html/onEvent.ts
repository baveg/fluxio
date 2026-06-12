import { glb } from '../glb';
import { Vector4 } from '../types';
import { getElBounds } from './getElBounds';
import { throttle } from '../async/throttle';
import { eqVector } from '../number/vector';

export interface OnEventOptions {
  once?: boolean;
  passive?: boolean;
  signal?: AbortSignal;
}

export const onEvent = (
  target: any,
  type: string,
  listener: (e: any) => any,
  options: OnEventOptions = {}
): (() => void) => {
  const el = target ? target : glb.document.body;
  const off = () => el.removeEventListener(type, handler, options);
  const handler =
    options.once ?
      (e: any) => {
        off();
        listener.call(this, e);
      }
    : listener;
  el.addEventListener(type, handler, options);
  return off;
};

interface OnHtmlEvent {
  <K extends keyof HTMLElementEventMap, T extends HTMLElement = HTMLElement>(
    target: T | 0,
    type: K,
    listener: (this: T, ev: HTMLElementEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ): () => void;
}

export const onHtmlEvent = onEvent as OnHtmlEvent;

export const onEventOnce = (
  target: any,
  type: string,
  listener: (e: any) => any,
  options: OnEventOptions = {}
): (() => void) => onEvent(target, type, listener, { ...options, once: true });

export const onViewportClick = (listener: (e: any) => any, options?: OnEventOptions) => {
  const u1 = onEvent(0, 'mousedown', listener, options);
  const u2 = onEvent(0, 'touchstart', listener, options);

  return () => {
    u1();
    u2();
  };
};

export const onClickOutside = (
  el: HTMLElement | null,
  listener: (e: any) => any,
  options?: OnEventOptions
) =>
  onViewportClick((e) => {
    if (el && !el.contains(e.target)) {
      listener(e);
    }
  }, options);

export const onResize = (listener: (e: any) => any, options?: OnEventOptions) =>
  onEvent(0, 'resize', listener, options);

export const onScroll = (listener: (e: any) => any, options?: OnEventOptions) =>
  onEvent(0, 'scroll', listener, { passive: true, ...options });

export const onInterval = (callback: () => void, ms: number): (() => void) => {
  const timer = setInterval(callback, ms);
  return () => clearInterval(timer);
};

export const onElMove = (
  el: HTMLElement | null,
  listener: (xywh: Vector4 | undefined) => any,
  ms: number = 100,
  options?: OnEventOptions
) => {
  if (!el) return () => {};

  let last: Vector4 | undefined = getElBounds(el);

  const checkPosition = throttle(() => {
    const curr = getElBounds(el);

    // Vérifie si la position ou la taille a changé
    if (!eqVector(curr, last)) {
      last = curr;
      listener(curr);
    }
  }, ms);

  const u1 = onEvent(0, 'resize', checkPosition, options);
  const u2 = onEvent(0, 'scroll', checkPosition, options);
  const u3 = onInterval(checkPosition, ms * 2);

  return () => {
    u1();
    u2();
    u3();
  };
};
