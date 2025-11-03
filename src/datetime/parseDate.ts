/** Parse flexible date/time string: DD/MM, DD/MM/YY, DD/MM/YYYY HH:MM:SS, HH:MM, etc. */
export const parseDate = (str: string): Date | null => {
  const now = new Date();

  let day = now.getDate();
  let month = now.getMonth() + 1;
  let year = now.getFullYear();
  let h = 0,
    m = 0,
    s = 0;

  const timeMatch = str.match(/(\d{2}):(\d{2})(?::(\d{2}))?/);
  if (timeMatch) {
    h = parseInt(timeMatch[1]!, 10);
    m = parseInt(timeMatch[2]!, 10);
    s = parseInt(timeMatch[3] || '0', 10);
  }

  const dateMatch = str.match(/(\d{2})\/(\d{2})(?:\/(\d{2,4}))?/);
  if (dateMatch) {
    day = parseInt(dateMatch[1]!, 10);
    month = parseInt(dateMatch[2]!, 10);
    const y = dateMatch[3];
    if (y) {
      year = parseInt(y, 10);
      if (y.length === 2) {
        year += year > 40 ? 1900 : 2000;
      }
    }
  }

  const result = new Date(year, month - 1, day, h, m, s);

  if (
    result.getFullYear() !== year ||
    result.getMonth() !== month - 1 ||
    result.getDate() !== day
  ) {
    return null;
  }

  return result;
};
