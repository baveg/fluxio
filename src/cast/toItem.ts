import { isItem } from '../check';

interface ToItem {
  <T = any>(value?: T | null | undefined): T & {};
  <T = any, U = any>(value: T | null | undefined, defaultValue: U): T & U & {};
}
export const toItem = ((v: any, d: any) =>
  isItem(v) ? v
  : isItem(d) ? d
  : {}) as ToItem;
