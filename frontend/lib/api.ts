export type DashboardSummary = {
  patients: number
  appointments: number
  inquiries: number
  invoices: number
  documents: number
  openNcs: number
  collected: number
  outstanding: number
}

export type HealthSummary = DashboardSummary & {
  status: string
  database: string
}

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    cache: 'no-store',
    ...init,
  })

  if (!response.ok) {
    throw new Error(`Request failed with ${response.status}`)
  }

  return response.json() as Promise<T>
}

export function getDashboardSummary() {
  return requestJson<DashboardSummary>('/api/dashboard')
}

export function getHealthStatus() {
  return requestJson<HealthSummary>('/api/health')
}

export function getPatients() {
  return requestJson<Array<Record<string, unknown>>>('/api/patients')
}

export function getAppointments() {
  return requestJson<Array<Record<string, unknown>>>('/api/appointments')
}

export function getInquiries() {
  return requestJson<Array<Record<string, unknown>>>('/api/inquiries')
}

export function getInvoices() {
  return requestJson<Array<Record<string, unknown>>>('/api/invoices')
}

export function getDocuments() {
  return requestJson<Array<Record<string, unknown>>>('/api/documents')
}

export function getConsultations() {
  return requestJson<Array<Record<string, unknown>>>('/api/consultations')
}

export function getNcs() {
  return requestJson<Array<Record<string, unknown>>>('/api/ncs')
}

export function createResource<T>(resource: string, payload: unknown) {
  return requestJson<T>(`/api/${resource}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

export function updateResource<T>(resource: string, id: string, patch: unknown) {
  return requestJson<T>(`/api/${resource}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, patch }),
  })
}

export function deleteResource(resource: string, id: string) {
  return requestJson<{ deleted: boolean }>(`/api/${resource}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  })
}
