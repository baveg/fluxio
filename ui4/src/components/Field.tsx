import { cls } from '@fluxio/core/html/cls';
import { useState } from 'preact/hooks';
import { EyeIcon, EyeOffIcon } from 'lucide-preact';
import { useMemo, useEffect } from 'preact/hooks';
import { jsonParse, jsonStringify } from '@fluxio/core/string/json';
import { toFloat, toInt } from '@fluxio/core/cast/toNumber';
import { toString } from '@fluxio/core/cast/toString';
import { toBoolean } from '@fluxio/core/cast/toBoolean';
import { flux, type Flux } from '@fluxio/core/flux/Flux';
import { useFlux } from '../hooks/useFlux';
import { comp, type Comp } from '../utils/comp';
import { type ElProps } from './types';
import { debounce } from '@fluxio/core/async/debounce';
import { toVoid } from '@fluxio/core/cast/toVoid';
import { getInputValue } from '@fluxio/core/html/getInputValue';
import { SelectInput } from './SelectInput';
import { stopEvent } from '@fluxio/core/html';
import { logger } from '@fluxio/core/logger';
import { useConstant } from '../hooks';
import { defer } from '@fluxio/core/async';
import { isNil } from '@fluxio/core/check';
import './Field.css';

const log = logger('Field');

export type InputType =
  | 'select'
  | 'text'
  | 'multiline'
  | 'password'
  | 'email'
  | 'int'
  | 'float'
  | 'json'
  | 'checkbox'
  | 'color'
  | 'date'
  | 'datetime'
  | 'time'
  | 'month'
  | 'week';

export interface FluxInputOptions<T extends InputType | undefined = undefined> {
  delay?: number;
  type?: T;
}

const valueToRaw = (value: any, type: InputType): string =>
  type === 'json' ? jsonStringify(value) : toString(value);

const rawToValue = (raw: string, type: InputType): any =>
  type === 'int' ? toInt(raw)
    : type === 'float' ? toFloat(raw)
      : type === 'checkbox' ?
        raw === '' ?
          null
          : toBoolean(raw)
        : type === 'json' ? jsonParse(raw)
          : raw;

const useFluxInput = (type: InputType, v$: Flux<any>, delay = 200) => {
  const raw$ = useMemo(() => flux(valueToRaw(v$.get(), type)), [v$]);

  const last = useConstant(() => [null] as [any]);

  useEffect(() => {
    raw$.set(valueToRaw(v$.get(), type));
    return v$.on((value) => {
      if (value === last[0]) return;
      raw$.set(valueToRaw(value, type))
    });
  }, [v$, raw$, type]);

  useEffect(() => raw$.debounce(delay).on((raw) => {
    v$.set(last[0] = rawToValue(raw, type));
  }), [raw$, v$]);

  const value = useFlux(raw$);
  log.d('render', name, type, value);

  const onValue = (value: any) => raw$.set(value);

  if (type === 'checkbox') {
    return {
      type,
      checked: value === 'true',
      indeterminate: value === '',
      onValue,
    };
  }

  return {
    type,
    value,
    onValue,
  };
};

interface InputProps {
  type?: InputType;
  placeholder?: string;
  items?: [any, Comp][];
  error?: string;
  icon?: Comp;
  prefix?: Comp;
  suffix?: Comp;
  onChange?: (e: Event) => void;
  onInput?: (e: Event) => void;
  onValue?: (value: any, e?: Event) => void;
  onOpen?: () => void;
  value?: any;
  name?: string;
  readonly?: boolean;
  required?: boolean;
  autoComplete?: string;
}

interface FieldInputProps extends InputProps {
  class?: string;
  label?: string;
  help?: string;
  delay?: number;
}

const PasswordInput = (props: ElProps['input']) => {
  const [showPassword, setShowPassword] = useState(false);
  const Icon = showPassword ? EyeOffIcon : EyeIcon;
  return (
    <>
      <button
        type="button"
        class="PasswordToggleBtn"
        onClick={(e) => {
          stopEvent(e);
          setShowPassword((v) => !v);
        }}
      >
        <Icon class="PasswordToggleIcon" />
      </button>
      <input class="PasswordInput" {...props} type={showPassword ? 'text' : 'password'} />
    </>
  );
};

interface CheckboxInputProps extends InputProps {
  onValue?: (value: any, e?: Event) => void;
}

const CheckboxInput = ({ error, icon, prefix, suffix, type, value, onChange, onInput, onValue, ...iProps }: CheckboxInputProps) => {
  log.d('CheckboxInput render', { value, iProps });
  const handleClick = (e: Event) => {
    stopEvent(e);
    defer(() => {
      const el = e.target as HTMLInputElement;
      const prev = el.checked;
      const next = !prev;
      console.debug('CheckboxInput handleClick', prev, next, el, e);
      el.checked = next;
      el.indeterminate = false;
      if (onValue) onValue(next, e);
    });
  };

  console.debug('CheckboxInput render', value); // {...iProps}

  return (
    <label class={cls('CheckboxLabel', error && 'input-error')}>
      {icon && comp(icon, { class: 'CheckboxIcon' })}
      {prefix && <span class="CheckboxPrefix">{comp(prefix)}</span>}
      <input
        type="checkbox"
        class="CheckboxInput"
        checked={toBoolean(value)}
        indeterminate={isNil(value)}
        onClick={handleClick}
      />
      {suffix && <span class="CheckboxSuffix">{comp(suffix)}</span>}
    </label>
  );
};

