export const stopEvent = (e: any) => {
  if (e) {
    e.preventDefault?.();
    e.stopPropagation?.();
  }
};
