export const getInputValue = (e: HTMLInputElement | Event): string => {
  const el = e instanceof HTMLInputElement ? e : ((e.target ?? e.currentTarget) as HTMLInputElement);
  return el.type === 'checkbox' || el.type === 'radio' ? el.indeterminate ? '' : el.checked ? 'true' : 'false' : el.value;
};
