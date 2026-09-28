/** Rounds to the nearest cent to avoid floating point noise (e.g. 4.999999). */
export function roundCents(n: number): number {
  return Math.round(n * 100) / 100;
}
