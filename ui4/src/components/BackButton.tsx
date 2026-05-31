import { ArrowLeftIcon } from 'lucide-preact';
import { Button, type ButtonProps } from './Button';

export const BackButton = (props: ButtonProps) => (
  <Button title="Back" icon={ArrowLeftIcon} secondary {...props} />
);
