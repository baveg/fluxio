import { Button, ButtonProps } from './Button';
import { ArrowLeftIcon } from 'lucide-react';

export const BackButton = (props: ButtonProps) => (
  <Button title="Back" icon={ArrowLeftIcon} color="secondary" {...props} />
);
