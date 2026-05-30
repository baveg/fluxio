export class TimeoutError extends Error {
  constructor(name: string) {
    super(`${name} timeout`);
  }
}

export const timeoutError = (name: string) => new TimeoutError(name);
