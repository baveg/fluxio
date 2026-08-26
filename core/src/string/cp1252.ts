
export const toCp1252 = (text: string): Uint8Array => {
  const bytes: number[] = [];

  for (const char of text) {
    const code = char.codePointAt(0)!;

    // ASCII
    if (code <= 0x7f) {
      bytes.push(code);
      continue;
    }

    // CP1252 special characters
    const special: Record<number, number> = {
      0x20ac: 0x80, // €
      0x201a: 0x82,
      0x192: 0x83,
      0x201e: 0x84,
      0x2026: 0x85,
      0x2020: 0x86,
      0x2021: 0x87,
      0x2c6: 0x88,
      0x2030: 0x89,
      0x160: 0x8a,
      0x2039: 0x8b,
      0x152: 0x8c,
      0x17d: 0x8e,
      0x2018: 0x91,
      0x2019: 0x92,
      0x201c: 0x93,
      0x201d: 0x94,
      0x2022: 0x95,
      0x2013: 0x96,
      0x2014: 0x97,
      0x2dc: 0x98,
      0x2122: 0x99,
      0x161: 0x9a,
      0x203a: 0x9b,
      0x153: 0x9c,
      0x17e: 0x9e,
      0x178: 0x9f,
    };

    if (special[code] !== undefined) {
      bytes.push(special[code]);
      continue;
    }

    // Latin-1 / CP1252
    if (code <= 0xff) {
      bytes.push(code);
      continue;
    }

    // Caractère non représentable
    bytes.push(0x3f); // ?
  }

  return new Uint8Array(bytes);
}
