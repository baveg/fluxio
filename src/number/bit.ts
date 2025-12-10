import { Bit, Bits } from "fluxio/types";

export const setBit = (bits: Bits, index: number, value: Bit): Bits => value ? bits | (1 << index) : bits & ~(1 << index);

export const getBit = (bits: Bits, index: number): Bit => (bits & (1 << index)) !== 0 ? 1 : 0;

export const toggleBit = (bits: Bits, index: number): Bits => bits ^ (1 << index);

export const bitsToArray = (bits: Bits, length: number = 32): Bit[] => {
  const result: Bit[] = [];
  for (let i = 0; i < length; i++) {
    result[i] = (bits & (1 << i)) !== 0 ? 1 : 0;
  }
  return result;
};

export const arrayToBits = (bits: Bit[]): Bits => {
  let result = 0;
  for (let i = 0; i < bits.length; i++) {
    if (bits[i]) {
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

export const invertBits = (bits: Bits, length: number = 32): Bits => 
    (~bits) & ((1 << length) - 1);