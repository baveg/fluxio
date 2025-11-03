export const first = <T extends ArrayLike<any> | null | undefined>(
  items?: T
): T extends ArrayLike<infer U> ? U | undefined : undefined => items?.[0] as any;
