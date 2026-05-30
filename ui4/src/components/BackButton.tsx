import type { ButtonProps } from './Button';
import { Button } from './Button';
import { ArrowLeftIcon } from 'lucide-preact';

export const BackButton = (props: ButtonProps) => (
  <Button title="Back" icon={ArrowLeftIcon} color="secondary" {...props} />
);
