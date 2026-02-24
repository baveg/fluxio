import { Css } from '../../html/css';
import { comp, Comp } from '../utils/comp';
import { useState } from 'preact/hooks';
import { DivProps } from './types';
import { ChevronDownIcon } from '@/components/icons';

const c = Css('Accordion', {
  '': {
    col: ['stretch', 'around'],
  },
  Header: {
    row: ['center', 'start'],
  },
  Chevron: {
    rotate: '-90deg',
    transition: 0.25,
  },
  '-open &Chevron': {
    rotate: 0,
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
        {isOpen ? <ChevronDownIcon {...c('Chevron')} /> : <ChevronDownIcon {...c('Chevron')} />}
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
