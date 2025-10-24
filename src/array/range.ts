export const range = (from: number, to: number): number[] => {
  if (to < from) return range(to, from).reverse();
  const r: number[] = [];
  for (let i = from; i <= to; i++) r.push(i);
  return r;
};
