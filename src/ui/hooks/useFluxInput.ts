import { useMemo, useEffect } from 'preact/hooks';
import type { Flux } from '../../flux/Flux';
import { flux } from '../../flux';
import { toInt, toFloat } from '../../cast/toNumber';
import { toBoolean } from '../../cast/toBoolean';
import { toString } from '../../cast/toString';
import { jsonParse, jsonStringify } from '../../string/json';
import { getInputValue } from '../utils/getInputValue';
import { useFlux } from './useFlux';

export type InputType = 'text' | 'password' | 'email' | 'int' | 'float' | 'json' | 'checkbox';

export interface FluxInputOptions<T extends InputType | undefined = undefined> {
  delay?: number;
  type?: T;
}

const valueToRaw = (value: any, type: InputType): string => (
  type === 'json' ? jsonStringify(value) :
  toString(value)
);

const rawToValue = (raw: string, type: InputType): any => (
  type === 'int' ? toInt(raw) :
  type === 'float' ? toFloat(raw) :
  type === 'checkbox' ? raw === '' ? null : toBoolean(raw) :
  type === 'json' ? jsonParse(raw) :
  raw
);

export const useFluxInput = (
  type: InputType,
  val$: Flux<any>,
  delay = 200,
) => {
  const raw$ = useMemo(() => flux(valueToRaw(val$.get(), type)), [value$]);

  useEffect(
    () => raw$.debounce(delay).on((raw) => val$.set(rawToValue(raw, type))),
    [raw$, val$]
  );

  const value = useFlux(raw$);

  if (type === 'checkbox') {
    return {
      type,
      checked: value === 'true',
      indeterminate: value === '',
      onChange: (e: Event) => raw$.set(getInputValue(e)),
    };
  }

  return {
    type,
    value,
    onInput: (e: Event) => raw$.set(getInputValue(e)),
  };
};
