import type { Patient } from '@/lib/types'

export const patientsApi = {
  list: async (): Promise<Patient[]> => [],
  get: async (_uhid: string): Promise<Patient | null> => null,
  create: async (payload: Partial<Patient>): Promise<Patient> => payload as Patient,
  update: async (_uhid: string, payload: Partial<Patient>): Promise<Patient> => payload as Patient,
}
