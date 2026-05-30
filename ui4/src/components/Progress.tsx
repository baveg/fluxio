import { Css } from '@fluxio/core/html/css';
import type { DivProps } from './types';
import { clamp } from '@fluxio/core/number/clamp';
import { round } from '@fluxio/core/number/round';
import { toNumber } from '@fluxio/core/cast/toNumber';

import type { ComponentChildren } from 'preact';

const c = Css('Progress', {
  '': {
    center: 1,
    position: 'relative',
    bg: 'bg',
    border: 'primary',
    rounded: 3,
    w: '100%',
    overflow: 'hidden',
    h: 14,
  },
  Bar: {
    position: 'absolute',
    xy: 0,
    wh: '100%',
    bg: 'primary',
    overflow: 'hidden',
    transition: 0.5,
  },
  Text: {
    center: 1,
    position: 'absolute',
    xy: 0,
    wh: '100%',
    fg: 'fg',
    zIndex: 1,
    fontSize: '80%',
  },
  'Text-in': {
    fg: 'handle',
    transition: 0.5,
  },
});

export interface ProgressProps extends DivProps {
  step?: ComponentChildren;
  progress?: number | null;
}
export const Progress = ({ progress, step, children, ...props }: ProgressProps) => {
  const prct = clamp(toNumber(progress, 0), 0, 100);
  const text = step ? `${step} ${round(prct)}%` : `${round(prct)}%`;
  return (
    <div {...props} {...c('', props)}>
      <div {...c('Text')}>{text}</div>
      <div {...c('Bar')} style={{ left: prct - 100 + '%' }}>
        <div {...c('Text', 'Text-in')} style={{ left: -(prct - 100) + '%' }}>
          {text}
        </div>
      </div>
      {children}
    </div>
  );
};
