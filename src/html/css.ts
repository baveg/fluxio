import { isFloat } from '../check/isNumber';
import { isArray } from '../check/isArray';
import { Dictionary } from '../check/isDictionary';
import { toString } from '../cast/toString';
import { isDeepEqual } from '../object/isDeepEqual';
import { createEl } from './createEl';
import { isString, isStringValid } from '../check/isString';
import { isItem } from '../check/isItem';
import { logger } from '../logger';
import { pascalToKebabCase } from 'fluxio/string/cases';
import { isFunction, isObject } from 'fluxio/check';

const log = logger('css');

const FLEX_DIRECTION = 'flex-direction';
const ALIGN_ITEMS = 'align-items';
const JUSTIFY_CONTENT = 'justify-content';
const MAX_W = 'max-width';
const MIN_W = 'min-width';
const MAX_H = 'max-height';
const MIN_H = 'min-height';
const M = 'margin';
const M_TOP = M + '-top';
const M_RIGHT = M + '-right';
const M_BOTTOM = M + '-bottom';
const M_LEFT = M + '-left';
const P = 'padding';
const P_TOP = P + '-top';
const P_RIGHT = P + '-right';
const P_BOTTOM = P + '-bottom';
const P_LEFT = P + '-left';
const OBJECT_FIT = 'object-fit';
const BG = 'background';
const BG_COLOR = BG + '-color';
const BG_IMAGE = BG + '-image';
const BG_REPEAT = BG + '-repeat';
const BG_POSITION = BG + '-position';
const BG_SIZE = BG + '-size';
const ANIM = 'animation';
const ANIM_NAME = ANIM + '-name';
const ANIM_DURATION = ANIM + '-duration';
const ANIM_COUNT = ANIM + '-iteration-count';
const ANIM_TIMING = ANIM + '-timing-function';

let cssColors: Dictionary<string> = {};

export const getCssColors = () => cssColors;

export const getCssColor = (k: string) => cssColors[k] || k;

type U = number | string | (number | string)[];
type O = { [prop: string]: string | number };

export type CssOutput = O;
export type CssOutputs = Dictionary<O | string>;

type CssTransform =
  | string
  | {
      rotate?: string | number; // 0deg
      scale?: string | number;
      translateX?: string | number;
      translateY?: string | number;
    };

type AnimValue =
  | string
  | {
      name?: string;
      count?: string | number;
      timing?: string | number;
      duration?: string | number;
      keyframes?: Record<'from' | 'to' | string, { transform: CssTransform }>;
    };

let animId = 0;

