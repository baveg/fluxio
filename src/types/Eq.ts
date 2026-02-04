export type Eq<A, B> =
  (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2)
    ? true
    : false;

export type CheckEq<A, B> = Eq<A, B> extends true
  ? true
  : ['Types differ', 'Only in A:', Exclude<keyof A, keyof B>, 'Only in B:', Exclude<keyof B, keyof A>];
