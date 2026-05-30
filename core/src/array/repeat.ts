export const repeat = <T>(count: number, cb: (i: number) => T): T[] => {
  const r: T[] = [];
  for (let i = 0; i < count; i++) r.push(cb(i));
  return r;
};
