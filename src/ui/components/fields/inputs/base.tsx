import { useState } from 'preact/hooks';
import { useInputProps } from '../hooks';
import { FieldProps } from '../types';
import { Button } from '../../Button';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { toNumber } from '../../../../cast/toNumber';
import { toString } from '../../../../cast/toString';
import { formatTime, parseTime, SECOND } from '../../../../date/date';
import { isNumber } from '../../../../check/isNumber';
import { DivProps } from '../../types';
import { Css } from 'fluxio/html';

export const c = Css('FieldInput', {
  Right: {
    position: 'absolute',
    t: 0,
    r: 0,
    h: '100%',
    row: ['center', 'center'],
  },
});

export const FieldRight = (props: DivProps) => {
  return (<div {...props} {...c('Right')}></div>)
}

const inputFactory = (type: string) => () => {
  const props = useInputProps();
  return <input {...props} type={type} />;
};

const getStringInput = (type: string): FieldProps<string, string> => ({
  input: inputFactory(type),
});

const getNumberInput = (type: string): FieldProps<number, string> => ({
  input: inputFactory(type),
});

const email = getStringInput('email');
const text = getStringInput('text');
const number = getNumberInput('text');
const date = getStringInput('date');

number.toRaw = toString;
number.toValue = toNumber;

const password: FieldProps<string, string> = {
  input: () => {
    const [show, setShow] = useState(false);
    const props = useInputProps();
    return (
      <>
        <input {...props} type={show ? 'text' : 'password'} />
        <FieldRight>
          <Button
            onClick={(e) => {
              e.preventDefault();
              setShow((s) => !s);
            }}
            icon={show ? <EyeOffIcon /> : <EyeIcon />}
          />
        </FieldRight>
      </>
    );
  },
};

const time: FieldProps<number, string> = {
  input: () => {
    const props = useInputProps();
    return <input {...props} type="text" placeholder={props.placeholder || '00:00'} />;
  },
  toValue: parseTime,
  toRaw: formatTime,
};

const seconds: FieldProps<number, string> = {
  input: () => {
    const props = useInputProps();
    return <input {...props} type="text" placeholder={props.placeholder || '00:00:00'} />;
  },
  toValue: (r: any) => (isNumber((r = parseTime(r))) ? r / SECOND : 0),
  toRaw: (v) => formatTime(v ? v * SECOND : 0),
};

export const baseInputs = {
  text,
  email,
  password,
  number,
  date,
  datetime: date,
  time,
  seconds,
};
