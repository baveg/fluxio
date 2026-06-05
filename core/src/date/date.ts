import type { Dictionary } from '../types/Dictionary';
import { indexBy } from '../object/by';
import { toDate } from '../cast/toDate';
import { padStart } from '../string/pad';
import { isNumber, isUInt } from '../check/isNumber';
import { fluxStored } from '../flux/fluxStored';
import { lower } from '../string';
import { normalizeIndex } from '../array/normalizeIndex';
import { pInt, pFloat } from '../cast/toNumber';
import { floor } from '../number/floor';
import { isDate } from '../check/isDate';
import { round } from '../number/round';

export type DateLike = Readonly<Date> | string | number | null | undefined;

///// CONSTANTS /////

export const DATE0 = new Date(0);

export const SECOND = 1000;
export const MINUTE = 60 * SECOND;
export const HOUR = 60 * MINUTE;
export const DAY = 24 * HOUR;
export const WEEK = 7 * DAY;
export const MONTH = 30 * DAY; // Approximate
export const YEAR = 365 * DAY; // Approximate

export const TWO_MINUTES = 2 * MINUTE;
export const FIVE_MINUTES = 5 * MINUTE;
export const TEN_MINUTES = 10 * MINUTE;
export const QUARTER_HOUR = 15 * MINUTE;
export const HALF_HOUR = 30 * MINUTE;

///// SERVER DATE /////

export const timeOffset$ = fluxStored<number>('timeOffset$', 0, pFloat);

if (!Date.now) Date.now = () => new Date().getTime();

let _bestSyncDelay = 99999;
let _syncInterval: ReturnType<typeof setInterval> | undefined;
export const syncServerTime = (
  getServerTime: () => Promise<number>,
  intervalMs: number = FIVE_MINUTES
) => {
  if (_syncInterval !== undefined) {
    clearInterval(_syncInterval);
    _syncInterval = undefined;
  }

  const doSync = async () => {
    try {
      const start = Date.now();
      const serverTime = await getServerTime();
      const end = Date.now();

      const localTime = (start + end) / 2;
      const offset = round(serverTime - localTime);

      const syncDelay = end - start;

      if (syncDelay < _bestSyncDelay) {
        _bestSyncDelay = syncDelay;
        timeOffset$.set(offset);
      }
    } catch (error) {
      // Silent fail
    }
  };

  _syncInterval = setInterval(doSync, intervalMs);
  doSync();
};

/**
 * Get the current server time estimate
 * Triggers initial sync in background if not yet synced, but returns immediately
 * @returns Current server time in milliseconds (may be inaccurate before first sync completes)
 */
export const serverTime = () => timeOffset$.get() + Date.now();

/**
 * Get the current server time as a Date object
 * @returns Date object representing server time
 */
export const serverDate = () => new Date(serverTime());

///// MILLISECOND /////

/** Get milliseconds (0-999) - getMs('2025-02-09T15:04:05.123Z') -> 123 */
export const getMs = (d: DateLike) => toDate(d).getMilliseconds();

/** Set milliseconds - setMs('2025-02-09T15:04:05.000Z', 500) -> 2025-02-09T15:04:05.500Z */
export const setMs = (d: DateLike, v: number) => updateDate(d, (d) => d.setMilliseconds(v));

///// SECOND /////

/** Get seconds (0-59) - getSeconds('2025-02-09T15:04:30Z') -> 30 */
export const getSeconds = (d: DateLike) => toDate(d).getSeconds();

/** Set seconds - setSeconds('2025-02-09T15:04:00Z', 45) -> 2025-02-09T15:04:45Z */
export const setSeconds = (d: DateLike, v: number) => updateDate(d, (d) => d.setSeconds(v));

///// MINUTE /////

/** Get minutes (0-59) - getMinutes('2025-02-09T15:30Z') -> 30 */
export const getMinutes = (d: DateLike) => toDate(d).getMinutes();

/** Set minutes - setMinutes('2025-02-09T15:00Z', 45) -> 2025-02-09T15:45Z */
export const setMinutes = (d: DateLike, v: number) => updateDate(d, (d) => d.setMinutes(v));

///// HOUR /////

/** Get hours (0-23) - getHours('2025-02-09T15:30Z') -> 15 */
export const getHours = (d: DateLike) => toDate(d).getHours();

