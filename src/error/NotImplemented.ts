export class NotImplemented extends Error {
  constructor(name: string) {
    super(name ? `${name} is not implemented` : 'not implemented');
  }
}

export const notImplemented = (name: string) => new NotImplemented(name);
