import { isArray } from '../check/isArray';
import { isDefined } from '../check/isDefined';
import { isDictionary } from '../check/isDictionary';
import { isUndefined } from '../check/isUndefined';

export const deleteBy = <T>(v: T): T => {
  if (isDictionary(v)) {
    for (const k in v) {
      if (isUndefined(v[k])) {
        delete v[k];
      }
    }
  } else if (isArray(v)) {
    return (v as any[]).filter(isDefined) as any;
  }
  return v;
};

export const deleteUndefined = deleteBy(isUndefined);
