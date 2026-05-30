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
