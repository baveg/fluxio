import { Dictionary } from "fluxio/types/Dictionary";
import { indexBy } from "fluxio/object/by";
import { toDate } from "fluxio/cast/toDate";
import { firstUpper } from "fluxio/string/upper";
import { padStart } from 'fluxio/string/pad';
import { isUInt } from "fluxio/check/isNumber";

///// CONSTANTS /////

export const DATE_MIN = new Date(0);

export const SECOND = 1000;
export const MINUTE = 60 * SECOND;
export const HOUR = 60 * MINUTE;
export const DAY = 24 * HOUR;
export const WEEK = 7 * DAY;
export const YEAR = 365 * DAY;

///// SECONDS /////

export const getMs = (d: any) => toDate(d).getMilliseconds();

export const formatMs = (d: any) => padStart(getMs(d), 4);

///// SECONDS /////

export const getSeconds = (d: any) => toDate(d).getSeconds();

export const formatSeconds = (d: any) => padStart(getSeconds(d), 2);

///// MINUTES /////

export const getMinutes = (d: any) => toDate(d).getMinutes();

export const formatMinutes = (d: any) => padStart(getMinutes(d), 2);

///// HOURS /////

export const getHours = (d: any) => toDate(d).getHours();

export const formatHours = (d: any) => padStart(getHours(d), 2);

///// WEEK DAY /////

export const WEEK_DAYS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
export const SHORT_DAYS = ['dim', 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam'];

export const indexToWeekDay = (i: number|null|undefined) => isUInt(i) ? WEEK_DAYS[i]||'' : '';

export const indexToShortDay = (i: number|null|undefined) => isUInt(i) ? SHORT_DAYS[i]||'' : '';

let _parseDay: Dictionary<number>|undefined;
export const dayToIndex = (day: string) => {
  const map = _parseDay || (_parseDay = { ...indexBy(WEEK_DAYS), ...indexBy(SHORT_DAYS) });
  return map[String(day).toLowerCase()];
};

export const getWeekDay = (d: any) => toDate(d).getDay();

export const formatWeekDay = (d: any) => firstUpper(indexToWeekDay(getWeekDay(d)));

export const formatShortDay = (d: any) => firstUpper(indexToShortDay(getWeekDay(d)));

///// MONTH DAY /////

export const getMonthDay = (d: any) => toDate(d).getDate();

///// MONTH /////

export const MONTHS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
export const SHORT_MONTHS = ['jan', 'fév', 'mars', 'avr', 'mai', 'juin', 'juil', 'août', 'sept', 'oct', 'nov', 'déc'];

export const indexToMonth = (i: number|null|undefined) => isUInt(i) ? MONTHS[i]||'' : '';

export const indexToShortMonth = (i: number|null|undefined) => isUInt(i) ? SHORT_MONTHS[i]||'' : '';

let _parseMonth: Dictionary<number>|undefined;

export const monthToIndex = (month: string) => {
  const map = _parseMonth || (_parseMonth = { ...indexBy(MONTHS), ...indexBy(SHORT_MONTHS) });
  return map[String(month).toLowerCase()];
};

export const getMonth = (d: any) => toDate(d).getMonth();

export const formatMonth = (d: any) => firstUpper(indexToMonth(getMonth(d)));

export const formatShortMonth = (d: any) => firstUpper(indexToShortMonth(getMonth(d)));

///// YEAR /////

export const getYear = (d: any) => toDate(d).getFullYear();

///// TIME /////

export const getTime = (d: any) => toDate(d).getTime();

/** Format time as HH:MM:SS */
export const formatTime = (date?: any): string => {
  const d = toDate(date);
  if (!d) return '';
  const hours = padStart(d.getHours(), 2);
  const minutes = padStart(d.getMinutes(), 2);
  const secondes = padStart(d.getSeconds(), 2);
  return secondes === '00' ? `${hours}:${minutes}` : `${hours}:${minutes}:${secondes}`;
};

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

export const formatShortDate = (date: any) => `${getMonthDay(date = toDate(date))} ${formatShortMonth(date)} ${getYear(date)}`;

export const formatDate = (date: any) => `${formatWeekDay(date = toDate(date))}, ${getMonthDay(date)} ${formatMonth(date)} ${getYear(date)}`;

export const formatDateTime = (v: any) => {
  const date = toDate(v);
  return `${formatDate(date)} ${formatHours(date)}:${formatMinutes(date)}:${formatSeconds(date)}`;
};

export const formatShortDateTime = (v: any) => {
  const date = toDate(v);
  return `${formatShortDate(date)} ${formatHours(date)}:${formatMinutes(date)}`;
};