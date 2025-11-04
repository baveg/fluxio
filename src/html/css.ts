import { isFloat } from '../check/isNumber';
import { isArray } from '../check/isArray';
import { Dictionary } from '../types/Dictionary';
import { toString } from '../cast/toString';
import { isDeepEqual } from '../object/isDeepEqual';
import { createEl } from './createEl';
import { isString, isStringValid } from '../check/isString';
import { isItem } from '../check/isItem';
import { pascalToKebabCase } from '../string/cases';
import { isFunction } from '../check/isFunction';
import { isEmpty } from '../check/isEmpty';
import { CssAnimValue, CssStyle } from './cssTypes';

let cssColors: Dictionary<string> = {};

export const getCssColors = () => cssColors;

export const getCssColor = (k: string) => cssColors[k] || k;

type V = number | string | (number | string)[];
type S = CssStyle;

let animId = 0;

const animToCss = (v: CssAnimValue, s: S, styles: Dictionary<CssStyle | string>) => {
  if (isString(v)) {
    s.animation = v;
    return;
  }
  const { keyframes, duration, count, timing } = v;
  let { name } = v;
  if (!name) name = `fluxio${animId++}`;

  const sb = [];
  for (const key in keyframes) {
    const keyframe = keyframes[key];
    if (keyframe) {
      sb.push(`${key} { transform: `);

      const { transform } = keyframe;
      if (isString(transform)) {
        sb.push(`${transform};`);
      } else {
        const { rotate: r, scale: s, translateX: x, translateY: y } = transform;
        if (r) sb.push(`rotate(${isFloat(r) ? `${r}deg` : r});`);
        if (s) sb.push(`scale(${s});`);
        if (x) sb.push(`translateX(${isFloat(x) ? `${x}%` : x});`);
        if (y) sb.push(`translateY(${isFloat(y) ? `${y}%` : y});`);
      }

      sb.push(` }`);
    }
  }

  styles[`@keyframes ${name}`] = sb.join('');

  s.animationName = name;
  if (duration) s.animationDuration = name;
  if (count) s.animationIterationCount = String(count);
  if (timing) s.animationTimingFunction = timing;

  return;
};

const addTransform = (v: string, s: S) => {
  s.transform = s.transform ? `${s.transform} ${v}` : v;
};

const transformProp = (prop: string) => (v: V, s: S) => addTransform(`${prop}(${v})`, s);

const g = (v: V): string =>
  typeof v === 'number' ? v + 'rem'
  : typeof v === 'string' ? v
  : v.map(g).join(' ');

