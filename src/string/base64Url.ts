/**
 * Convert hex to base64url (URL-safe)
 * @param hex - hex string
 * @returns base64url string
 */
export const hexToBase64Url = (hex: string): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

  let result = '';

  // Process 3 bytes (6 hex chars) at a time -> 4 base64 chars
  for (let i = 0; i < hex.length; i += 6) {
    const chunk = hex.slice(i, i + 6).padEnd(6, '0');
    const num = parseInt(chunk, 16);

    result += chars[(num >> 18) & 63];
    result += chars[(num >> 12) & 63];
    result += chars[(num >> 6) & 63];
    result += chars[num & 63];
  }

  // Remove padding
  return result.replace(/A+$/, '');
};

/**
 * Convert base64url back to hex
 */
export const base64UrlToHex = (b64: string): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

  // Pad to multiple of 4
  const padded = b64.padEnd(Math.ceil(b64.length / 4) * 4, 'A');

  let hex = '';

  // Process 4 base64 chars at a time -> 3 bytes (6 hex chars)
  for (let i = 0; i < padded.length; i += 4) {
    const a = chars.indexOf(padded[i]);
    const b = chars.indexOf(padded[i + 1]);
    const c = chars.indexOf(padded[i + 2]);
    const d = chars.indexOf(padded[i + 3]);

    const num = (a << 18) | (b << 12) | (c << 6) | d;

    hex += ((num >> 16) & 255).toString(16).padStart(2, '0');
    hex += ((num >> 8) & 255).toString(16).padStart(2, '0');
    hex += (num & 255).toString(16).padStart(2, '0');
  }

  return hex;
};