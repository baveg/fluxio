export const removeIndex = <T>(items: T[], index: number) => {
  items.splice(index, 1);
  return items;
};
