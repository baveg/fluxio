export const sum = (list: number[], margin?: number) => {
  let r = 0;
  for (const n of list) r += n;
  return r + (list.length - 1) * (margin || 0);
};
