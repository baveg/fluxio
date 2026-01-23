import { Dictionary } from 'fluxio/types/Dictionary';
import { indexBy } from 'fluxio/object/by';
import { toDate } from 'fluxio/cast/toDate';
import { padStart } from 'fluxio/string/pad';
import { isFloat, isNumber, isUInt } from 'fluxio/check/isNumber';
import { fluxStored } from 'fluxio/flux/fluxStored';
import { lower } from 'fluxio/string';
import { normalizeIndex } from 'fluxio/array/normalizeIndex';
import { pInt } from 'fluxio/cast/toNumber';
import { floor } from 'fluxio/number/floor';
import { isDate } from 'fluxio/check/isDate';
import { round } from 'fluxio/number/round';

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

export const timeOffset$ = fluxStored<number>('timeOffset$', 0, isFloat);

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

export const getMs = (d: DateLike) => toDate(d).getMilliseconds();

export const setMs = (d: DateLike, v: number) => updateDate(d, (d) => d.setMilliseconds(v));

///// SECOND /////

export const getSeconds = (d: DateLike) => toDate(d).getSeconds();

export const setSeconds = (d: DateLike, v: number) => updateDate(d, (d) => d.setSeconds(v));

///// MINUTE /////

export const getMinutes = (d: DateLike) => toDate(d).getMinutes();

export const setMinutes = (d: DateLike, v: number) => updateDate(d, (d) => d.setMinutes(v));

///// HOUR /////

export const getHours = (d: DateLike) => toDate(d).getHours();

export const setHours = (d: DateLike, v: number) => updateDate(d, (d) => d.setHours(v));

///// MONTH DAY /////

export const getMonthDay = (d: DateLike) => toDate(d).getDate();

export const setMonthDay = (d: DateLike, v: number) => updateDate(d, (d) => d.setDate(v));

///// WEEK DAY /////

export const getWeekDay = (d: DateLike) => toDate(d).getDay();

export const setWeekDay = (d: DateLike, v: number) => addDay((d = toDate(d)), v - getWeekDay(d));

///// MONTH /////

export const getMonth = (d: DateLike) => toDate(d).getMonth();

export const setMonth = (d: DateLike, v: number) => updateDate(d, (d) => d.setMonth(v));

///// DAY SECONDS /////

export const getDaySeconds = (d: DateLike): number =>
  getHours((d = toDate(d))) * 3600 + getMinutes(d) * 60 + getSeconds(d);

export const setDaySeconds = (d: DateLike, v: number) =>
  new Date(startOfDay(d).getTime() + v * SECOND);

///// YEAR /////

/** Date as "2006" */
export const getYear = (d: DateLike) => toDate(d).getFullYear();

export const setYear = (d: DateLike, v: number) => updateDate(d, (d) => d.setFullYear(v));

///// TIME /////

export const getTime = (d: DateLike) => toDate(d).getTime();

export const getDayTime = (d: DateLike) => (d = toDate(d)).getTime() - startOfDay(d).getTime();

///// ADD /////

export const addMs = (d: DateLike, ms: number) => new Date(getTime(d) + ms);
export const addSecond = (d: DateLike, v: number = 1) => addMs(d, v * SECOND);
export const addMinute = (d: DateLike, v: number = 1) => addMs(d, v * MINUTE);
export const addHour = (d: DateLike, v: number = 1) => addMs(d, v * HOUR);
export const addDay = (d: DateLike, v: number = 1) => addMs(d, v * DAY);
export const addWeek = (d: DateLike, v: number = 1) => addMs(d, v * WEEK);
export const addMonth = (d: DateLike, v: number = 1) => setMonth((d = toDate(d)), getMonth(d) + v);
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

/** Format date as "Mardi, 9 Février 2025 15:04:05" */
export const formatDateTime = (d: DateLike) => `${formatDate((d = toDate(d)))} ${formatTime(d)}`;

/** Format date as "9 Fév 2025 15:04" */
export const formatShortDateTime = (d: DateLike) =>
  `${formatShortDate((d = toDate(d)))} ${formatTime(d)}`;

///// PARSE /////

export const parseTime = (v: string) => {
  const a = v.match(/(\d{2}):(\d{2})(?::(\d{2}))?/);
  if (a) return (pInt(a[1]) || 0) * HOUR + (pInt(a[2]) || 0) * MINUTE + (pInt(a[3]) || 0) * SECOND;
};

///// COMPARAISONS /////

export const isSameYear = (a: DateLike, b: DateLike): boolean => getYear(a) === getYear(b);

export const isSameMonth = (a: DateLike, b: DateLike): boolean =>
  getYear((a = toDate(a))) === getYear((b = toDate(b))) && getMonth(a) === getMonth(b);

export const isSameDay = (a: DateLike, b: DateLike): boolean =>
  getYear((a = toDate(a))) === getYear((b = toDate(b))) &&
  getMonth(a) === getMonth(b) &&
  getMonthDay(a) === getMonthDay(b);

///// VALIDATIONS /////

export const isToday = (d: DateLike): boolean => isSameDay(d, serverDate());

export const isTomorrow = (d: DateLike): boolean => isSameDay(d, addDay(serverDate(), 1));

export const isYesterday = (d: DateLike): boolean => isSameDay(d, addDay(serverDate(), -1));

export const isPast = (d: DateLike): boolean => getTime(d) < serverTime();

export const isFuture = (d: DateLike): boolean => getTime(d) > serverTime();

///// HELPERS /////

export const cloneDate = (d: DateLike) => new Date(toDate(d));

export const updateDate = (d: DateLike, update: (date: Date) => void) => {
  const r = new Date(toDate(d));
  update(r);
  return r;
};

// Début de journée
export const startOfDay = (d: DateLike): Date => updateDate(d, (d) => d.setHours(0, 0, 0, 0));

// Fin de journée
export const endOfDay = (d: DateLike): Date => updateDate(d, (d) => d.setHours(23, 59, 59, 999));

export const startOfWeek = (d: DateLike, startDay = 1): Date =>
  addDay((d = startOfDay(d)), normalizeIndex(startDay - getWeekDay(d), 7) - 7);

export const endOfWeek = (d: DateLike, startDay = 1): Date =>
  addDay((d = startOfDay(d)), normalizeIndex(startDay + 6 - getWeekDay(d), 7));

export const startOfMonth = (d: DateLike): Date =>
  new Date(getYear((d = toDate(d))), getMonth(d), 1, 0, 0, 0, 0);

export const endOfMonth = (d: DateLike): Date =>
  new Date(getYear((d = toDate(d))), getMonth(d) + 1, 0, 23, 59, 59, 999);

export const startOfYear = (d: DateLike): Date => new Date(getYear(d), 0, 1, 0, 0, 0, 0);

export const endOfYear = (d: DateLike): Date => new Date(getYear(d), 11, 31, 23, 59, 59, 999);

/** Format date as "2025-02-09T15:04:05.000Z" */
export const formatISO = (d: DateLike): string => toDate(d).toISOString();

/** Check if date is expired (date + delay < now) */
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
