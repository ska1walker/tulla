/**
 * Format number as EUR currency with German locale
 */
export function fmtCurrency(val: number | string | undefined): string {
  const num = Number(val);
  return isNaN(num)
    ? '0 €'
    : new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 0
      }).format(num);
}

/**
 * Safely convert to number with fallback
 */
export function safeNum(v: unknown): number {
  return Number(v) || 0;
}
