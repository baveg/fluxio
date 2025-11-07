import { NextState } from './NextState';

export type SetState<T> = (next: NextState<T>) => void;
