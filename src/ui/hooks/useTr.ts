import { useFlux } from './useFlux';
import { getTr } from '../../string/tr';

export const useTr = (namespace: string) => {
  const tr = getTr(namespace);
  useFlux(tr.changed$);
  return tr;
};
