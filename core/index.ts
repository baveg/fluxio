// Example utility function
export function add(a: number, b: number): number {
  return a + b;
}

export function multiply(a: number, b: number): number {
  return a * b;
}

// Re-export type utilities
export type { DeepPartial, Nullable } from './types';
