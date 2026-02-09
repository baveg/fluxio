import { useTr } from '../hooks/useTr';
import { isString } from '../../check/isString';

export interface TrProps {
  ns?: string;
  key?: string;
  children?: any;
}

export const Tr = ({ ns, key, children }: TrProps) => {
  const tr = useTr(ns || 'default');
  return (
    key ? tr(key)
    : isString(children) ? tr(children)
    : children
  );
};
