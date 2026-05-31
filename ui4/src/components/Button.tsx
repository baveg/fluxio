import type { LucideIcon } from 'lucide-preact';
import { cls } from '@fluxio/core/html/cls';
import { tooltipProps } from './Tooltip';
import { type Comp } from '../utils/comp';

export interface ButtonProps {
  icon?: LucideIcon;
  primary?: boolean;
  secondary?: boolean;
  selected?: boolean;
  error?: boolean;
  warn?: boolean;
  success?: boolean;
  circle?: boolean;
  outline?: boolean;
  sm?: boolean;
  xs?: boolean;
  ghost?: boolean;
  square?: boolean;
  submit?: boolean;
  class?: string;
  title?: string;
  tooltip?: Comp;
  onClick?: (e: Event) => void;
  children?: any;
}

export const Button = ({
  icon: Icon,
  circle,
  outline,
  primary,
  secondary,
  selected,
  error,
  warn,
  success,
  sm,
  xs,
  ghost,
  submit,
  square,
  class: extraCls,
  title,
  tooltip,
  onClick,
  children,
}: ButtonProps) => (
  <button
    type={submit ? 'submit' : 'button'}
    class={cls(
      'btn',
      circle && 'btn-circle',
      outline && 'btn-outline',
      primary && 'btn-primary',
      secondary && 'btn-secondary',
      selected && 'btn-selected',
      error && 'btn-error',
      warn && 'btn-warn',
      success && 'btn-success',
      sm && 'btn-sm',
      xs && 'btn-xs',
      ghost && 'btn-ghost',
      ((Icon && !(title || children)) || square) && 'btn-square',
      extraCls
    )}
    {...tooltipProps(tooltip)}
    onClick={onClick}
  >
    {Icon && <Icon size={xs ? 14 : 24} />}
    {title}
    {children}
  </button>
);
