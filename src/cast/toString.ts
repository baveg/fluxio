import { isNil } from '../check';

interface ToString {
  (value: any): string;
  <T extends string = string>(value: any | T, defaultValue: T): T;
}
export const toString = ((v: any, d: any = '') => (isNil(v) ? d : String(v))) as ToString;
