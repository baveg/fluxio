import { sleep } from '../async/sleep';
import { logger } from '../logger/Logger';
import { CssValue, setCss } from './css';
import { setEl } from './setEl';

const log = logger('Overlay');

const overlayCss: CssValue = {
  '': {
    position: 'fixed',
    xy: 0,
    transition: 'opacity 0.2s ease',
    opacity: 1,
  },
  '-adding': { opacity: 0 },
  '-removed': { opacity: 0 },
};

export const addOverlay = () => {
  const c = setCss('Overlay', overlayCss);
  const el = setEl('div', { cls: `${c} ${c}-adding`, parent: 'body' });
  setTimeout(() => setEl(el, { cls: c }), 10);
  log.d('add', el);
  return el as HTMLDivElement;
};

export const removeOverlay = async (el: HTMLDivElement) => {
  log.d('remove', el);
  const c = setCss('Overlay', overlayCss);
  setEl(el, { cls: `${c} ${c}-removed` });
  await sleep(300);
  el.remove();
  return;
};
