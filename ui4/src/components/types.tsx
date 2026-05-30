import type { JSX } from 'preact';

export type GetProps<T> = Omit<T, 'style'> & { style?: any };

export type ElProps = {
  [K in keyof JSX.IntrinsicElements]: GetProps<JSX.IntrinsicElements[K]>;
};

export type DivProps = ElProps['div'];
