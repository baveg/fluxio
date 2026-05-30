export const isUuid = (v: any): v is string => {
  const code = String(v).replace(/[a-fA-F0-9]+/g, (a) => '' + a.length);
  return code === '8-4-4-4-12' || code === '32';
};
