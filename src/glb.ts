export const glb = (
  typeof globalThis !== 'undefined' ? globalThis
  : typeof window !== 'undefined' ? window
    // eslint-disable-next-line no-undef
    // @ts-ignore: `global` exists in Node.js but not in browser typings
  : typeof global !== 'undefined' ? global
  : {}) as typeof window & { [name: string]: any };