const animToCss = (v: AnimValue, o: O, outputs: CssOutputs) => {
  if (isString(v)) {
    o.animation = v;
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

  outputs[`@keyframes ${name}`] = sb.join('\n');

  o[ANIM_NAME] = name;
  if (duration) o[ANIM_DURATION] = name;
  if (count) o[ANIM_COUNT] = count;
  if (timing) o[ANIM_TIMING] = timing;

  return;
};

const addTransform = (v: string, o: O) => {
  o.transform = o.transform ? `${o.transform} ${v}` : v;
};

const transformProp = (prop: string) => (v: U, o: O) => addTransform(`${prop}(${g(v)})`, o);

const g = (v: U): string =>
  typeof v === 'number' ? v + 'rem'
  : typeof v === 'string' ? v
  : v.map(g).join(' ');

export type FlexDirection = '' | 'row' | 'column' | 'row-reverse' | 'column-reverse';
export type FlexAlign = '' | 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type FlexJustify =
  | ''
  | 'start'
  | 'center'
  | 'end'
  | 'evenly'
  | 'space-between'
  | 'space-around';

export const cssFunMap = {
  x: (v: U, o: O) => {
    o.left = g(v);
  },
  y: (v: U, o: O) => {
    o.top = g(v);
  },
  xy: (v: U, o: O) => {
    const u = g(v);
    o.left = u;
    o.top = u;
  },

  l: (v: U, o: O) => {
    o.left = g(v);
  },
  t: (v: U, o: O) => {
    o.top = g(v);
  },
  r: (v: U, o: O) => {
    o.right = g(v);
  },
  b: (v: U, o: O) => {
    o.bottom = g(v);
  },

  inset: (v: U, o: O) => {
    const u = g(v);
    o.left = u;
    o.top = u;
    o.right = u;
    o.bottom = u;
  },

  w: (v: U, o: O) => {
    o.width = g(v);
  },
  h: (v: U, o: O) => {
    o.height = g(v);
  },
  wh: (v: U, o: O) => {
    const u = g(v);
    o.width = u;
    o.height = u;
  },

  wMax: (v: U, o: O) => {
    o[MAX_W] = g(v);
  },
  hMax: (v: U, o: O) => {
    o[MAX_H] = g(v);
  },
  whMax: (v: U, o: O) => {
    const u = g(v);
    o[MAX_W] = u;
    o[MAX_H] = u;
  },

  wMin: (v: U, o: O) => {
    o[MIN_W] = g(v);
  },
  hMin: (v: U, o: O) => {
    o[MIN_H] = g(v);
  },
  whMin: (v: U, o: O) => {
    const u = g(v);
    o[MIN_W] = u;
    o[MIN_H] = u;
  },

  fontSize: (v: U, o: O) => {
    o['font-size'] = g(v);
  },

  m: (v: U, o: O) => {
    o.margin = g(v);
  },
  mt: (v: U, o: O) => {
    o[M_TOP] = g(v);
  },
  mr: (v: U, o: O) => {
    o[M_RIGHT] = g(v);
  },
  mb: (v: U, o: O) => {
    o[M_BOTTOM] = g(v);
  },
  ml: (v: U, o: O) => {
    o[M_LEFT] = g(v);
  },
  mx: (v: U, o: O) => {
    const u = g(v);
    o[M_LEFT] = u;
    o[M_RIGHT] = u;
  },
  my: (v: U, o: O) => {
    const u = g(v);
    o[M_TOP] = u;
    o[M_BOTTOM] = u;
  },

  p: (v: U, o: O) => {
    o.padding = g(v);
  },
  pt: (v: U, o: O) => {
    o[P_TOP] = g(v);
  },
  pr: (v: U, o: O) => {
    o[P_RIGHT] = g(v);
  },
  pb: (v: U, o: O) => {
    o[P_BOTTOM] = g(v);
  },
  pl: (v: U, o: O) => {
    o[P_LEFT] = g(v);
  },
  px: (v: U, o: O) => {
    const u = g(v);
    o[P_LEFT] = u;
    o[P_RIGHT] = u;
  },
  py: (v: U, o: O) => {
    const u = g(v);
    o[P_TOP] = u;
    o[P_BOTTOM] = u;
  },

  elevation: (v: number, o: O) => {
    o['box-shadow'] = `${g(v * 0.1)} ${g(v * 0.2)} ${g(v * 0.25)} 0px ${getCssColor('shadow')}`;
  },

  rounded: (v: number, o: O) => {
    o['border-radius'] = g(v * 0.2);
  },

  bold: (v: 1 | 0, o: O) => {
    o['font-weight'] = v ? 'bold' : 'normal';
  },

  bg: (v: string, o: O) => {
    o[BG_COLOR] = getCssColor(v);
  },
  fg: (v: string, o: O) => {
    o.color = getCssColor(v);
  },
  bColor: (v: string, o: O) => {
    o['border-color'] = getCssColor(v);
  },
  bgUrl: (v: string, o: O) => {
    o[BG_IMAGE] = `url("${v}")`;
  },

  bgMode: (v: 'contain' | 'cover' | 'fill', o: O) => {
    o[BG_REPEAT] = 'no-repeat';
    o[BG_POSITION] = 'center';
    o[BG_SIZE] = v === 'fill' ? '100% 100%' : v;
  },

  itemFit: (v: 'contain' | 'cover' | 'fill', o: O) => {
    if (v === 'contain') {
      o[MAX_W] = '100%';
      o[MAX_H] = '100%';
      o[OBJECT_FIT] = v;
      return;
    }
    if (v === 'cover' || v === 'fill') {
      o[MIN_W] = '100%';
      o[MIN_H] = '100%';
      o[OBJECT_FIT] = v;
      return;
    }
  },

  anim: animToCss,

  transition: (v: number | string | boolean, o: O) => {
    o.transition =
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

  fRow: (v: [] | [FlexAlign] | [FlexAlign, FlexJustify], o: O) => {
    o.display = 'flex';
    o[FLEX_DIRECTION] = 'row';
    o[ALIGN_ITEMS] = toString(v[0], 'center');
    o['justify-content'] = toString(v[1], 'space-between');
  },
  fCol: (v: [] | [FlexAlign] | [FlexAlign, FlexJustify], o: O) => {
    o.display = 'flex';
    o[FLEX_DIRECTION] = 'column';
    o[ALIGN_ITEMS] = toString(v[0], 'stretch');
    o[JUSTIFY_CONTENT] = toString(v[1], 'start');
  },
  fCenter: (v: [] | [FlexDirection], o: O) => {
    o.display = 'flex';
    o[FLEX_DIRECTION] = toString(v[0], 'column');
    o[ALIGN_ITEMS] = 'center';
    o[JUSTIFY_CONTENT] = 'center';
  },
};

type CssFunMap = typeof cssFunMap;

export type CssRecord = CssOutput & {
  [K in keyof CssFunMap]?: Parameters<CssFunMap[K]>[0];
};

export type CssInput = CssRecord & { [name: string]: CssInput };
export type CssInputs = Dictionary<CssInput>;

export const computeCss = (prefix: string, inputs?: CssInputs, outputs: CssOutputs = {}) => {
  log.d('computeCss outputs', prefix, inputs, outputs);
  for (const k in inputs) {
    const record = inputs[k];
    const query = k
      .split(',')
      .map((c) => `${prefix}${c}`)
      .join(',');
    log.d('computeCss query', query);
    const output: O = (outputs[query] as O) || (outputs[query] = {});

    for (const prop in record) {
      const value = record[prop];
      const fun = (cssFunMap as any)[prop];
      if (isFunction(fun)) {
        log.d('computeCss fun', prop, value);
        fun(value, output, outputs);
      } else if (isObject(value)) {
        log.d('computeCss obj', prop, value);
        computeCss(query, { '': value }, outputs);
      } else if (value) {
        const propKebab = pascalToKebabCase(prop);
        log.d('computeCss prop', prop, propKebab);
        output[propKebab] = value;
      }
    }

    log.d('computeCss output', output);
  }
  return outputs;
};

export const outputsToCss = (outputs: CssOutputs = {}) => {
  const sb = [];
  for (const query in outputs) {
    sb.push(`${query} {`);
    const output = outputs[query];
    if (isString(output)) {
      sb.push(`${output}`);
    } else {
      for (const prop in output) {
        const value = output[prop];
        sb.push(`${prop}:${value};`);
      }
    }
    sb.push(`}`);
  }
  const css = sb.join('\n');
  return css;
};

export const formatCss = (prefix: string, inputs?: CssInputs): string => {
  log.d('formatCss', prefix, inputs);

  const outputs = computeCss(prefix, inputs);
  log.d('formatCss outputs', prefix, inputs, outputs);

  const css = outputsToCss(outputs);
  log.d('formatCss css', prefix, inputs, outputs, css);

  return css;
};

export type CssValue = null | string | string[] | CssInputs;

const cssCache: { [key: string]: [HTMLElement, CssValue, number] } = {};

let cssCount = 0;

export const setCss = (key: string, css?: CssValue, order?: number, force?: boolean) => {
  const cache = cssCache[key];
  log.d('setCss', key, css, order, force, cache);

  if (cache) {
    if (!force && isDeepEqual(cache[1], css)) return key;
    log.d('setCss remove', key, css, order, force);
    cache[0].remove();
    delete cssCache[key];
  }

  if (css) {
    const el = createEl('style');
    log.d('setCss el', key, css, order, force, el);

    el.textContent =
      isString(css) ? css
      : isArray(css) ? css.join('\n')
      : isItem(css) ? formatCss(`.${key}`, css)
      : '';

    cssCache[key] = [el, css, order || cssCount++];

    Object.values(cssCache)
      .sort((a, b) => a[2] - b[2])
      .map((p) => {
        document.head.appendChild(p[0]);
      });

    log.d('setCss ok', key, css, order, force, el);
  }

  return key;
};

export const Css = (key: string, css?: CssValue) => {
  const order = cssCount++;
  let isInit = false;
  log.d('Css', key, css, order);

  return (...args: (string | { class?: any } | boolean | number | undefined | null)[]) => {
    if (!isInit) {
      log.d('Css init', key, css, order);
      setCss(key, css, order);
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
  log.d('refreshCss', cssCache);
  for (const key in cssCache) {
    const r = cssCache[key];
    if (r) {
      const [, css, order] = r;
      setCss(key, css, order, true);
    }
  }
};

export const setCssColors = (next: Dictionary<string>) => {
  log.d('setCssColors', next);
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
