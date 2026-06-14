import { stopEvent } from '@fluxio/core/html/stopEvent';
import { type ElProps } from './types';

type _FormProps = ElProps['form'];

export interface FormProps extends _FormProps { }

export const Form = ({ children, title, onSubmit, ...props }: FormProps) => (
  <form
    {...props}
    onSubmit={(e) => {
      stopEvent(e);
      if (onSubmit) onSubmit(e);
    }}
  >
    {title && <div>{title}</div>}
    {children}
  </form>
);
