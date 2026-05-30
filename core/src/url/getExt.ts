export const getExt = (path: string) => {
  const i = path.lastIndexOf('.');
  return i !== -1 ? path.substring(i + 1) : '';
};
