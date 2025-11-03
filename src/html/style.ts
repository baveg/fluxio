import { setAttributes } from './attributes';

export type Style = Partial<CSSStyleDeclaration>;

export const getStyle = (el: HTMLElement): Style => el.style;

export const resetStyle = (el: Element) => {
  setAttributes(el, { style: '' });
};

export const setStyle = (el: HTMLElement, style: Style) => {
  Object.assign(el.style, style);
};

export const replaceStyle = (el: HTMLElement, style: Style | string) => {
  if (typeof style === 'string') {
    return setAttributes(el, { style });
  }
  resetStyle(el);
  setStyle(el, style);
};
