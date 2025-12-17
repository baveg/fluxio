import { WVector } from 'fluxio/types/Vector';

interface SetItem {
  <V extends WVector>(vector: V, index: number, value: V[0]): V;
  <T>(items: T[], index: number, replace: T): T;
}
export const setItem: SetItem = <T>(items: T[], index: number, replace: T) => {
  items[index] = replace;
  return items;
};
