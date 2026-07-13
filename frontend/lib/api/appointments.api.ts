import type { Appointment } from '@/lib/types'

export const appointmentsApi = {
  list: async (): Promise<Appointment[]> => [],
  create: async (payload: Partial<Appointment>): Promise<Appointment> => payload as Appointment,
  update: async (_id: string, payload: Partial<Appointment>): Promise<Appointment> => payload as Appointment,
}
