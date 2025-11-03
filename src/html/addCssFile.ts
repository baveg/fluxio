import { Dictionary } from '../types/Dictionary';
import { createEl } from './createEl';

const _cssFiles: Dictionary<HTMLLinkElement> = {};

export const addCssFile = (url: string): HTMLLinkElement => {
  if (_cssFiles[url]) return _cssFiles[url];
  const el = createEl('link');
  el.rel = 'stylesheet';
  el.type = 'text/css';
  el.href = url;
  _cssFiles[url] = document.head.appendChild(el);
  return el;
};
