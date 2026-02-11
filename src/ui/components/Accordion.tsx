import { Css } from '../../html/css';
import { comp, Comp } from '../utils/comp';
import { useState } from 'preact/hooks';
import { DivProps } from './types';

const c = Css('Accordion', {
  '': {
    h: 200,
    w: 200,
    wh: 100,
    col: ['stretch', 'around'],
  },
  // '-open': {
  // },
  // '-close': {
  // },
});

export interface AccordionProps extends DivProps {
  headerProps?: DivProps;
  contentProps?: DivProps;
  header: Comp;
  children: Comp;
}

export const Accordion = ({
  header,
  children,
  headerProps,
  contentProps,
  ...props
}: AccordionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handle = () => setIsOpen((prev) => !prev);

  return (
    <div {...props} {...c('', isOpen ? '-open' : '-close', props)}>
      <div {...headerProps} {...c('Header', headerProps)} onClick={handle}>
        {comp(header)}
      </div>
      {isOpen && (
        <div {...contentProps} {...c('Content', contentProps)}>
          {comp(children)}
        </div>
      )}
    </div>
  );
};
