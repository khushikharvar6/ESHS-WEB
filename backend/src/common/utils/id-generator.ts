/**
 * Generates sequential IDs for various entities.
 * Format: {PREFIX}-{YEAR}-{5-digit-sequence}
 * e.g. "INV-2026-00005", "APT-2026-00003", "INQ-2026-00001", "NC-2026-00001"
 */
export function generateSequentialId(
  prefix: string,
  sequenceNumber: number,
): string {
  const year = new Date().getFullYear();
  const padded = String(sequenceNumber).padStart(5, '0');
  return `${prefix}-${year}-${padded}`;
}

/**
 * Known prefixes used across the system
 */
export const ID_PREFIXES = {
  INVOICE: 'INV',
  APPOINTMENT: 'APT',
  INQUIRY: 'INQ',
  NON_CONFORMANCE: 'NC',
} as const;
