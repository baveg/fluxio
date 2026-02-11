/**
 * SHA-256 hash function with fallback for older browsers.
 *
 * Fallback implementation adapted from:
 * Chris Veness - SHA-256 (FIPS 180-4) implementation in JavaScript
 * https://www.movable-type.co.uk/scripts/sha256.html
 * https://github.com/chrisveness/crypto
 * MIT Licence - (c) Chris Veness 2002-2019
 */

export const sha256 = async (message: string): Promise<string> => {
  if (typeof crypto !== 'undefined' && crypto.subtle?.digest) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  return sha256Pure(message);
};

const utf8Encode = (str: string): string => {
  try {
    return new TextEncoder()
      .encode(str)
      .reduce((prev, curr) => prev + String.fromCharCode(curr), '');
  } catch {
    return unescape(encodeURIComponent(str));
  }
};

const ROTR = (n: number, x: number) => (x >>> n) | (x << (32 - n));
const Sigma0 = (x: number) => ROTR(2, x) ^ ROTR(13, x) ^ ROTR(22, x);
const Sigma1 = (x: number) => ROTR(6, x) ^ ROTR(11, x) ^ ROTR(25, x);
const sigma0 = (x: number) => ROTR(7, x) ^ ROTR(18, x) ^ (x >>> 3);
const sigma1 = (x: number) => ROTR(17, x) ^ ROTR(19, x) ^ (x >>> 10);
const Ch = (x: number, y: number, z: number) => (x & y) ^ (~x & z);
const Maj = (x: number, y: number, z: number) => (x & y) ^ (x & z) ^ (y & z);

const K = [
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
] as const;

const H0 = [
  0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
] as const;

const sha256Pure = (message: string): string => {
  const msg = utf8Encode(message);

  // Pre-processing: adding padding bits [§5.1.1]
  const msgWithBit = msg + String.fromCharCode(0x80);
  const l = msgWithBit.length / 4 + 2;
  const N = Math.ceil(l / 16);
  const M: number[][] = new Array(N);

  for (let i = 0; i < N; i++) {
    M[i] = new Array<number>(16);
    for (let j = 0; j < 16; j++) {
      M[i]![j] =
        (msgWithBit.charCodeAt(i * 64 + j * 4) << 24) |
        (msgWithBit.charCodeAt(i * 64 + j * 4 + 1) << 16) |
        (msgWithBit.charCodeAt(i * 64 + j * 4 + 2) << 8) |
        msgWithBit.charCodeAt(i * 64 + j * 4 + 3);
    }
  }

  // Append length in bits as 64-bit big-endian [§5.1.1]
  const lenHi = (msg.length * 8) / Math.pow(2, 32);
  const lenLo = (msg.length * 8) >>> 0;
  M[N - 1]![14] = Math.floor(lenHi);
  M[N - 1]![15] = lenLo;

  // Hash computation [§6.2.2]
  const H = [...H0] as number[];

  for (let i = 0; i < N; i++) {
    const W = new Array<number>(64);

    for (let t = 0; t < 16; t++) W[t] = M[i]![t]!;
    for (let t = 16; t < 64; t++) {
      W[t] = (sigma1(W[t - 2]!) + W[t - 7]! + sigma0(W[t - 15]!) + W[t - 16]!) >>> 0;
    }

    let a = H[0]!,
      b = H[1]!,
      c = H[2]!,
      d = H[3]!;
    let e = H[4]!,
      f = H[5]!,
      g = H[6]!,
      h = H[7]!;

    for (let t = 0; t < 64; t++) {
      const T1 = h + Sigma1(e) + Ch(e, f, g) + K[t]! + W[t]!;
      const T2 = Sigma0(a) + Maj(a, b, c);
      h = g;
      g = f;
      f = e;
      e = (d + T1) >>> 0;
      d = c;
      c = b;
      b = a;
      a = (T1 + T2) >>> 0;
    }

    H[0] = (H[0]! + a) >>> 0;
    H[1] = (H[1]! + b) >>> 0;
    H[2] = (H[2]! + c) >>> 0;
    H[3] = (H[3]! + d) >>> 0;
    H[4] = (H[4]! + e) >>> 0;
    H[5] = (H[5]! + f) >>> 0;
    H[6] = (H[6]! + g) >>> 0;
    H[7] = (H[7]! + h) >>> 0;
  }

  return H.map((v) => ('00000000' + v.toString(16)).slice(-8)).join('');
};
