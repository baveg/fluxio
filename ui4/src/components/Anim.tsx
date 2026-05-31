import { cls } from '@fluxio/core/html/cls';
import type { ComponentChildren, JSX } from 'preact';
import { useAnimState, type AnimState } from '../hooks/useAnimState';

type AnimVariant = 'fade' | 'scale' | 'slide';

type StateClasses = { entering: string; entered: string; exiting: string };

const variants: Record<AnimVariant, StateClasses> = {
  fade: {
    entering: 'opacity-0',
    entered: 'opacity-100',
    exiting: 'opacity-0',
  },
  scale: {
    entering: 'opacity-0 scale-[0.8]',
    entered: 'opacity-100 scale-100',
    exiting: 'opacity-0 scale-[0.8]',
  },
  slide: {
    entering: 'opacity-0 -translate-x-full',
    entered: 'opacity-100 translate-x-0',
    exiting: 'opacity-0 translate-x-full',
  },
};

export interface AnimProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'children'> {
  show: boolean;
  variant?: AnimVariant;
  keepMounted?: boolean;
  factory?: (state: AnimState) => ComponentChildren;
  children?: ComponentChildren;
}

export const Anim = ({
  show,
  variant = 'fade',
  keepMounted,
  factory,
  children,
  class: className,
  ...props
}: AnimProps) => {
  const state = useAnimState(show, 400);

  if (!keepMounted && state === 'unmounted') return null;

  const stateClass =
    state === 'entered' || state === 'exiting' ?
      variants[variant][state]
    : variants[variant].entering;

  return (
    <div {...props} class={cls('transition-all duration-300', stateClass, className)}>
      {factory?.(state)}
      {children}
    </div>
  );
};
