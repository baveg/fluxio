/**
 * Create random string
 * @param count Number of chars
 * @param chars Remove similar characters by default
 * @returns
 */
export const randString = (
  count: number,
  chars: string = 'abcdefghjkpqrstwxyzABCDEFGHJKPQRSTWXYZ23456789'
) => {
  const charset = chars.split('');
  let result = '';

  if (typeof crypto === 'object' && crypto.getRandomValues) {
    const buff = new Uint32Array(count);
    crypto.getRandomValues(buff);
    for (let i = 0; i < count; i++) {
      result += charset[buff[i]! % charset.length];
    }
  } else {
    for (let i = 0; i < count; i++) {
      result += charset[Math.floor(Math.random() * charset.length)];
    }
  }

  return result;
};

/**
 * Create random hex string
 * @param count Number of chars
 * @returns
 */
export const randHex = (count: number) => randString(count, '0123456789abcdef');

/**
 * Create random UUID V4
 * @returns
 */
export const uuid = (): string => {
  if (typeof crypto === 'object' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${randHex(8)}-${randHex(4)}-4${randHex(3)}-8${randHex(3)}-${randHex(12)}`;
};
