export const extractVersion = (text: string): string => text.match(/\d+(?:\.\d+)+/)?.[0] ?? text;

export const versionGte = (installed: string, required: string): boolean => {
  if (!installed) return false;
  const a = extractVersion(installed).split('.').map(Number);
  const b = extractVersion(required).split('.').map(Number);
  const len = Math.max(a.length, b.length);
  for (let i = 0; i < len; i++) {
    const ai = a[i] ?? 0;
    const bi = b[i] ?? 0;
    if (ai > bi) return true;
    if (ai < bi) return false;
  }
  return true;
};
