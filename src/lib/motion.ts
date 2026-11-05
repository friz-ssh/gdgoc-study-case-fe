/**
 * Pure animation helpers. Kept out of any "use client" module so they can be
 * called from Server Components as well as Client Components.
 */

/** Staggered delay helper so grids animate in sequence without long waits. */
export function stagger(index: number, step = 0.07, max = 0.35): number {
  return Math.min(index * step, max);
}
