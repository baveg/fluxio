import { getTarget } from "./getTarget";

export const getInputValue = (e: HTMLInputElement | Event): string => {
  const el = getTarget(e) as HTMLInputElement;
  return (
    el.type === 'checkbox' || el.type === 'radio' ?
      el.indeterminate ? ''
      : el.checked ? 'true'
      : 'false'
    : el.value
  );
};
