export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface Logger {
  d: (...args: any[]) => void;
  i: (...args: any[]) => void;
  w: (...args: any[]) => void;
  e: (...args: any[]) => void;
}

export const getLogIcon = (level: LogLevel) =>
  level === 'warn' ? '⚠️'
  : level === 'error' ? '❌'
  : '';

let log = (name: string, level: LogLevel, args: any[]) => {
  if (typeof console === 'object' && level in console) {
    const icon = getLogIcon(level);
    if (icon) {
      console[level](icon, name, ...args);
    } else {
      console[level](name, ...args);
    }
  }
};

export const setLog = (value: typeof log) => {
  log = value;
};

const counts: Record<string, number> = {};

export const logger = (tag: string): Logger => {
  const count = (counts[tag] = (counts[tag] || 0) + 1);

  const name = count === 1 ? `[${tag}]` : `[${tag}${count}]`;
  const l =
    (level: LogLevel) =>
    (...args: any[]) =>
      log(name, level, args);

  return { d: l('debug'), i: l('info'), w: l('warn'), e: l('error') };
};

const n = () => {};

export const voidLogger = { d: n, i: n, w: n, e: n };

export const globalLogger = logger('global');