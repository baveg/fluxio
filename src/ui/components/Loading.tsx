import { Css } from '../../html/css';
import { DivProps } from './types';
import { Tr } from './Tr';
import { useTr } from '../hooks/useTr';

const c = Css('Loading', {
  '': {
    w: '100%',
    h: '100%',
    center: 1,
  },
  Content: {
    ml: 4,
  },

  Spinner: {
    center: 1,
    whMin: 50,
  },
  SpinnerCircle: {
    w: 50,
    h: 50,
    bg: 'bg',
    rounded: 999,
    center: 1,
  },
  SpinnerIcon: {
    w: 35,
    h: 35,
    border: 5,
    borderColor: 'primary',
    borderTop: 'transparent',
    borderBottom: 'transparent',
    rounded: 999,
    anim: {
      name: 'spin',
      duration: '1s',
      timing: 'linear',
      count: 'infinite',
      keyframes: {
        '0%': { rotate: 0 },
        '100%': { rotate: 360 },
      },
    },
  },
});

export const LoadingSpinner = (props: DivProps) => (
  <div {...props} {...c('Spinner', props)}>
    <div {...props} {...c('SpinnerCircle', props)}>
      <div {...c('SpinnerIcon')} />
    </div>
  </div>
);

export const Loading = ({ content, children, ...props }: DivProps & { content?: string }) => {
  const tr = useTr('loading');
  return (
    <div {...props} {...c('', props)}>
      <LoadingSpinner />
      {content !== '' && (
        <div {...c('Content')}>
          {tr(content || 'Chargement...')}
        </div>
      )}
      {children}
    </div>
  );
};
