import { setAttributes } from './attributes';
import { CssStyle } from './cssTypes';

export const getStyle = (el: HTMLElement): CssStyle => el.style as CssStyle;

export const resetStyle = (el: Element) => {
  setAttributes(el, { style: '' });
};

export const setStyle = (el: HTMLElement, style: CssStyle) => {
  Object.assign(el.style, style);
};

export const replaceStyle = (el: HTMLElement, style: CssStyle | string) => {
  if (typeof style === 'string') {
    return setAttributes(el, { style });
  }
  resetStyle(el);
  setStyle(el, style);
};
