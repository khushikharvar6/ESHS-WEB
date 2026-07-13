import type { Inquiry } from '@/lib/types'

export const inquiriesApi = {
  list: async (): Promise<Inquiry[]> => [],
  create: async (payload: Partial<Inquiry>): Promise<Inquiry> => payload as Inquiry,
  update: async (_id: string, payload: Partial<Inquiry>): Promise<Inquiry> => payload as Inquiry,
}
