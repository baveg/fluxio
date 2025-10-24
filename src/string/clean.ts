export const clean = (arg: string): string =>
  arg
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w]/g, ' ')
    .trim();