/** Set hours - setHours('2025-02-09T10:30Z', 15) -> 2025-02-09T15:30Z */
export const setHours = (d: DateLike, v: number) => updateDate(d, (d) => d.setHours(v));

///// MONTH DAY /////

/** Get day of month (1-31) - getMonthDay('2025-02-09') -> 9 */
export const getMonthDay = (d: DateLike) => toDate(d).getDate();

/** Set day of month - setMonthDay('2025-02-09', 15) -> 2025-02-15 */
export const setMonthDay = (d: DateLike, v: number) => updateDate(d, (d) => d.setDate(v));

///// WEEK DAY /////

/** Get day of week (0=Sunday, 6=Saturday) - getWeekDay('2025-02-10') -> 1 (Monday) */
export const getWeekDay = (d: DateLike) => toDate(d).getDay();

/** Set day of week (0=Sunday, 6=Saturday) - setWeekDay('2025-02-10', 5) -> 2025-02-14 (Friday) */
export const setWeekDay = (d: DateLike, v: number) => addDay((d = toDate(d)), v - getWeekDay(d));

/** Get ISO week day (1=Monday, 7=Sunday) - getISODay('2025-02-10') -> 1 (Monday) */
export const getISODay = (d: DateLike) => getWeekDay(d) || 7;

///// MONTH /////

/** Get month (0=January, 11=December) - getMonth('2025-02-09') -> 1 */
export const getMonth = (d: DateLike) => toDate(d).getMonth();

/** Set month (0=January, 11=December) - setMonth('2025-02-09', 5) -> 2025-06-09 */
export const setMonth = (d: DateLike, v: number) => updateDate(d, (d) => d.setMonth(v));

///// DAY SECONDS /////

/** Get seconds since midnight (0-86399) - getDaySeconds('2025-02-09T15:30:45Z') -> 55845 */
export const getDaySeconds = (d: DateLike): number =>
  getHours((d = toDate(d))) * 3600 + getMinutes(d) * 60 + getSeconds(d);

/** Set time from seconds since midnight - setDaySeconds('2025-02-09', 3661) -> 2025-02-09T01:01:01Z */
export const setDaySeconds = (d: DateLike, v: number) =>
  new Date(startOfDay(d).getTime() + v * SECOND);

///// YEAR /////

/** Get year (4 digits) - getYear('2025-02-09') -> 2025 */
export const getYear = (d: DateLike) => toDate(d).getFullYear();

/** Set year - setYear('2025-02-09', 2026) -> 2026-02-09 */
export const setYear = (d: DateLike, v: number) => updateDate(d, (d) => d.setFullYear(v));

///// TIME /////

/** Get timestamp in milliseconds - getTime('2025-02-09') -> 1739059200000 */
export const getTime = (d: DateLike) => toDate(d).getTime();

/** Get milliseconds since start of day - getDayTime('2025-02-09T15:30Z') -> 55800000 */
export const getDayTime = (d: DateLike) => (d = toDate(d)).getTime() - startOfDay(d).getTime();

///// ADD /////

/** Add milliseconds - addMs('2025-02-09T15:00:00Z', 5000) -> 2025-02-09T15:00:05Z */
export const addMs = (d: DateLike, ms: number) => new Date(getTime(d) + ms);

/** Add seconds - addSecond('2025-02-09T15:00:00Z', 30) -> 2025-02-09T15:00:30Z */
export const addSecond = (d: DateLike, v: number = 1) => addMs(d, v * SECOND);

/** Add minutes - addMinute('2025-02-09T15:00Z', 30) -> 2025-02-09T15:30Z */
export const addMinute = (d: DateLike, v: number = 1) => addMs(d, v * MINUTE);

/** Add hours - addHour('2025-02-09T15:00Z', 3) -> 2025-02-09T18:00Z */
export const addHour = (d: DateLike, v: number = 1) => addMs(d, v * HOUR);

/** Add days - addDay('2025-02-09', 5) -> 2025-02-14 */
export const addDay = (d: DateLike, v: number = 1) => addMs(d, v * DAY);

/** Add weeks - addWeek('2025-02-09', 2) -> 2025-02-23 */
export const addWeek = (d: DateLike, v: number = 1) => addMs(d, v * WEEK);

