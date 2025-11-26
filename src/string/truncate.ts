export const truncate = (value: string|undefined, maxLength: number, suffix: string = '…'): string => {
  const str = String(value||'');
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength - suffix.length) + suffix;
};
