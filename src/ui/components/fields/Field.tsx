import { DivProps } from '../types';
import { Tr } from '../Tr';
import { FieldProps } from './types';
import { FieldController, FieldProvider } from './FieldController';
import { FIELD_HEIGHT, LABEL_WIDTH } from './constants';
import { Button } from '../Button';
import { XIcon } from 'lucide-react';
import { useFieldController, useFieldState } from './hooks';
import { useConstant } from '../../hooks/useConstant';
import { tooltipProps } from '../Tooltip';
import { Css } from '../../../html/css';
import { isDefined } from '../../../check/isDefined';
import { isNotEmpty } from '../../../check/isEmpty';
import { comp } from '../../utils/comp';

export const c = Css('Field', {
  '': {
    col: ['stretch', 'start'],
    // w: '100%',
    hMin: 30,
    m: 2,
  },
  Group: {
    row: ['center', 'between'],
  },
  '-error &Label': {
    fg: 'error',
  },
  '-error input': {
    border: 'error',
  },
  Error: {
    fg: 'error',
  },
  Label: {
    textAlign: 'left',
    fg: 'fg',
    w: '100%',
  },
  '-row': {
    row: 'center',
  },
  '-row .FieldLabel': {
    w: LABEL_WIDTH,
  },
  Content: {
    w: '100%',
    row: ['center', 'around'],
    flex: 2,
    hMin: 16,
    position: 'relative',
  },
  'Content > .Field:not(:first-child)': {
    ml: 4,
  },
  Clear: {
    m: 0,
    ml: 2,
  },
  ' input,& textarea': {
    w: '100%',
    hMin: FIELD_HEIGHT,
    py: 8,
    px: 8,
    border: 'border',
    rounded: 5,
    outline: 'none',
    bg: 'bg',
    fg: 'fg',
    fontSize: '100%',
    fontFamily: 'inherit',
  },
  ' input:hover,& textarea:hover': {
    // borderColor: 'border',
    borderColor: 'primary',
    elevation: 5,
  },
  Row: {
    row: ['center', 'between'],
    w: '100%',
  },
  'Row .Field': {
    flex: 1,
  },
  Col: {
    col: ['stretch', 'start'],
    w: '100%',
  },
  Left: {
    position: 'absolute',
    t: 0,
    l: 0,
    h: '100%',
    row: ['center', 'center'],
    pl: 8,
  },
  Right: {
    position: 'absolute',
    t: 0,
    r: 0,
    h: '100%',
    row: ['center', 'center'],
    pr: 8,
  },
  '-hasLeft input,&-hasLeft textarea': {
    pl: 32,
  },
  '-hasRight input,&-hasRight textarea': {
    pr: 32,
  },
});

const ClearButton = () => {
  const ctrl = useFieldController();
  const { config, value } = useFieldState(ctrl, 'config', 'value');

  const { clearable, readonly } = config;
  const showClear = clearable && isDefined(value) && !readonly;
  return showClear ?
      <Button
        {...c('Clear')}
        icon={<XIcon size={16} />}
        onClick={() => ctrl.update({ value: undefined })}
        tooltip="Effacer la valeur"
      />
    : null;
};

// export const Field = <V = any, R = any>(props: FieldProps<V, R>) => {
export const Field = <V, R>(props: FieldProps<V, R>) => {
  const ctrl = useConstant(() => new FieldController<V, R>());
  ctrl.setProps(props);

  const { config, error, right, left } = useFieldState(ctrl, 'config', 'error', 'right', 'left');

  const { input: Input, children, label, helper, row, type, tooltip, containerProps } = config;

  const isComposed = isNotEmpty(children);

  return (
    <FieldProvider value={ctrl}>
      <div
        {...containerProps}
        {...c('', row && '-row', type && `-${type}`, error && '-error', !!left && '-hasLeft', !!right && '-hasRight', containerProps)}
      >
        {label && (
          <div {...c('Label')} {...tooltipProps(tooltip)}>
            {label}
          </div>
        )}
        <div {...c('Content')}>
          {isComposed ?
            children
          : Input ?
            <Input />
          : null}
          {left && <div {...c('Left')}>{comp(left)}</div>}
          {right && <div {...c('Right')}>{comp(right)}</div>}
          <ClearButton />
        </div>
        {error ?
          <div {...c('Error')}>
            <Tr ns="error" key={error} />
          </div>
        : helper ?
          <div {...c('Helper')}>{helper}</div>
        : null}
      </div>
    </FieldProvider>
  );
};

export const FieldRow = (props: DivProps) => <div {...props} {...c('Row', props)} />;

export const FieldCol = (props: DivProps) => <div {...props} {...c('Col', props)} />;

export const FieldGroup = (props: DivProps) => <div {...props} {...c('Group', props)} />;