/** Add months - addMonth('2025-02-09', 3) -> 2025-05-09 */
export const addMonth = (d: DateLike, v: number = 1) => setMonth((d = toDate(d)), getMonth(d) + v);

/** Add years - addYear('2025-02-09', 2) -> 2027-02-09 */
export const addYear = (d: DateLike, v: number = 1) => setYear((d = toDate(d)), getYear(d) + v);

///// DAY NAME /////

export const DAY_NAMES = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
export const DAY_SHORTS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

/** 0 -> "Dimanche", 1 -> "Lundi", 2 -> "Mardi", ... */
export const dayIndexToName = (i: number | null | undefined) =>
  isUInt(i) ? DAY_NAMES[i] || '' : '';

/** 0 -> "Dim", 1 -> "Lun", 2 -> "Mar", ... */
export const dayIndexToShort = (i: number | null | undefined) =>
  isUInt(i) ? DAY_SHORTS[i] || '' : '';

let _parseDay: Dictionary<number> | undefined;

/** "Dim" -> 0, "lundi" -> 1, "MarDi" -> 2, ... */
export const dayToIndex = (day: string) => {
  const map =
    _parseDay ||
    (_parseDay = {
      ...indexBy(DAY_NAMES, lower),
      ...indexBy(DAY_SHORTS, lower),
    });
  return map[lower(day)];
};

/** Format date as Mardi */
export const formatDay = (d: DateLike) => dayIndexToName(getWeekDay(d));

/** Format date as Mar */
export const formatDayShort = (d: DateLike) => dayIndexToShort(getWeekDay(d));

///// MONTH NAME /////

export const MONTH_NAMES = [
  'Janvier',
  'Février',
  'Mars',
  'Avril',
  'Mai',
  'Juin',
  'Juillet',
  'Août',
  'Septembre',
  'Octobre',
  'Novembre',
  'Décembre',
];
export const MONTH_SHORTS = [
  'Jan',
  'Fév',
  'Mars',
  'Avr',
  'Mai',
  'Juin',
  'Juil',
  'Août',
  'Sept',
  'Oct',
  'Nov',
  'Déc',
];

/** 0 -> "janvier", 1 -> "février", 2 -> "mars", ... */
export const monthIndexToName = (i: number | null | undefined) =>
  isUInt(i) ? MONTH_NAMES[i] || '' : '';

/** 0 -> "jan", 1 -> "fév", 2 -> "mars", ... */
export const monthIndexToShort = (i: number | null | undefined) =>
  isUInt(i) ? MONTH_SHORTS[i] || '' : '';

let _parseMonth: Dictionary<number> | undefined;

/** "jan" -> 0, "février" -> 1, "MarS" -> 2, ... */
export const monthToIndex = (month: string) => {
  const map =
    _parseMonth ||
    (_parseMonth = {
      ...indexBy(MONTH_NAMES, lower),
      ...indexBy(MONTH_SHORTS, lower),
    });
  return map[lower(month)];
};

/** Format date as Février */
export const formatMonth = (d: DateLike) => monthIndexToName(getMonth(d));

/** Format date as Fév */
export const formatShortMonth = (d: DateLike) => monthIndexToShort(getMonth(d));

///// FORMAT /////

/** Format date as "Mardi, 9 Février 2025" */
export const formatDate = (d: DateLike) =>
  d ? `${formatDay((d = toDate(d)))}, ${getMonthDay(d)} ${formatMonth(d)} ${getYear(d)}` : '';

/** Format date as "9 Fév 2025" */
export const formatShortDate = (d: DateLike) =>
  `${getMonthDay((d = toDate(d)))} ${formatShortMonth(d)} ${getYear(d)}`;

/** Format milliseconds as "15:04" ou "15:04:05" without timezone conversion */
export const formatTime = (d: Date | number | null | undefined, seconds = false) => {
  const ms =
    isDate(d) ? getDayTime(d)
    : isNumber(d) ? d
    : 0;
  const t = floor(ms / SECOND);
  const h = padStart(floor(t / 3600), 2);
  const m = padStart(floor((t % 3600) / 60), 2);
  const s = padStart(t % 60, 2);
  return seconds ? `${h}:${m}:${s}` : `${h}:${m}`;
};

