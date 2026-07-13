/**
 * Generates UHID in format: ESHS{YEAR}-{5-digit-sequence}
 * e.g. "ESHS2026-00001"
 */
export function generateUhid(sequenceNumber: number): string {
  const year = new Date().getFullYear();
  const padded = String(sequenceNumber).padStart(5, '0');
  return `ESHS${year}-${padded}`;
}