export const cssFunMap = {
  x: (v: V, s: S) => {
    s.left = g(v);
  },
  y: (v: V, s: S) => {
    s.top = g(v);
  },
  xy: (v: V, s: S) => {
    const u = g(v);
    s.left = u;
    s.top = u;
  },

  l: (v: V, s: S) => {
    s.left = g(v);
  },
  t: (v: V, s: S) => {
    s.top = g(v);
  },
  r: (v: V, s: S) => {
    s.right = g(v);
  },
  b: (v: V, s: S) => {
    s.bottom = g(v);
  },

  inset: (v: V, s: S) => {
    const u = g(v);
    s.left = u;
    s.top = u;
    s.right = u;
    s.bottom = u;
  },

  w: (v: V, s: S) => {
    s.width = g(v);
  },
  h: (v: V, s: S) => {
    s.height = g(v);
  },
  wh: (v: V, s: S) => {
    const u = g(v);
    s.width = u;
    s.height = u;
  },

  wMax: (v: V, s: S) => {
    s.maxWidth = g(v);
  },
  hMax: (v: V, s: S) => {
    s.maxHeight = g(v);
  },
  whMax: (v: V, s: S) => {
    const u = g(v);
    s.maxWidth = u;
    s.maxHeight = u;
  },

  wMin: (v: V, s: S) => {
    s.minWidth = g(v);
  },
  hMin: (v: V, s: S) => {
    s.minHeight = g(v);
  },
  whMin: (v: V, s: S) => {
    const u = g(v);
    s.minWidth = u;
    s.minHeight = u;
  },

  fontSize: (v: V, s: S) => {
    s.fontSize = g(v);
  },

  m: (v: V, s: S) => {
    s.margin = g(v);
  },
  mt: (v: V, s: S) => {
    s.marginTop = g(v);
  },
  mr: (v: V, s: S) => {
    s.marginRight = g(v);
  },
  mb: (v: V, s: S) => {
    s.marginBottom = g(v);
  },
  ml: (v: V, s: S) => {
    s.marginLeft = g(v);
  },
  mx: (v: V, s: S) => {
    const u = g(v);
    s.marginLeft = u;
    s.marginRight = u;
  },
  my: (v: V, s: S) => {
    const u = g(v);
    s.marginTop = u;
    s.marginBottom = u;
  },

  p: (v: V, s: S) => {
    s.padding = g(v);
  },
  pt: (v: V, s: S) => {
    s.paddingTop = g(v);
  },
  pr: (v: V, s: S) => {
    s.paddingRight = g(v);
  },
  pb: (v: V, s: S) => {
    s.paddingBottom = g(v);
  },
  pl: (v: V, s: S) => {
    s.paddingLeft = g(v);
  },
  px: (v: V, s: S) => {
    const u = g(v);
    s.paddingLeft = u;
    s.paddingRight = u;
  },
  py: (v: V, s: S) => {
    const u = g(v);
    s.paddingTop = u;
    s.paddingBottom = u;
  },

  elevation: (v: number, s: S) => {
    s.boxShadow = `${g(v * 0.1)} ${g(v * 0.2)} ${g(v * 0.25)} 0px ${getCssColor('shadow')}`;
  },

  rounded: (v: number, s: S) => {
    s.borderRadius = g(v * 0.2);
  },

  bold: (v: string | boolean | 1 | 0, s: S) => {
    s.fontWeight =
      isString(v) ? (v as S['fontWeight'])
      : v ? 'bold'
      : 'regular';
  },

  bg: (v: string, s: S) => {
    s.backgroundColor = getCssColor(v);
  },
  fg: (v: string, s: S) => {
    s.color = getCssColor(v);
  },
  bColor: (v: string, s: S) => {
    s.borderColor = getCssColor(v);
  },
  bgUrl: (v: string, s: S) => {
    s.backgroundImage = `url("${v}")`;
  },

  bgMode: (v: 'contain' | 'cover' | 'fill', s: S) => {
    s.backgroundRepeat = 'no-repeat';
    s.backgroundPosition = 'center';
    s.backgroundSize = v === 'fill' ? '100% 100%' : v;
  },

  itemFit: (v: 'contain' | 'cover' | 'fill', s: S) => {
    if (v === 'contain') {
      s.maxWidth = '100%';
      s.maxHeight = '100%';
      s.objectFit = v;
      return;
    }
    if (v === 'cover' || v === 'fill') {
      s.minWidth = '100%';
      s.minHeight = '100%';
      s.objectFit = v;
      return;
    }
  },

  anim: animToCss,

  transition: (v: number | string | boolean, s: S) => {
    s.transition =
      isFloat(v) ? `all ${v}s ease;`
      : isString(v) ? v
      : 'all 0.3s ease';
  },

  transform: addTransform,

  rotate: transformProp('rotate'),

  scale: transformProp('scale'),
  scaleX: transformProp('scaleX'),
  scaleY: transformProp('scaleY'),

  translate: transformProp('translate'),
  translateX: transformProp('translateX'),
  translateY: transformProp('translateY'),

  fRow: (v: 1 | S['alignItems'] | [S['alignItems'], S['justifyContent']], s: S) => {
    const a =
      isArray(v) ? v
      : isString(v) ? [v]
      : [];
    s.display = 'flex';
    s.flexDirection = 'row';
    s.alignItems = toString(a[0], 'center');
    s.justifyContent = toString(a[1], 'space-between');
  },
  fCol: (v: 1 | S['alignItems'] | [S['alignItems'], S['justifyContent']], s: S) => {
    const a =
      isArray(v) ? v
      : isString(v) ? [v]
      : [];
    s.display = 'flex';
    s.flexDirection = 'column';
    s.alignItems = toString(a[0], 'stretch');
    s.justifyContent = toString(a[1], 'flex-start');
  },
  fCenter: (v: 1 | S['flexDirection'], s: S) => {
    const a =
      isArray(v) ? v
      : isString(v) ? [v]
      : [];
    s.display = 'flex';
    s.flexDirection = toString(a[0], 'column');
    s.alignItems = 'center';
    s.justifyContent = 'center';
  },
};

