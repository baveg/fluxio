import type { DivProps } from './types';
import { clamp } from '@fluxio/core/number/clamp';
import { round } from '@fluxio/core/number/round';
import { toNumber } from '@fluxio/core/cast/toNumber';
import { cls } from '@fluxio/core/html/cls';
import './Progress.css';

import type { ComponentChildren } from 'preact';

export interface ProgressProps extends DivProps {
  step?: ComponentChildren;
  progress?: number | null;
}
export const Progress = ({ progress, step, children, ...props }: ProgressProps) => {
  const prct = clamp(toNumber(progress, 0), 0, 100);
  const text = step ? `${step} ${round(prct)}%` : `${round(prct)}%`;
  return (
    <div {...props} class={cls('Progress', props)}>
      <div class="ProgressText">{text}</div>
      <div class="ProgressBar" style={{ left: prct - 100 + '%' }}>
        <div class="ProgressText ProgressText-in" style={{ left: -(prct - 100) + '%' }}>
          {text}
        </div>
      </div>
      {children}
    </div>
  );
};
