import { glb } from '../glb';
import { Attributes, resetAttributes, setAttributes } from './attributes';
import { Cls, setCls } from './cls';
import { createEl } from './createEl';
import { setStyle, Style } from './style';

type HTMLAllElement = HTMLDivElement &
  HTMLInputElement &
  HTMLVideoElement &
  HTMLImageElement &
  HTMLHeadingElement;

export type ElOptions = Omit<Omit<Partial<HTMLAllElement>, 'children'>, 'style'> & {
  readonly reset?: boolean;
  readonly cls?: Cls | string;
  readonly style?: Style;
  readonly attributes?: Attributes;
  readonly children?: HTMLElement[];
  readonly ctn?: string;
  readonly parent?: 'body' | HTMLElement;
};

export const setEl = (el: HTMLElement | keyof HTMLElementTagNameMap, o?: ElOptions) => {
  const id = o?.id;
  const last = id && glb.document.getElementById(id);
  el = typeof el === 'string' ? last || createEl(el) : el;
  if (id) el.id = id;

  if (!o) return el;

  const { reset, attributes, style, cls, children, ctn, parent, ...rest } = o;

  if (reset) resetAttributes(el);
  if (attributes) setAttributes(el, attributes);
  if (style) setStyle(el, style);
  if (cls) setCls(el, cls);
  if (ctn) el.innerHTML = ctn;
  if (parent) (parent === 'body' ? document.body : parent).appendChild(el);

  Object.assign(el, rest);

  if (children) for (const childEl of children) el.appendChild(childEl);

  return el;
};
