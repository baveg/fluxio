import { render } from 'preact';
import { useEffect } from 'preact/hooks';
import { setEl } from '@fluxio/core/html/setEl';
import type { ElOptions } from '@fluxio/core/html/setEl';
import type { Comp } from '../utils/comp';
import { comp } from '../utils/comp';
import { setCls } from '@fluxio/core/html/cls';
import { SECOND } from '@fluxio/core/date/date';

export interface PortalOptions extends ElOptions {
  tag?: keyof HTMLElementTagNameMap;
  onClose?: () => void;
}

export const portal = (
  content: Comp<{ onClose: () => void; el: HTMLElement }>,
  options?: PortalOptions
) => openPortal(content, options).onClose;

export const Portal = ({ children, options }: { children: Comp; options?: PortalOptions }) => {
  useEffect(() => portal(children, options), [children, options]);
  return null;
};

export const openPortal = (
  content: Comp<{ onClose: () => void; el: HTMLElement }>,
  { tag = 'div', onClose: afterOnClose, ...options }: PortalOptions = {}
) => {
  const el = setEl(tag, { parent: 'body', ...options });
  setCls(el, { Portal: 1, 'Portal-init': 1 });

  const onClose = () => {
    setCls(el, { 'Portal-open': 0, 'Portal-close': 1 });

    setTimeout(() => {
      render(null, el);
      el.remove();
      if (afterOnClose) afterOnClose();
    }, SECOND);
  };

  render(comp(content, { onClose, el }), el);

  setTimeout(() => {
    setCls(el, { 'Portal-init': 0, 'Portal-open': 1 });
  }, 100);

  return { onClose, el };
};
