import { useEffect, useState } from 'preact/hooks';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useFieldController, useFieldState, useInputProps } from '../hooks';
import { FieldProps } from '../types';
import { Button } from '../../Button';
import { toNumber } from '../../../../cast/toNumber';
import { toString } from '../../../../cast/toString';
import { formatTime, parseTime, SECOND } from '../../../../date/date';
import { isNumber } from '../../../../check/isNumber';

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

const PasswordEye = () => {
  const ctrl = useFieldController();
  const { show } = useFieldState(ctrl, 'show');
  
  return (
    <Button
      onClick={(e) => {
        e.preventDefault();
        ctrl.update((s) => ({ show: !s.show }));
      }}
      icon={show ? <EyeOffIcon /> : <EyeIcon />}
    />
  )
}

const password: FieldProps<string, string> = {
  input: () => {
    const ctrl = useFieldController();
    const props = useInputProps();
    const { show } = useFieldState(ctrl, 'show');

    useEffect(() => {
      ctrl.update({ right: PasswordEye });
    }, [ctrl]);

    return (<input {...props} type={show ? 'text' : 'password'} />);
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
