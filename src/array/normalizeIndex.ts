export const normalizeIndex = (index: number, length: number) => {
  if (length === 0) return 0;
  index = index % length;
  if (index < 0) index += length;
  return index;
};
