import { isFloat, isNumber } from '../check/isNumber';
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
import {
  StyleAnim,
  CssStyle,
  StyleFlexAlign,
  StyleFlexDirection,
  StyleFlexJustify,
} from './cssTypes';
import { isDefined } from 'fluxio/check';
import { toNumber } from 'fluxio/cast';

let cssColors: Dictionary<string> = {};

export const getCssColors = () => cssColors;

type V = number | string | (number | string)[];
type S = CssStyle;

let animId = 0;

const animToCss = (v: StyleAnim, s: S, styles: Dictionary<CssStyle | string>) => {
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
      const k = toNumber(key, null);
      sb.push(isFloat(k) ? `${k}% { ` : `${key} { `);

      const { rotate: r, scale: s, x, y, opacity } = keyframe;

      if (isDefined(r) || isDefined(s) || isDefined(x) || isDefined(y)) {
        sb.push(`transform: `);
        if (isDefined(r)) sb.push(`rotate(${isFloat(r) ? `${r}deg` : r}) `);
        if (isDefined(s)) sb.push(`scale(${s}) `);
        if (isDefined(x)) sb.push(`translateX(${isFloat(x) ? `${x}%` : x}) `);
        if (isDefined(y)) sb.push(`translateY(${isFloat(y) ? `${y}%` : y}) `);
        sb.push(`; `);
      }

      if (isDefined(opacity)) {
        sb.push(`opacity: ${opacity}; `);
      }

      sb.push(`}`);
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

const transformProp = (prop: string) => (v: number | string, s: S) =>
  addTransform(`${prop}(${v})`, s);

type Rem = string | number;
const rem = (v: Rem): string => (typeof v === 'number' ? `${v}rem` : String(v));

type Px = string | number;
const px = (v: Px | Px[]): string =>
  typeof v === 'number' ? `${v}px`
  : isArray(v) ? v.map(px).join(' ')
  : String(v);

const fConvert = (v: any, defaultValue?: string): any =>
  (!isStringValid(v) && defaultValue) ? fConvert(defaultValue)
  : v === 'start' ? 'flex-start'
  : v === 'end' ? 'flex-end'
  : v === 'between' ? 'space-between'
  : v === 'around' ? 'space-around'
  : v;

const borderPx = (v: number | string) =>
  isNumber(v) ? `${v}px solid ${cssColors.border || 'black'}`
  : isString(v) && v.includes(' ') ? v
  : `1px solid ${cssColors[v] || v}`;

export const cssFunMap = {
  x: (v: Px, s: S) => {
    s.left = px(v);
  },
  y: (v: Px, s: S) => {
    s.top = px(v);
  },
  xy: (v: Px, s: S) => {
    s.left = s.top = px(v);
  },

  t: (v: Px, s: S) => {
    s.top = px(v);
  },
  r: (v: Px, s: S) => {
    s.right = px(v);
  },
  b: (v: Px, s: S) => {
    s.bottom = px(v);
  },
  l: (v: Px, s: S) => {
    s.left = px(v);
  },
  inset: (v: Px, s: S) => {
    s.top = s.right = s.bottom = s.left = px(v);
  },

  w: (v: Px, s: S) => {
    s.width = px(v);
  },
  h: (v: Px, s: S) => {
    s.height = px(v);
  },
  wh: (v: Px, s: S) => {
    s.width = s.height = px(v);
  },

  wMax: (v: Px, s: S) => {
    s.maxWidth = px(v);
  },
  hMax: (v: Px, s: S) => {
    s.maxHeight = px(v);
  },
  whMax: (v: Px, s: S) => {
    s.maxWidth = s.maxHeight = px(v);
  },

  wMin: (v: Px, s: S) => {
    s.minWidth = px(v);
  },
  hMin: (v: Px, s: S) => {
    s.minHeight = px(v);
  },
  whMin: (v: Px, s: S) => {
    s.minWidth = s.minHeight = px(v);
  },

  fontSize: (v: Rem, s: S) => {
    s.fontSize = rem(v);
  },

  m: (v: Px, s: S) => {
    s.margin = px(v);
  },
  mt: (v: Px, s: S) => {
    s.marginTop = px(v);
  },
  mr: (v: Px, s: S) => {
    s.marginRight = px(v);
  },
  mb: (v: Px, s: S) => {
    s.marginBottom = px(v);
  },
  ml: (v: Px, s: S) => {
    s.marginLeft = px(v);
  },
  mx: (v: Px, s: S) => {
    s.marginLeft = s.marginRight = px(v);
  },
  my: (v: Px, s: S) => {
    s.marginTop = s.marginBottom = px(v);
  },

  p: (v: Px, s: S) => {
    s.padding = px(v);
  },
  pt: (v: Px, s: S) => {
    s.paddingTop = px(v);
  },
  pr: (v: Px, s: S) => {
    s.paddingRight = px(v);
  },
  pb: (v: Px, s: S) => {
    s.paddingBottom = px(v);
  },
  pl: (v: Px, s: S) => {
    s.paddingLeft = px(v);
  },
  px: (v: Px, s: S) => {
    s.paddingLeft = s.paddingRight = px(v);
  },
  py: (v: Px, s: S) => {
    s.paddingTop = s.paddingBottom = px(v);
  },

  elevation: (v: number, s: S) => {
    s.boxShadow = `${px(1 * v)} ${px(2 * v)} ${px(4 * v + 2)} 0px ${cssColors.shadow || 'black'}`;
  },

  rounded: (v: Px | Px[], s: S) => {
    s.borderRadius = px(v);
  },

  bold: (v: string | boolean | 1 | 0, s: S) => {
    s.fontWeight =
      isString(v) ? (v as S['fontWeight'])
      : v ? 'bold'
      : 'regular';
  },

  bg: (v: string, s: S) => {
    s.backgroundColor = cssColors[v] || v;
  },
  fg: (v: string, s: S) => {
    s.color = cssColors[v] || v;
  },
  border: (v: Px, s: S) => {
    s.border = borderPx(v);
  },
  bl: (v: number | string, s: S) => {
    s.borderLeft = borderPx(v);
  },
  br: (v: number | string, s: S) => {
    s.borderRight = borderPx(v);
  },
  bt: (v: number | string, s: S) => {
    s.borderTop = borderPx(v);
  },
  bb: (v: number | string, s: S) => {
    s.borderBottom = borderPx(v);
  },
  bx: (v: Px, s: S) => {
    s.borderLeft = s.borderRight = borderPx(v);
  },
  by: (v: Px, s: S) => {
    s.borderTop = s.borderBottom = borderPx(v);
  },
  borderColor: (v: string, s: S) => {
    s.borderColor = cssColors[v] || v;
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
      s.maxWidth = s.maxHeight = '100%';
      s.objectFit = v;
      return;
    }
    if (v === 'cover' || v === 'fill') {
      s.minWidth = s.minHeight = '100%';
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

  row: (v: 1 | StyleFlexAlign | [StyleFlexAlign, StyleFlexJustify], s: S) => {
    const a =
      isArray(v) ? v
      : isString(v) ? [v]
      : [];
    s.display = 'flex';
    s.flexDirection = 'row';
    s.alignItems = fConvert(a[0], 'center');
    s.justifyContent = fConvert(a[1], 'between');
  },
  rowWrap: (v: 1, s: S) => {
    s.display = 'flex';
    s.flexDirection = 'row';
    s.flexWrap = 'wrap';
    s.alignItems = fConvert('center');
    s.justifyContent = fConvert('around');
    s.alignContent = fConvert('around');
  },
  col: (v: 1 | StyleFlexAlign | [StyleFlexAlign, StyleFlexJustify], s: S) => {
    const a =
      isArray(v) ? v
      : isString(v) ? [v]
      : [];
    s.display = 'flex';
    s.flexDirection = 'column';
    s.alignItems = fConvert(a[0], 'stretch');
    s.justifyContent = fConvert(a[1], 'start');
  },
  center: (v: 1 | StyleFlexDirection, s: S) => {
    const a =
      isArray(v) ? v
      : isString(v) ? [v]
      : [];
    s.display = 'flex';
    s.flexDirection = toString(a[0], 'column');
    s.alignItems = 'center';
    s.justifyContent = 'center';
    s.textAlign = 'center';
  },

  alignItems: (v: 1 | StyleFlexDirection, s: S) => {
    s.alignItems = fConvert(v, 'center');
  },
  justifyContent: (v: 1 | StyleFlexJustify, s: S) => {
    s.justifyContent = fConvert(v, 'center');
  },
  alignContent: (v: 1 | StyleFlexJustify, s: S) => {
    s.alignContent = fConvert(v, 'center');
  },
  alignSelf: (v: 1 | StyleFlexJustify, s: S) => {
    s.alignSelf = fConvert(v, 'center');
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
): CssStyle => {
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
  return style as CssStyle;
};

export const computeStyles = (
  prefix: string,
  inputs?: Dictionary<Style>,
  styles: Dictionary<CssStyle | string> = {}
) => {
  for (const k in inputs) {
    const record = inputs[k];
    const query = `${prefix}${k.replace(/, ?&?/g, `,${prefix}`).replace(/&/g, prefix)}`;
    const style: CssStyle = (styles[query] as CssStyle) || (styles[query] = {});
    computeStyle(record, style, styles);
  }
  return styles;
};

const cssPropMap: Dictionary<string> = {};
export const getCssProp = (prop: string) =>
  cssPropMap[prop] || (cssPropMap[prop] = pascalToKebabCase(prop));

export const styleToCss = (style: string | CssStyle) => {
  if (isString(style)) return style;
  const sb = [];
  for (const prop in style) {
    const value = (style as any)[prop];
    sb.push(`${getCssProp(prop)}:${value};`);
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
