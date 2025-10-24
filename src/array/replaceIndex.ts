export const replaceIndex = <T>(items: T[], index: number, replace: T) => {
  items[index] = replace;
  return items;
};
