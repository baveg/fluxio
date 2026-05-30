import { useFlux } from './useFlux';
import { getTr } from '@fluxio/core/string/tr';

export const useTr = (namespace: string) => {
  const tr = getTr(namespace);
  useFlux(tr.changed$);
  return tr;
};
