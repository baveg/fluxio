import { isFloat } from 'fluxio/check/isNumber';
import { isStringValid } from 'fluxio/check/isString';

export const parseSeconds = (value: string | number): number | null => {
  if (isStringValid(value)) {
    let [h, m, s] = value
      .replace(/[^\d]+/g, ' ')
      .split(' ')
      .map(Number);
    if (h !== undefined) {
      if (!m && h > 99) {
        m = h % 100;
        h = (h - m) / 100;
      }
      const result = h * 3600 + (m || 0) * 60 + (s || 0);
      console.debug('parseSeconds', value, h, m, s, result);
      return result;
    }
  }
  console.debug('parseSeconds', value);
  return isFloat(value) ? value : 0;
};