type StyleFunMap = typeof cssFunMap;

export type StyleFunProps = {
  [K in keyof StyleFunMap]?: Parameters<StyleFunMap[K]>[0];
};

export type Style = Omit<CssStyle, keyof StyleFunProps> & StyleFunProps;

export const computeStyle = (
  record?: Style,
  style: CssStyle = {},
  styles: Dictionary<CssStyle | string> = {}
) => {
  if (!record) return {};
  for (const prop in record) {
    const value = (record as any)[prop];
    const fun = (cssFunMap as any)[prop];
    if (isFunction(fun)) {
      fun(value, style, styles);
    } else {
      (style as any)[prop] = value;
    }
  }
  return style;
};

export const computeStyles = (
  prefix: string,
  inputs?: Dictionary<Style>,
  styles: Dictionary<CssStyle | string> = {}
) => {
  for (const k in inputs) {
    const record = inputs[k];
    const query = `${prefix}${k.replace(/&/g, prefix)}`;
    const style: S = (styles[query] as S) || (styles[query] = {});
    computeStyle(record, style, styles);
  }
  return styles;
};

export const styleToCss = (style: string | CssStyle) => {
  if (isString(style)) return style;
  const sb = [];
  for (const prop in style) {
    const value = (style as any)[prop];
    const propKebab = pascalToKebabCase(prop);
    sb.push(`${propKebab}:${value};`);
  }
  const css = sb.join('\n');
  return css;
};

export const stylesToCss = (styles: Dictionary<CssStyle | string> = {}) => {
  const sb = [];
  for (const query in styles) {
    const output = styles[query];
    if (output && !isEmpty(output)) {
      sb.push(`${query} { ${styleToCss(output)} }`);
    }
  }
  const css = sb.join('\n');
  return css;
};

export type StylesValue = null | string | string[] | Dictionary<Style>;

const cssCache: { [key: string]: [HTMLElement, StylesValue, number] } = {};

let cssCount = 0;

export const setCss = (key: string, css?: StylesValue, order?: number, force?: boolean) => {
  const cache = cssCache[key];

  if (cache) {
    if (!force && isDeepEqual(cache[1], css)) return key;
    cache[0].remove();
    delete cssCache[key];
  }

  if (css) {
    const el = createEl('style');

    el.textContent =
      isString(css) ? css
      : isArray(css) ? css.join('\n')
      : isItem(css) ? stylesToCss(computeStyles(`.${key}`, css))
      : '';

    cssCache[key] = [el, css, order || cssCount++];

    Object.values(cssCache)
      .sort((a, b) => a[2] - b[2])
      .map((p) => {
        document.head.appendChild(p[0]);
      });
  }

  return key;
};

export const Css = (key: string, styles?: StylesValue) => {
  const order = cssCount++;
  let isInit = false;
  return (...args: (string | { class?: any } | boolean | number | undefined | null)[]) => {
    if (!isInit) {
      setCss(key, styles, order);
      isInit = true;
    }

    if (args.length === 0) {
      return { class: key };
    }

    const sb = [];

    for (const arg of args) {
      if (isString(arg)) {
        sb.push(key + arg);
        continue;
      }
      if (isItem(arg) && isStringValid(arg.class)) {
        sb.push(arg.class);
      }
    }

    return { class: sb.join(' ') };
  };
};

export const refreshCss = () => {
  for (const key in cssCache) {
    const r = cssCache[key];
    if (r) {
      const [, css, order] = r;
      setCss(key, css, order, true);
    }
  }
};

export const setCssColors = (next: Dictionary<string>) => {
  cssColors = next;
  refreshCss();
};

export const clsx = (...classNames: any[]) => {
  const sb: string[] = [];
  for (const c of classNames) {
    if (c) {
      if (typeof c === 'string') sb.push(c);
      else if (isArray(c)) {
        const cls = clsx(...c);
        if (cls) sb.push(cls);
      }
    }
  }
  return sb.join(' ') || undefined;
};
