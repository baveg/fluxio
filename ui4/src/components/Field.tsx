import { cls } from '@fluxio/core/html/cls';
import { useState } from 'preact/hooks';
import { ChevronDownIcon, EyeIcon, EyeOffIcon } from 'lucide-preact';
import { useMemo, useEffect } from 'preact/hooks';
import { openModal } from './Modal';
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
  | 'color';

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

  useEffect(() => raw$.debounce(delay).on((raw) => v$.set(rawToValue(raw, type))), [raw$, v$]);

  const value = useFlux(raw$);

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
  autoComplete?: string;
}

interface FieldInputProps extends InputProps {
  class?: string;
  label?: string;
  delay?: number;
}

const PasswordInput = (props: ElProps['input']) => {
  const [showPassword, setShowPassword] = useState(false);
  const Icon = showPassword ? EyeOffIcon : EyeIcon;
  return (
    <>
      <button
        type="button"
        class="h-4 opacity-50 hover:opacity-100 cursor-pointer"
        onClick={() => setShowPassword((v) => !v)}
      >
        <Icon class="h-4" />
      </button>
      <input class="grow" {...props} type={showPassword ? 'text' : 'password'} />
    </>
  );
};

const SelectContent = ({
  value,
  items,
  onPick,
}: {
  value: any;
  items?: [any, Comp][];
  onPick: (value: any) => void;
}) => {
  return (
    <ul class="menu absolute left-0 right-0 top-full mt-1 z-40 bg-white border border-grey-300 rounded-md shadow-lg max-h-72 overflow-auto py-1">
      {items?.map(([v, lbl]) => (
        <li>
          <button
            type="button"
            class={cls(
              'flex items-center gap-2',
              'w-full text-left px-4 py-2 text-blue-950 transition-colors hover:bg-secondary-300',
              v === value && 'active bg-secondary-300 font-semibold')}
            onClick={() => onPick(v)}
          >
            {comp(lbl)}
          </button>
        </li>
      ))}
    </ul>
  );
};

const SelectInput = ({
  error,
  icon,
  prefix,
  suffix,
  placeholder,
  items,
  value,
  onValue,
  onOpen,
}: InputProps) => {
  const item = items?.find(([v]) => v === value) || [null, ''];
  const [isOpen, setIsOpen] = useState(false);

  const handle = () => {
    setIsOpen(true);
    if (onOpen) {
      onOpen();
      return;
    }
    openModal(placeholder || 'Sélectionner', ({ onClose }: { onClose: () => void }) => (
      <SelectContent
        value={value}
        items={items}
        onPick={(v) => {
          console.debug('onPick', v);
          onValue?.(v);
          onClose();
        }}
      />
    ), {
      onClose: () => setIsOpen(false),
    });
  };

  return (
    <button
      type="button"
      class={cls(
        'input input-bordered flex items-center justify-between gap-2 cursor-pointer text-left w-full',
        error && 'input-error'
      )}
      onClick={handle}
    >
      {icon && comp(icon, { class: "h-4 opacity-50" })}
      {prefix && <span class="h-4 opacity-50">{comp(prefix)}</span>}
      <span class="grow">{item[1] || <span class="opacity-50">{placeholder}</span>}</span>
      {suffix && <span class="opacity-50">{comp(suffix)}</span>}
      <ChevronDownIcon class={cls(
        'w-5 h-5 opacity-50 shrink-0 text-grey-500 transition-transform',
        isOpen ? 'rotate-180' : ''
      )} />
    </button>
  );
};

const CheckboxInput = ({ error, icon, prefix, suffix, type, value, ...iProps }: InputProps) => {
  return (
    <label class={cls('cursor-pointer label', error && 'input-error')}>
      {icon && comp(icon, { class: "h-4 opacity-50" })}
      {prefix && <span class="h-4 opacity-50">{comp(prefix)}</span>}
      <input type="checkbox" class="checkbox checkbox-info" checked={!!value} {...iProps} />
      {suffix && <span class="opacity-50">{comp(suffix)}</span>}
    </label>
  );
};

const TextInput = ({ error, icon, prefix, suffix, type, ...iProps }: InputProps) => {
  return (
    <label class={cls('input input-bordered flex items-center gap-2', error && 'input-error')}>
      {icon && comp(icon, { class: "h-4 opacity-50" })}
      {prefix && <span class="h-4 opacity-50">{comp(prefix)}</span>}
      {type === 'password' ?
        <PasswordInput {...iProps} />
        : type === 'multiline' ?
          <textarea class="textarea textarea-ghost" {...iProps} />
          : <input class="grow" type={type || 'text'} {...iProps} />}
      {suffix && <span class="opacity-50">{comp(suffix)}</span>}
    </label>
  );
};

const FieldInput = (props: FieldInputProps) => {
  const { label, class: className, onValue, delay = 400, value: propValue, ...inputProps } = props;
  const { type, error } = inputProps;

  // Pas de delay pour les checkboxes et select (interactions instantanées)
  const effectiveDelay = type === 'checkbox' || type === 'select' ? 0 : delay;

  // Si on a un delay, on gère un état local pour la saisie
  const [localValue, setLocalValue] = useState(propValue);

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
    <label class={cls('form-control w-full', className)}>
      {label && (
        <div class="label">
          <span class="label-text">{label}</span>
        </div>
      )}
      {type === 'select' ?
        <SelectInput {...inputProps} onValue={onValue} />
        : type === 'checkbox' ?
          <CheckboxInput {...inputProps} />
          : <TextInput type={type} {...inputProps} />}
      {error && (
        <div class="label">
          <span class="label-text-alt text-error">{error}</span>
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
