import { Dictionary } from '../types/Dictionary';
import { isArray } from './isArray';

export const isDictionary = <T extends Dictionary = Dictionary>(v: any): v is T =>
  v && typeof v === 'object' && !isArray(v);
