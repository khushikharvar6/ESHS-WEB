import type { BillingInvoice, BillingItem } from '@/lib/types'

export const billingApi = {
  list: async (): Promise<BillingInvoice[]> => [],
  create: async (payload: { invoice: Partial<BillingInvoice>; items: BillingItem[] }): Promise<BillingInvoice> => payload.invoice as BillingInvoice,
  update: async (_id: string, payload: Partial<BillingInvoice>): Promise<BillingInvoice> => payload as BillingInvoice,
}
