/** Convert seconds since midnight to HH:MM:SS format */
export const secondsToDate = (seconds: number): Date => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setSeconds(seconds);
  return date;
};
