export class TypeError extends Error {
  constructor(prop?: string, type?: string) {
    super(`${prop || 'property'} is not ${type || 'valid'}`);
  }
}

export const typeError = (prop: string, type: string) => new TypeError(prop, type);
