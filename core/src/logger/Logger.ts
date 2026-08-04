export type LogLevel = 'd' | 'i' | 'w' | 'e';

export interface Logger {
  (...args: any[]): void;
  d(...args: any[]): void;
  i(...args: any[]): void;
  w(...args: any[]): void;
  e(...args: any[]): void;
}

export const logLevelMap = {
  d: 'debug',
  i: 'info',
  w: 'warn',
  e: 'error',
} as const;

export const logToConsole = (tag: string, level: LogLevel, ...args: any[]) => {
  (console as any)[logLevelMap[level]](tag, ...args);
};

let _log = logToConsole;
export const setLog = (value: typeof _log) => { _log = value };

export const rawLog = (tag: string, level: LogLevel, ...args: any[]) => _log(tag, level, ...args);

const fun = (tag: string, level: LogLevel) => {
  return (...args: any[]) => _log(tag, level, ...args);
}

export const logger = (tag: string): Logger => {
  const d = fun(tag, 'd') as Logger;
  d.d = d;
  d.i = fun(tag, 'i');
  d.w = fun(tag, 'w');
  d.e = fun(tag, 'e');
  return d;
}

export const log = logger('');