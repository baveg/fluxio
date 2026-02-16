import { Css } from '../../html/css';
import { comp, Comp } from '../utils/comp';
import { useState } from 'preact/hooks';
import { DivProps } from './types';

const c = Css('Carousel', {
  '': {
    h: 500,
    w: 200,
  },
});

export interface CarouselProps {
  title: Comp;
  children: Comp[];
}

export const Carousel = ({ children }: CarouselProps) => {
  const [index, setIndex] = useState(0);

  const length = children.length;

  const next = () => {
    setIndex((prev) => (prev + 1) % length);
  };

  const prev = () => {
    setIndex((prev) => (prev === 0 ? length - 1 : prev - 1));
  };
  return (
    <div class="carousel">
      <div
        class="carousel-track"
        style={{
          transform: `translateX(-${index * 100}%)`,
          transition: 'transform 0.4s ease',
        }}
      >
        {children}
      </div>

      <button onClick={prev}>Prev</button>
      <button onClick={next}>Next</button>
    </div>
  );
};
