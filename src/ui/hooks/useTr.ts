import { useFlux } from './useFlux';
import { getTr } from '../utils/tr';

export const useTr = (namespace: string) => {
  const tr = getTr(namespace);
  useFlux(tr.changed$);
  return tr;
};
