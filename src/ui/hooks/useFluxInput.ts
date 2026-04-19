import type { Flux } from '../../flux/Flux';
import { getInputValue } from '../utils/getInputValue';
import { useFlux } from './useFlux';

export interface FluxInputProps {
  value: string;
  onInput: (e: Event) => void;
}

export const useFluxInput = (value$: Flux<string>): FluxInputProps => {
  const value = useFlux(value$);
  return {
    value,
    onInput: (e: Event) => value$.set(getInputValue(e)),
  };
};
