import type { Unsubscribe } from '../types/Unsubscribe';

export const combineOffs = (...offs: Unsubscribe[]): Unsubscribe => () => offs.forEach((off) => off());
