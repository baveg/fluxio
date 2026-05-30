import { createEl } from './createEl';

export const htmlToEl = (html: string) => {
  const el = createEl('div');
  el.innerHTML = html;
  return el.children[0];
};
