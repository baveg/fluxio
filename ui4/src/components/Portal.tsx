import { render } from 'preact';
import { useEffect } from 'preact/hooks';
import { setEl } from '@fluxio/core/html/setEl';
import type { ElOptions } from '@fluxio/core/html/setEl';
import type { Comp } from '../utils/comp';
import { comp } from '../utils/comp';
import { setCls } from '@fluxio/core/html/cls';
import { SECOND } from '@fluxio/core/date/date';
import { setCss } from '@fluxio/core/html/css';

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

const css = `
.portal { transition: opacity 0.2s ease; }
.portal-init, .portal-close { opacity: 0; }
.portal-open { opacity: 1; }
`;

export const openPortal = (
  content: Comp<{ onClose: () => void; el: HTMLElement }>,
  { tag = 'div', onClose: afterOnClose, ...options }: PortalOptions = {}
) => {
  setCss('openPortal', css);

  const el = setEl(tag, { parent: 'body', ...options });
  setCls(el, { portal: 1, 'portal-init': 1 });

  const onClose = () => {
    setCls(el, { 'portal-open': 0, 'portal-close': 1 });

    setTimeout(() => {
      render(null, el);
      el.remove();
      if (afterOnClose) afterOnClose();
    }, SECOND);
  };

  render(comp(content, { onClose, el }), el);

  setTimeout(() => {
    setCls(el, { 'portal-init': 0, 'portal-open': 1 });
  }, 100);

  return { onClose, el };
};
