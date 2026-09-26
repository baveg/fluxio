import { cls } from '@fluxio/core/html/cls';
import { useState, useRef, useEffect, useMemo } from 'preact/hooks';
import { ChevronDownIcon, XIcon, SearchIcon } from 'lucide-preact';
import { openPortal } from './Portal';
import { comp, type Comp } from '../utils/comp';
import { onInterval } from '@fluxio/core/async/onInterval';
import { getElBounds } from '@fluxio/core/html/getElBounds';
import { logger } from '@fluxio/core/logger';
import { stopEvent } from '@fluxio/core/html/stopEvent';
import { VECTOR4_ZERO } from '@fluxio/core/number/vector';
import { cleanSearch, isSearched } from '@fluxio/core/string/isSearched';
import './SelectInput.css';

// Un champ de recherche n'apparaît que si la liste est assez longue pour
// justifier de taper plutôt que de scroller.
const SEARCH_THRESHOLD = 8;

const log = logger('SelectInput');

interface SelectInputProps {
  error?: string | boolean;
  icon?: Comp;
  prefix?: Comp;
  suffix?: Comp;
  placeholder?: string;
  items?: [any, Comp][];
  value?: any;
  onValue?: (value: any, e?: Event) => void;
  onOpen?: () => void;
}

const SelectList = ({
  value,
  items,
  onPick,
}: {
  value: any;
  items?: [any, Comp][];
  onPick: (value: any) => void;
}) => {
  const [search, setSearch] = useState('');
  const hasSearch = (items?.length || 0) > SEARCH_THRESHOLD;
  const searchRef = useRef<HTMLInputElement>(null);

  const filteredItems = useMemo(() => {
    const searchLower = cleanSearch(search);
    if (!searchLower) return items;
    return items?.filter(([, lbl]) => typeof lbl !== 'string' || isSearched(lbl, searchLower));
  }, [items, search]);

  // Preact ne mappe pas la prop `autoFocus` (React-only) sur l'attribut DOM
  // `autofocus` : on doit focus le champ nous-mêmes à l'ouverture du menu.
  useEffect(() => {
    if (hasSearch) searchRef.current?.focus();
  }, [hasSearch]);

  return (
    <div class="SelectList">
      {hasSearch && (
        <div class="SelectSearch">
          <SearchIcon class="SelectSearchIcon" />
          <input
            ref={searchRef}
            class="SelectSearchInput"
            type="text"
            placeholder="Rechercher..."
            value={search}
            onClick={stopEvent}
            onInput={(e) => setSearch((e.target as HTMLInputElement).value)}
          />
        </div>
      )}
      {filteredItems?.map(([v, lbl]) => (
        <div class="SelectItem" key={v}>
          <button
            class={cls('SelectBtn', v === value && 'SelectBtn-active')}
            onClick={(e) => {
              log.d('SelectBtn clicked', { value: v, isActive: v === value });
              stopEvent(e);
              onPick(v);
            }}
          >
            {comp(lbl)}
          </button>
          {v === value && (
            <button
              class="SelectClear"
              onClick={(e) => {
                log.d('Clear button (X) clicked', { currentValue: value });
                stopEvent(e);
                onPick(null);
              }}
            >
              <XIcon />
            </button>
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

  log.d('render', value, item, items);

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
        // top: `${bottom + 4}px`,
        top: `${bottom - 1}px`,
        left: `${left}px`,
        width: `${width}px`,
      };
    };

    const { onClose: closePortal, el: portalEl } = openPortal(({ onClose }) => (
      <div
        class="SelectMask"
        onClick={(e) => {
          stopEvent(e);
          onClose();
          setIsOpen(false);
        }}
      >
        <div
          class="SelectBox"
          onMouseDown={(e) => {
            log.d('dropdown mousedown - stopping propagation');
            // Ne pas preventDefault sur l'input de recherche : ça bloquerait
            // le placement du curseur au clic.
            if ((e.target as HTMLElement)?.tagName === 'INPUT') {
              e.stopPropagation();
              return;
            }
            stopEvent(e);
          }}
          style={getStyle()}
        >
          <SelectList value={props.value} items={props.items} onPick={handlePick} />
        </div>
      </div>
    ));

    // Fonction pour mettre à jour la position du portal
    const updatePosition = () => {
      console.debug('updatePosition');
      const div = portalEl.firstElementChild?.firstElementChild;
      if (div instanceof HTMLElement) {
        Object.assign(div.style, getStyle());
      }
    };

    // Timer pour rafraîchir la position
    const u1 = onInterval(updatePosition, 500);

    return () => {
      u1();
      closePortal();
    };
  }, [isOpen]);

  return (
    <button
      ref={ref}
      type="button"
      class={cls('SelectInput', isOpen && 'SelectInput-open', error && 'input-error')}
      onClick={(e) => {
        stopEvent(e);
        setIsOpen(!isOpen);
        if (!isOpen) onOpen?.();
      }}
    >
      {icon && comp(icon, { class: 'SelectIcon' })}
      {prefix && <span class="SelectPrefix">{comp(prefix)}</span>}
      <span class="grow">{item[1] || <span class="SelectPlaceholder">{placeholder}</span>}</span>
      {suffix && <span class="SelectSuffix">{comp(suffix)}</span>}
      <ChevronDownIcon class={cls('SelectChevron', isOpen && 'SelectChevron-open')} />
    </button>
  );
};
