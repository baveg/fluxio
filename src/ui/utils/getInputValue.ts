export const getInputValue = (e: HTMLInputElement | Event): string => {
  if (e instanceof HTMLInputElement) return e.value;
  const target = (e as Event).target ?? (e as Event).currentTarget;
  return (target as HTMLInputElement).value;
};
