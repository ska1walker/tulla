import { format, parseISO, isValid } from 'date-fns';
import { de } from 'date-fns/locale';

interface FirestoreTimestamp {
  seconds: number;
  nanoseconds?: number;
}

/**
 * Convert various date formats to Date object
 * Handles: Firestore timestamps, ISO strings, Date objects
 */
export function toDate(d: unknown): Date | null {
  if (!d) return null;

  // Firestore timestamp
  if (typeof d === 'object' && d !== null && 'seconds' in d) {
    const timestamp = d as FirestoreTimestamp;
    return new Date(timestamp.seconds * 1000);
  }

  // Already a Date
  if (d instanceof Date) {
    return isValid(d) ? d : null;
  }

  // String or number
  try {
    const parsed = typeof d === 'string' ? parseISO(d) : new Date(d as number);
    return isValid(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * Format date with German locale
 */
export function fmtDate(d: unknown, formatStr: string): string {
  const date = toDate(d);
  return date ? format(date, formatStr, { locale: de }) : '';
}
