import { Css } from '../../html/css';
import { JSX } from 'preact';

const c = Css('Iframe', {
  '': {
    border: '1px solid red',
  },
});

export interface IframeProps extends JSX.HTMLAttributes<HTMLIFrameElement> {
  class?: string;
}

export const Iframe = ({ className, ...props }: IframeProps) => {
  return <iframe {...props} {...c('', props)} />;
};
