import { Dictionary } from "fluxio/types/Dictionary";
import { indexBy } from "fluxio/object/by";
import { toDate } from "fluxio/cast/toDate";
import { firstUpper } from "fluxio/string/upper";
import { padStart } from 'fluxio/string/pad';
import { isUInt } from "fluxio/check/isNumber";

///// CONSTANTS /////

export const DATE0 = new Date(0);

export const SECOND = 1000;
export const MINUTE = 60 * SECOND;
export const HOUR = 60 * MINUTE;
export const DAY = 24 * HOUR;
export const WEEK = 7 * DAY;
export const YEAR = 365 * DAY;

///// SECONDS /////

export const getMs = (d: any) => toDate(d).getMilliseconds();

/** Format date as "0001" */
export const formatMs = (d: any) => padStart(getMs(d), 4);

///// SECONDS /////

export const getSeconds = (d: any) => toDate(d).getSeconds();

/** Format date as "05" */
export const formatSeconds = (d: any) => padStart(getSeconds(d), 2);

///// MINUTES /////

export const getMinutes = (d: any) => toDate(d).getMinutes();

/** Format date as "04" */
export const formatMinutes = (d: any) => padStart(getMinutes(d), 2);

///// HOURS /////

export const getHours = (d: any) => toDate(d).getHours();

/** Format date as "03" */
export const formatHours = (d: any) => padStart(getHours(d), 2);

///// DAY SECONDS /////

/** Convert date to seconds since midnight */
export const getDaySeconds = (d: any): number => getHours(d=toDate(d)) * 3600 + getMinutes(d) * 60 + getSeconds(d);

/** Convert seconds since midnight to Date */
export const daySecondsToDate = (seconds: number): Date => toDate(seconds * SECOND)

///// WEEK DAY /////

export const WEEK_DAYS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
export const SHORT_DAYS = ['dim', 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam'];

/** 0 -> "dimanche", 1 -> "lundi", 2 -> "mardi", ... */
export const indexToWeekDay = (i: number|null|undefined) => isUInt(i) ? WEEK_DAYS[i]||'' : '';

/** 0 -> "dim", 1 -> "lun", 2 -> "mar", ... */
export const indexToShortDay = (i: number|null|undefined) => isUInt(i) ? SHORT_DAYS[i]||'' : '';

let _parseDay: Dictionary<number>|undefined;

/** "dim" -> 0, "lundi" -> 1, "MarDi" -> 2, ... */
export const dayToIndex = (day: string) => {
  const map = _parseDay || (_parseDay = { ...indexBy(WEEK_DAYS), ...indexBy(SHORT_DAYS) });
  return map[String(day).toLowerCase()];
};

export const getWeekDay = (d: any) => toDate(d).getDay();

/** Format date as Mardi */
export const formatWeekDay = (d: any) => firstUpper(indexToWeekDay(getWeekDay(d)));

/** Format date as Mar */
export const formatShortDay = (d: any) => firstUpper(indexToShortDay(getWeekDay(d)));

///// MONTH DAY /////

export const getMonthDay = (d: any) => toDate(d).getDate();

///// MONTH /////

export const MONTHS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
export const SHORT_MONTHS = ['jan', 'fév', 'mars', 'avr', 'mai', 'juin', 'juil', 'août', 'sept', 'oct', 'nov', 'déc'];

/** 0 -> "janvier", 1 -> "février", 2 -> "mars", ... */
export const indexToMonth = (i: number|null|undefined) => isUInt(i) ? MONTHS[i]||'' : '';

/** 0 -> "jan", 1 -> "fév", 2 -> "mars", ... */
export const indexToShortMonth = (i: number|null|undefined) => isUInt(i) ? SHORT_MONTHS[i]||'' : '';

let _parseMonth: Dictionary<number>|undefined;

/** "jan" -> 0, "février" -> 1, "MarS" -> 2, ... */
export const monthToIndex = (month: string) => {
  const map = _parseMonth || (_parseMonth = { ...indexBy(MONTHS), ...indexBy(SHORT_MONTHS) });
  return map[String(month).toLowerCase()];
};

export const getMonth = (d: any) => toDate(d).getMonth();

/** Format date as Février */
export const formatMonth = (d: any) => firstUpper(indexToMonth(getMonth(d)));

/** Format date as Fév */
export const formatShortMonth = (d: any) => firstUpper(indexToShortMonth(getMonth(d)));

///// YEAR /////

/** Date as "2006" */
export const getYear = (d: any) => toDate(d).getFullYear();

///// TIME /////

export const getTime = (d: any) => toDate(d).getTime();

///// ADD /////

export const addMs = (a: any, b: any) => toDate(getTime(a) + getTime(b));
export const addSecond = (d: any, v: number=1) => addMs(d, v * SECOND);
export const addMinute = (d: any, v: number=1) => addMs(d, v * MINUTE);
export const addHour = (d: any, v: number=1) => addMs(d, v * HOUR);
export const addDay = (d: any, v: number=1) => addMs(d, v * DAY);
export const addWeek = (d: any, v: number=1) => addMs(d, v * WEEK);
export const addMonths = (d: any, v: number=1) => (d=toDate(d)).setMonth(getMonth(d) + v);
export const addYear = (d: any, v: number=1) => addMs(d, v * YEAR);

///// FORMAT /////

/** Format date as "Mardi, 9 Février 2025" */
export const formatDate = (date: any) => `${formatWeekDay(date = toDate(date))}, ${getMonthDay(date)} ${formatMonth(date)} ${getYear(date)}`;

/** Format date as "9 Fév 2025" */
export const formatShortDate = (date: any) => `${getMonthDay(date = toDate(date))} ${formatShortMonth(date)} ${getYear(date)}`;

/** Format date as "15:04:05" */
export const formatTime = (d: any) => `${formatHours(d = toDate(d))}:${formatMinutes(d)}:${formatSeconds(d)}`;

/** Format date as "15:04" */
export const formatShortTime = (d: any) => `${formatHours(d = toDate(d))}:${formatMinutes(d)}`;

/** Format date as "Mardi, 9 Février 2025 15:04:05" */
export const formatDateTime = (d: any) => `${formatDate(d = toDate(d))} ${formatTime(d)}`;

/** Format date as "9 Fév 2025 15:04" */
export const formatShortDateTime = (d: any) => `${formatShortDate(d = toDate(d))} ${formatShortTime(d)}`;

///// HELPERS /////

/** Check if date is expired (date + delay < now) */
export const isExpired = (date: any, delayMs: number = 0): boolean => {
  const d = toDate(date);
  if (!d) return true;
  return d.getTime() + delayMs < Date.now();
};

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
