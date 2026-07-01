import { toInt } from "../cast/toNumber";
import { toStr } from "../cast/toString";
import { max } from "../number/max";

/**
 * Extracts the first dotted version number (e.g. "2.7.0") found in a string.
 * Requires at least one dot, so bare numbers like "5" won't match.
 */
export const extractVersion = (v: string | undefined | null): string => toStr(v).match(/\d+(?:\.\d+)+/)?.[0] || '';

/**
 * Returns true if `v` is a version >= `min`.
 * Missing trailing components are treated as 0 (so "2.7" >= "2.7.0").
 * Returns false if either string has no extractable version.
 */
export const versionGte = (v: string | undefined | null, min: string | undefined | null): boolean => {
  if (!v) return false;
  const vs = extractVersion(v);
  const ms = extractVersion(min);
  if (!vs || !ms) return false;
  const vp = vs.split('.').map(toInt);
  const mp = ms.split('.').map(toInt);
  const len = max(vp.length, mp.length);
  for (let i = 0; i < len; i++) {
    // pad missing components with 0 so shorter versions compare as their zero-extended form
    const vi = vp[i] || 0;
    const mi = mp[i] || 0;
    if (vi > mi) return true;
    if (vi < mi) return false;
  }
  // all compared components were equal
  return true;
};
