import { toNumber } from 'fluxio/cast';
import { Bits, Dictionary } from 'fluxio/types';

export const setBit = (bits: Bits, index: number, value: boolean): Bits =>
  value ? bits | (1 << index) : bits & ~(1 << index);

export const getBit = (bits: Bits, index: number): boolean => (bits & (1 << index)) !== 0;

export const toggleBit = (bits: Bits, index: number): Bits => bits ^ (1 << index);

export const bitsToArray = (bits: Bits, length: number = 32): boolean[] => {
  const result: boolean[] = [];
  for (let i = 0; i < length; i++) {
    result[i] = (bits & (1 << i)) !== 0;
  }
  return result;
};

export const arrayToBits = (bits: (0 | 1 | boolean)[]): Bits => {
  let result = 0;
  for (let i = 0; i < bits.length; i++) {
    if (bits[i]) {
      result |= 1 << i;
    }
  }
  return result;
};

export const bitsToRecord = (bits: Bits, length: number = 32): Record<number, boolean> => {
  const result: Dictionary<true> = {};
  for (let i = 0; i < length; i++) {
    if ((bits & (1 << i)) !== 0) {
      result[i] = true;
    }
  }
  return result;
};

export const recordToBits = (record: Record<number, 0 | 1 | boolean>): Bits => {
  let result = 0;
  for (const key in record) {
    const i = parseInt(key);
    if (record[key]) {
      result |= 1 << i;
    }
  }
  return result;
};

export const countBits = (bits: Bits, length: number = 32): number => {
  let count = 0;
  for (let i = 0; i < length; i++) {
    if (getBit(bits, i)) count++;
  }
  return count;
};

export const invertBits = (bits: Bits, length: number = 32): Bits => ~bits & ((1 << length) - 1);
