import type { BillingInvoice, BillingInvoiceItem, BillingPatient } from '../types/billing.types'

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, { cache: 'no-store', ...init })
  if (!response.ok) throw new Error(`Request failed with ${response.status}`)
  return response.json() as Promise<T>
}

export const billingApi = {
  getInvoices: async (): Promise<BillingInvoice[]> =>
    requestJson<BillingInvoice[]>('/api/invoices'),

  createInvoice: async (invoice: BillingInvoice): Promise<BillingInvoice> =>
    requestJson<BillingInvoice>('/api/invoices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invoice),
    }),

  saveDraft: async (invoice: BillingInvoice): Promise<BillingInvoice> =>
    requestJson<BillingInvoice>('/api/invoices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...invoice, paymentStatus: 'Draft' }),
    }),

  addPayment: async (invoiceId: string, amount: number, mode: string, reference: string) =>
    requestJson<{ success: boolean }>('/api/invoices', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: invoiceId, patch: { amountReceived: amount, paymentMode: mode, transactionReference: reference } }),
    }),

  shareInvoice: async (invoiceId: string, method: 'sms' | 'whatsapp' | 'email') => ({
    success: true,
    invoiceId,
    method,
  }),

  getPricingItems: async (): Promise<{ services: unknown[]; tests: unknown[]; packages: unknown[] }> =>
    requestJson('/api/billing/items'),

  getPatients: async (): Promise<BillingPatient[]> => {
    const raw = await requestJson<Array<Record<string, unknown>>>('/api/patients')
    return raw.map((p) => ({
      id: String(p.id ?? p.uhid ?? ''),
      uhid: String(p.uhid ?? ''),
      name: String(p.name ?? ''),
      age: Number(p.age ?? 0),
      gender: String(p.gender ?? ''),
      phone: String(p.phone ?? ''),
      email: p.email ? String(p.email) : undefined,
      servicesTaken: Array.isArray(p.services) && p.services.length > 0 ? (p.services as string[]) : (p.service ? [String(p.service)] : []),
    }))
  },
}

export function createBillingPatient(overrides: Partial<BillingPatient> = {}): BillingPatient {
  return {
    id: overrides.id ?? 'patient-1',
    uhid: overrides.uhid ?? 'ESHS2025-15550',
    name: overrides.name ?? 'Khushi Jayeshkumar Kharvar',
    age: overrides.age ?? 22,
    gender: overrides.gender ?? 'Female',
    phone: overrides.phone ?? '+91 98765 43210',
    email: overrides.email ?? 'khushi@example.com',
    servicesTaken: overrides.servicesTaken ?? ['Doctor Consultation', 'Pathology'],
  }
}

export function createInvoiceItem(item: Omit<BillingInvoiceItem, 'id'>): BillingInvoiceItem {
  return {
    ...item,
    id: `${item.itemName}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  }
}