/** Format milliseconds as "5h 3min 2s", "3min 2s", "5min" */
export const formatDuration = (d: Date | number | null | undefined, seconds = false): string => {
  const ms =
    isDate(d) ? getDayTime(d)
    : isNumber(d) ? d
    : 0;
  const t = floor(ms / SECOND);
  const h = floor(t / 3600);
  const m = floor((t % 3600) / 60);
  const s = t % 60;
  const parts: string[] = [];
  if (h > 0) parts.push(`${h}h`);
  if (m > 0) parts.push(`${m}min`);
  if (seconds && (s > 0 || parts.length === 0)) parts.push(`${s}s`);
  return parts.join(' ');
};

/** Format date as "Mardi, 9 Février 2025 15:04:05" */
export const formatDateTime = (d: DateLike) => `${formatDate((d = toDate(d)))} ${formatTime(d)}`;

/** Format date as "9 Fév 2025 15:04" */
export const formatShortDateTime = (d: DateLike) =>
  `${formatShortDate((d = toDate(d)))} ${formatTime(d)}`;

///// PARSE /////

/** Parse time string to milliseconds - parseTime('15:30') -> 55800000, parseTime('15:30:45') -> 55845000 */
export const parseTime = (v: string) => {
  const a = v.match(/(\d{2}):(\d{2})(?::(\d{2}))?/);
  if (a) return (pInt(a[1]) || 0) * HOUR + (pInt(a[2]) || 0) * MINUTE + (pInt(a[3]) || 0) * SECOND;
};

///// COMPARAISONS /////

/** Check if same year - isSameYear('2025-02-09', '2025-12-31') -> true */
export const isSameYear = (a: DateLike, b: DateLike): boolean => getYear(a) === getYear(b);

/** Check if same month - isSameMonth('2025-02-09', '2025-02-28') -> true */
export const isSameMonth = (a: DateLike, b: DateLike): boolean =>
  getYear((a = toDate(a))) === getYear((b = toDate(b))) && getMonth(a) === getMonth(b);

/** Check if same day - isSameDay('2025-02-09T10:00Z', '2025-02-09T18:00Z') -> true */
export const isSameDay = (a: DateLike, b: DateLike): boolean =>
  getYear((a = toDate(a))) === getYear((b = toDate(b))) &&
  getMonth(a) === getMonth(b) &&
  getMonthDay(a) === getMonthDay(b);

///// VALIDATIONS /////

/** Check if date is today - isToday(new Date()) -> true */
export const isToday = (d: DateLike): boolean => isSameDay(d, serverDate());

/** Check if date is tomorrow - isTomorrow(addDay(new Date(), 1)) -> true */
export const isTomorrow = (d: DateLike): boolean => isSameDay(d, addDay(serverDate(), 1));

/** Check if date is yesterday - isYesterday(addDay(new Date(), -1)) -> true */
export const isYesterday = (d: DateLike): boolean => isSameDay(d, addDay(serverDate(), -1));

/** Check if date is in the past - isPast('2020-01-01') -> true */
export const isPast = (d: DateLike): boolean => getTime(d) < serverTime();

/** Check if date is in the future - isFuture('2030-01-01') -> true */
export const isFuture = (d: DateLike): boolean => getTime(d) > serverTime();

///// HELPERS /////

/** Clone a date - cloneDate('2025-02-09') -> Date object */
export const cloneDate = (d: DateLike) => new Date(toDate(d));

/** Update date immutably - updateDate('2025-02-09', d => d.setDate(15)) -> 2025-02-15 */
export const updateDate = (d: DateLike, update: (date: Date) => void) => {
  const r = new Date(toDate(d));
  update(r);
  return r;
};

/** Get start of day (00:00:00.000) - startOfDay('2025-02-09T15:30Z') -> 2025-02-09T00:00:00.000Z */
export const startOfDay = (d: DateLike): Date => updateDate(d, (d) => d.setHours(0, 0, 0, 0));

/** Get end of day (23:59:59.999) - endOfDay('2025-02-09T15:30Z') -> 2025-02-09T23:59:59.999Z */
export const endOfDay = (d: DateLike): Date => updateDate(d, (d) => d.setHours(23, 59, 59, 999));

