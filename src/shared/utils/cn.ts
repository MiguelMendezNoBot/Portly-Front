/**
 * Tiny className merger — no dependencies needed.
 * Úsalo para combinar clases Tailwind condicionalmente.
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
