import { glb } from '../glb';

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
