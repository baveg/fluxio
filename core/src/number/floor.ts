export const floor = (number: number, digits?: number): number => {
  if (digits) {
    const base = Math.pow(10, digits);
    return Math.floor(base * number) / base;
  }
  return Math.floor(number);
};
