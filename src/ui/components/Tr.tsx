import { useTr } from '../hooks/useTr';
import { isString } from '../../check/isString';

export interface TrProps {
  ns?: string;
  key?: string;
  children?: any;
}

export const Tr = ({ ns, children }: TrProps) => {
  const tr = useTr(ns || 'default');
  return isString(children) ? tr(children) : children;
};
