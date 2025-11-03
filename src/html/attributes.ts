import { Dictionary } from '../check/isDictionary';

export type Attributes = Dictionary<any>;

export const getAttributes = (el: Element): Attributes =>
  Object.fromEntries(el.getAttributeNames().map((name) => [name, el.getAttribute(name)]));

export const setAttributes = (el: Element, attributes: Attributes) => {
  for (const n in attributes) el.setAttribute(n, attributes[n]);
};

export const resetAttributes = (el: Element) => {
  for (const a of Array.from(el.attributes)) el.removeAttribute(a.name);
};

export const replaceAttributes = (el: Element, attributes: Attributes) => {
  resetAttributes(el);
  setAttributes(el, attributes);
};
