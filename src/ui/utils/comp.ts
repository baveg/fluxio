import { isFunction } from '../../check/isFunction';
import type { ComponentChildren, ComponentType } from 'preact';
import { createElement } from 'preact';

export type Comp<P = {}> = null | undefined | ComponentChildren | ComponentType<P>;

export const comp = <P = {}>(content: Comp, props?: P): ComponentChildren =>
  isFunction(content) ? createElement(content, props || {}) : content || null;