/** Get start of week (Monday 00:00) - startOfWeek('2025-02-09') -> 2025-02-03T00:00:00.000Z */
export const startOfWeek = (d: DateLike, startDay = 1): Date =>
  addDay((d = startOfDay(d)), normalizeIndex(startDay - getWeekDay(d), 7) - 7);

/** Get end of week (Sunday 23:59) - endOfWeek('2025-02-09') -> 2025-02-09T23:59:59.999Z */
export const endOfWeek = (d: DateLike, startDay = 1): Date =>
  addDay((d = startOfDay(d)), normalizeIndex(startDay + 6 - getWeekDay(d), 7));

/** Get start of month (1st day 00:00) - startOfMonth('2025-02-15') -> 2025-02-01T00:00:00.000Z */
export const startOfMonth = (d: DateLike): Date =>
  new Date(getYear((d = toDate(d))), getMonth(d), 1, 0, 0, 0, 0);

/** Get end of month (last day 23:59) - endOfMonth('2025-02-15') -> 2025-02-28T23:59:59.999Z */
export const endOfMonth = (d: DateLike): Date =>
  new Date(getYear((d = toDate(d))), getMonth(d) + 1, 0, 23, 59, 59, 999);

/** Get start of year (Jan 1st 00:00) - startOfYear('2025-06-15') -> 2025-01-01T00:00:00.000Z */
export const startOfYear = (d: DateLike): Date => new Date(getYear(d), 0, 1, 0, 0, 0, 0);

/** Get end of year (Dec 31st 23:59) - endOfYear('2025-06-15') -> 2025-12-31T23:59:59.999Z */
export const endOfYear = (d: DateLike): Date => new Date(getYear(d), 11, 31, 23, 59, 59, 999);

///// WEEK NUMBER /////

/** Get ISO 8601 week number (1-53) - getISOWeek('2025-02-09') -> 6 */
export const getISOWeek = (d: DateLike): number => {
  let target = cloneDate(d);
  const dayNr = getISODay(target) - 1; // 0=Monday, 6=Sunday
  target = setMonthDay(target, getMonthDay(target) - dayNr + 3);
  const firstThursday = getTime(target);
  target = setMonth(target, 0);
  target = setMonthDay(target, 1);
  if (getWeekDay(target) !== 4) {
    target = setMonthDay(target, 1 + ((4 - getWeekDay(target)) + 7) % 7);
  }
  return 1 + Math.ceil((firstThursday - getTime(target)) / (7 * DAY));
};

/** Format date as ISO 8601 - toDateISO('2025-02-09T15:04:05Z') -> "2025-02-09T15:04:05.000Z" */
export const toDateISO = (d: DateLike): string => toDate(d).toISOString();
export const formatISO = toDateISO;

/** Check if date is expired - isExpired('2025-02-09', DAY) -> true if now > 2025-02-10 */
export const isExpired = (d: DateLike, ms: number = 0, now = serverTime()): boolean =>
  getTime(d) + ms < now;

// /** Parse flexible date/time string: DD/MM, DD/MM/YY, DD/MM/YYYY HH:MM:SS, HH:MM, etc. */
// export const parseDate = (str: string): Date | null => {
//   const now = new Date();

//   let day = now.getDate();
//   let month = now.getMonth() + 1;
//   let year = now.getFullYear();
//   let h = 0,
//     m = 0,
//     s = 0;

//   const timeMatch = str.match(/(\d{2}):(\d{2})(?::(\d{2}))?/);
//   if (timeMatch) {
//     h = parseInt(timeMatch[1]!, 10);
//     m = parseInt(timeMatch[2]!, 10);
//     s = parseInt(timeMatch[3] || '0', 10);
//   }

//   const dateMatch = str.match(/(\d{2})\/(\d{2})(?:\/(\d{2,4}))?/);
//   if (dateMatch) {
//     day = parseInt(dateMatch[1]!, 10);
//     month = parseInt(dateMatch[2]!, 10);
//     const y = dateMatch[3];
//     if (y) {
//       year = parseInt(y, 10);
//       if (y.length === 2) {
//         year += year > 40 ? 1900 : 2000;
//       }
//     }
//   }

//   const result = new Date(year, month - 1, day, h, m, s);

//   if (
//     result.getFullYear() !== year ||
//     result.getMonth() !== month - 1 ||
//     result.getDate() !== day
//   ) {
//     return null;
//   }

//   return result;
// };
