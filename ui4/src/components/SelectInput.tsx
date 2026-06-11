import { cls } from '@fluxio/core/html/cls';
import { useState, useRef, useEffect } from 'preact/hooks';
import { ChevronDownIcon, XIcon } from 'lucide-preact';
import { openPortal } from './Portal';
import { comp, type Comp } from '../utils/comp';
import { Button } from './Button';
import { onClickOutside, onInterval } from '@fluxio/core/html/onEvent';
import { getElBounds } from '@fluxio/core/html/getElBounds';
import { logger } from '@fluxio/core/logger';
import { stopEvent } from '@fluxio/core/html/stopEvent';
import { VECTOR4_ZERO } from '@fluxio/core/number/vector';

const log = logger('SelectInput');

interface SelectInputProps {
  error?: string;
  icon?: Comp;
  prefix?: Comp;
  suffix?: Comp;
  placeholder?: string;
  items?: [any, Comp][];
  value?: any;
  onValue?: (value: any, e?: Event) => void;
  onOpen?: () => void;
}

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
    <div>
      {items?.map(([v, lbl]) => (
        <div class="relative">
          <Button
            class={cls('SelectBtn', v === value && 'SelectBtn-active')}
            onClick={(e) => {
              log.d('SelectBtn clicked', { value: v, isActive: v === value });
              stopEvent(e);
              onPick(v);
            }}
          >
            {comp(lbl)}
          </Button>
          {v === value && (
            <Button
              class="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-red-100 transition-colors"
              ghost
              circle
              onClick={(e) => {
                log.d('Clear button (X) clicked', { currentValue: value });
                stopEvent(e);
                onPick(null);
              }}
              icon={XIcon}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export const SelectInput = ({
  error,
  icon,
  prefix,
  suffix,
  placeholder,
  items,
  value,
  onValue,
  onOpen,
}: SelectInputProps) => {
  const item = items?.find(([v]) => v === value) || [null, ''];
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);

  // Ref pour garder les valeurs à jour sans recréer le portal
  const propsRef = useRef({ value, items, onValue });
  const props = propsRef.current;
  props.value = value;
  props.items = items;
  props.onValue = onValue;

  useEffect(() => {
    if (!isOpen || !ref.current) return;

    const buttonEl = ref.current;

    log.d('Opening portal');

    const handlePick = (v: any) => {
      log.d('handlePick', { value: v });
      props.onValue?.(v);
      setIsOpen(false);
    };

    const getStyle = () => {
      const [left, bottom, width] = getElBounds(buttonEl) || VECTOR4_ZERO;
      return {
        top: `${bottom + 4}px`,
        left: `${left}px`,
        width: `${width}px`,
      }
    }

    const { onClose: closePortal, el: portalEl } = openPortal(
      () => (
        <div
          class="select-dropdown-portal fixed z-50 bg-base-100 border border-base-300 rounded-lg shadow-lg p-2 max-h-80 overflow-auto"
          onMouseDown={(e) => {
            log.d('dropdown mousedown - stopping propagation');
            stopEvent(e);
          }}
          style={getStyle()}
        >
          <SelectContent
            value={props.value}
            items={props.items}
            onPick={handlePick}
          />
        </div>
      )
    );

    // Fonction pour mettre à jour la position du portal
    const updatePosition = () => {
      console.debug('updatePosition');
      const div = portalEl.firstElementChild;
      if (div instanceof HTMLElement) {
        Object.assign(div.style, getStyle())
      }
    };

    // Timer pour rafraîchir la position
    const u1 = onInterval(updatePosition, 100);

    // Gestion du clic en dehors
    const u2 = onClickOutside(portalEl, () => {
      log.d('Click outside detected');
      setIsOpen(false);
    });

    return () => {
      u1();
      u2();
      closePortal();
    };
  }, [isOpen]);

  return (
    <button
      ref={ref}
      type="button"
      class={cls(
        'input input-bordered flex items-center justify-between gap-2 cursor-pointer text-left w-full',
        error && 'input-error'
      )}
      onClick={() => {
        setIsOpen(true);
        onOpen?.();
      }}
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
