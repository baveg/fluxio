import { RgbColor, HslColor } from './types';

export const stringToColor = (color: string): RgbColor | HslColor => {
  const p = color.split(/[\s,\(\)%#]+/);

  if (p[0] === '') p.shift();

  const f = p[0] || ([] as string[]);
  const l = f.length;

  if (l === 6 || l === 8) {
    // #RRGGBB or #RRGGBBAA
    return {
      r: pInt16(f[0]! + f[1]!),
      g: pInt16(f[2]! + f[3]!),
      b: pInt16(f[4]! + f[5]!),
      a: l === 8 ? pInt16(f[6]! + f[7]!) / 255 : 1,
    };
  } else if (l === 3 || l === 4) {
    // #RGB or #RGBA
    if (color.match(/rgb/i)) {
      // rgba(255, 0, 0, 0.5)
      return {
        r: pFloat(p[1]!),
        g: pFloat(p[2]!),
        b: pFloat(p[3]!),
        a: p[4] ? pFloat(p[4]) : 1,
      };
    } else if (color.match(/hsl/i)) {
      // hsla(120, 100%, 50%, 0.3)
      return {
        h: pFloat(p[1]!),
        s: pFloat(p[2]!),
        l: pFloat(p[3]!),
        a: p[4] ? pFloat(p[4]) : 1,
      };
    }
    return {
      r: pInt16(f[0]! + f[0]!),
      g: pInt16(f[1]! + f[1]!),
      b: pInt16(f[2]! + f[2]!),
      a: l === 4 ? pInt16(f[3]! + f[3]!) / 255 : 1,
    };
  }

  throw new Error('no string color');
};
