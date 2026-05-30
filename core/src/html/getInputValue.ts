import { getTargetEl } from './getTargetEl';

export const getInputValue = (e: HTMLInputElement | Event): string => {
  const el = getTargetEl(e) as HTMLInputElement;
  return (
    el.type === 'checkbox' || el.type === 'radio' ?
      el.indeterminate ? ''
      : el.checked ? 'true'
      : 'false'
    : el.value
  );
};
