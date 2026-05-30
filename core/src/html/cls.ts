import type { Dictionary } from '../types/Dictionary';

export type ClsObj = { class?: any; className?: any; value?: any };
export type ClsArg = ClsObj | string | boolean | number | undefined | null;

export const cls = (...args: ClsArg[]): string => {
  const sb: string[] = [];
  for (const arg of args) {
    if (!arg) continue;
    if (typeof arg === 'string') {
      sb.push(arg);
      continue;
    }
    if (typeof arg === 'object') {
      const v = arg.class || arg.className || arg.value || String(arg);
      if (typeof v === 'string' && v) sb.push(v);
    }
  }
  return sb.join(' ');
};

export type Cls = Dictionary<boolean | number | undefined | null>;

export const getCls = (el: Element | null | undefined): Cls => {
  if (!el) return {};
  return Object.fromEntries(el.className.split(' ').map((k) => [k, true]));
};

export const setCls = (el: Element | null | undefined, classes: Cls | string) => {
  if (!el) return;
  if (typeof classes === 'string') {
    el.className = classes;
    return;
  }
  const list = el.classList;
  for (const name in classes) {
    if (classes[name]) list.add(name);
    else list.remove(name);
  }
};

export const resetCls = (el: Element | null | undefined) => {
  if (!el) return;
  el.className = '';
};

export const replaceCls = (el: HTMLElement | null | undefined, cls: Cls | string) => {
  resetCls(el);
  setCls(el, cls);
};
