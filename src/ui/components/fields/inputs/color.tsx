import { FieldProps } from '../types';
import { useInputProps } from '../hooks';
import { useState, useRef } from 'preact/hooks';
import { Field } from '../Field';
import { createWindow } from '../../Window';
import { Button } from '../../Button';
import { Css } from '../../../../html/css';
import { toHsl } from '../../../../color/toHsl';
import { toRgb } from '../../../../color/toRgb';
import { setHsl } from '../../../../color/setHsl';
import { round } from '../../../../number/round';
import { setRgb } from '../../../../color/setRgb';
import { isFloat } from '../../../../check/isNumber';
import { isLight } from '../../../../color/isLight';
import { toHexColor } from '../../../../color/toHexColor';
import { isHexColor } from '../../../../color/toHexColor';
import { toColor } from '../../../../color/toColor';

const c = Css('ColorPicker', {
  '': {
    col: 1,
  },
  Variations: {
    row: 1,
    gap: 5,
  },
  Color: {
    wh: 30,
    m: 2,
    rounded: 5,
    cursor: 'pointer',
    border: '2px solid transparent',
  },
  'Color:hover': {
    borderColor: 'border',
  },
  ' .FieldLabel': {
    w: 74,
  },
});

const ColorInput = () => <input type="color" {...useInputProps()} />;

interface ColorPickerProps {
  value?: string;
  onChange?: (color: string) => void;
}

const ColorPickerContent = ({ value, onChange }: ColorPickerProps) => {
  const [color, setColor] = useState<string | undefined>(value || '#697689');
  const hsl = toHsl(color);
  const rgb = toRgb(color);
  const hex = toHexColor(color);

  // const p = theme.primary || '#28A8D9';
  // const s = theme.secondary || addHsl(p, { h: 360 / 3 });

  const ls = [10, 20, 40, 60, 80, 90];

  const variations = [
    // [p, s, ...[0, 50, 100].map((l) => setHsl(color, { l })), undefined],
    ['#e20000ff', '#ffa600ff', '#fffb00ff', '#07db00ff', '#0063f7ff', '#a300e4ff'],
    ls.map((l) => setHsl(color, { l })),
  ];

  const updateColor = (col: string | undefined) => {
    setColor(col);
    if (col && onChange) onChange(col);
  };

  return (
    <div {...c('')}>
      <Field input={ColorInput} label="Couleur" value={color} onValue={updateColor} />

      {variations.map((v, i) => (
        <div key={i} {...c('Variations')}>
          {v.map((col) => (
            <div
              key={col}
              {...c('Color')}
              style={{ backgroundColor: col }}
              onClick={() => updateColor(col)}
            />
          ))}
        </div>
      ))}
      <Field label="HSL">
        <Field
          type="number"
          value={round(hsl.h)}
          onValue={(h) => updateColor(setHsl(color, { h }))}
          min={0}
          max={360}
        />

        <Field
          type="number"
          value={round(hsl.s)}
          onValue={(s) => updateColor(setHsl(color, { s }))}
          min={0}
          max={100}
        />

        <Field
          type="number"
          value={round(hsl.l)}
          onValue={(l) => updateColor(setHsl(color, { l }))}
          min={0}
          max={100}
        />
      </Field>
      <Field label="RGB">
        <Field
          type="number"
          value={rgb.r}
          onValue={(r) => updateColor(setRgb(color, { r }))}
          min={0}
          max={100}
        />
        <Field
          type="number"
          value={rgb.g}
          onValue={(g) => updateColor(setRgb(color, { g }))}
          min={0}
          max={100}
        />
        <Field
          type="number"
          value={rgb.b}
          onValue={(b) => updateColor(setRgb(color, { b }))}
          min={0}
          max={100}
        />
      </Field>
      <Field
        label="Alpha"
        type="number"
        value={rgb.a * 100}
        onValue={(a) => isFloat(a) && updateColor(setRgb(color, { a: a / 100 }))}
        min={0}
        max={100}
      />
      <Field
        label="HEX"
        type="text"
        value={hex}
        onValue={(next) => isHexColor(next) && updateColor(toColor(next))}
      />
    </div>
  );
};

const ColorButton = () => {
  const { value, onChange, ...props } = useInputProps();
  const ref = useRef<HTMLDivElement>(null);

  const openPicker = () => {
    if (!ref.current) return;
    createWindow({
      title: 'Couleur',
      content: () => <ColorPickerContent value={value} onChange={onChange} />,
      // pos: ref.current,
      size: [300, 320],
      resizable: false,
    });
  };

  const color = value || '#ccc';
  return (
    <div ref={ref} style={{ width: '100%' }}>
      <Button
        {...props}
        onClick={openPicker}
        title={value || 'Aucune'}
        style={{ width: '100%', backgroundColor: color, color: isLight(color) ? '#000' : '#fff' }}
      />
    </div>
  );
};

const color: FieldProps<string, string> = {
  input: ColorButton,
  clearable: true,
  delay: 0,
};

export const colorInputs = {
  color,
};
