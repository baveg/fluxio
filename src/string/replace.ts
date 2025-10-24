/**
 * @param val
 * @param replaceBySearch
 * @returns
 * @example replace("toto tututoto b!", { toto: 5, b: 'ok' }) => "5 tutu5 ok!"
 */
export const replace = (val: string, replaceBySearch: Record<string, any>): string => {
  val = String(val);
  if ((val as any).replaceAll) {
    for (const key in replaceBySearch)
      val = (val as any).replaceAll(key, replaceBySearch[key] as string);
    return val;
  }
  for (const key in replaceBySearch)
    val = val.replace(
      new RegExp(key.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1'), 'g'),
      replaceBySearch[key]
    );
  return val;
};