// const hasPickerList = ['date', 'datetime', 'time', 'month', 'week'];
// const hasPickerMap = by(hasPickerList, toMe, toTrue);
// const hasPicker = (type?: string) => (type && hasPickerMap[type]) || false;

const handleLabelClick = (e: MouseEvent) => {
  console.debug('handleLabelClick', e);
  const input = (e.currentTarget as HTMLLabelElement).querySelector('input');
  if (!input) return;
  if (!input.showPicker) return;
  input.showPicker();
  stopEvent(e);
};

const TextInput = ({ error, icon, prefix, suffix, type, ...iProps }: InputProps) => {
  const inputType = type === 'datetime' ? 'datetime-local' : type || 'text';
  return (
    <label class={cls('FieldInput', error && 'input-error')} onClick={handleLabelClick}>
      {icon && comp(icon, { class: 'FieldIcon' })}
      {prefix && <span class="FieldPrefix">{comp(prefix)}</span>}
      {type === 'password' ?
        <PasswordInput {...iProps} />
        : type === 'multiline' ?
          <textarea class="FieldTextarea" {...iProps} />
          : <input class="FieldText" type={inputType} {...iProps} />}
      {suffix && <span class="FieldSuffix">{comp(suffix)}</span>}
    </label>
  );
};

const FieldInput = (props: FieldInputProps) => {
  const { label, help, class: className, onValue, delay = 400, value: propValue, required, ...inputProps } = props;
  const { type, error } = inputProps;

  // Pas de delay pour les checkboxes et select (interactions instantanées)
  const effectiveDelay = type === 'checkbox' || type === 'select' ? 0 : delay;

  // Si on a un delay, on gère un état local pour la saisie
  const [localValue, setLocalValue] = useState(propValue);

  log.d('FieldInput', props.name, props.value, localValue);

  // Synchroniser localValue avec propValue quand il change (mais pas pendant la saisie)
  useEffect(() => {
    setLocalValue(propValue);
  }, [propValue]);

  const debouncedOnValue = useMemo(
    () =>
      onValue && effectiveDelay > 0 ?
        debounce((value: any) => onValue(value), effectiveDelay)
        : onValue,
    [onValue, effectiveDelay]
  );

  // Utiliser localValue si on a un delay, sinon propValue
  const displayValue = onValue && effectiveDelay > 0 ? localValue : propValue;
  (inputProps as any).value = displayValue;

  if (debouncedOnValue) {
    const onChange = inputProps.onChange || toVoid;
    const onInput = inputProps.onInput || toVoid;

    inputProps.onChange = (e: Event) => {
      const newValue = getInputValue(e);
      if (effectiveDelay > 0) setLocalValue(newValue);
      onChange(e);
      debouncedOnValue(newValue);
    };
    inputProps.onInput = (e: Event) => {
      const newValue = getInputValue(e);
      if (effectiveDelay > 0) setLocalValue(newValue);
      onInput(e);
      debouncedOnValue(newValue);
    };
  }

  return (
    <label class={cls('FieldControl', `FieldControl-${type}`, className)}>
      {label && (
        <div class="FieldLabel">
          <span class="FieldLabelText">{label}{required ? ' *' : ''}</span>
        </div>
      )}
      {type === 'select' ?
        <SelectInput {...inputProps} onValue={onValue} />
        : type === 'checkbox' ?
          <CheckboxInput {...inputProps} onValue={onValue} />
          : <TextInput type={type} {...inputProps} />}
      {(error || help) && (
        <div class="FieldAlt">
          <span class={error ? 'FieldError' : 'FieldHelp'}>
            {error || help}
          </span>
        </div>
      )}
    </label>
  );
};

interface FieldFluxProps extends FieldInputProps {
  v$: Flux;
  delay?: number;
}

const FieldFlux = ({ v$, type, delay, ...rest }: FieldFluxProps) => {
  const inputProps = useFluxInput(type || 'text', v$, delay);
  log.d('FieldFlux', rest.name, type, inputProps);
  // Le delay est déjà géré par useFluxInput via flux.debounce()
  // On ne passe pas le delay à FieldInput pour éviter un double debounce
  return <FieldInput {...rest} {...inputProps} delay={0} />;
};

export interface FieldProps extends FieldInputProps {
  v$?: Flux;
  delay?: number;
}

export const Field = ({ v$, ...rest }: FieldProps) =>
  v$ ? <FieldFlux v$={v$} {...rest} /> : <FieldInput {...rest} />;
