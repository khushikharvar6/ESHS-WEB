export type StatusTone = 'success' | 'warning' | 'error' | 'info' | 'neutral'

export type Inquiry = {
  id: string
  name: string
  phone: string
  source: string
  service: string
  priority: 'Routine' | 'Urgent' | 'Emergency'
  status: 'New' | 'In Progress' | 'Converted' | 'Closed'
  followUp: string
}

export const inquiries: Inquiry[] = []

export type Appointment = {
  id: string
  patient: string
  doctor: string
  service: string
  date: string
  time: string
  status: 'Scheduled' | 'Confirmed' | 'Completed' | 'Cancelled' | 'No Show'
}

export const appointments: Appointment[] = []

export const DOCTORS = [
  'Dr. Anand Gadhvi',
  'Dr. Nidhi Desai',
  'Dr. Vidhi Shukla',
  'Dr. Narendra Shah',
  'Dr. Jyoti Shah',
] as const

export type QueueRow = {
  token: string
  patient: string
  uhid: string
  service: string
  stage: string
  status: 'Waiting' | 'In Consult' | 'In Diagnostics' | 'Billing' | 'Done'
  waitTime: string
}

export const todaysQueue: QueueRow[] = []

export type Invoice = {
  id: string
  patient: string
  subtotal: number
  tax: number
  total: number
  paid: number
  balance: number
  status: 'Pending' | 'Partially Paid' | 'Paid'
}

export const invoices: Invoice[] = []

export type Feedback = {
  id: string
  patient: string
  service: string
  rating: number
  comments: string
  date: string
}

export const feedbacks: Feedback[] = []

export type MrdDocument = {
  type: string
  mandatory: boolean
  status: 'Verified' | 'Pending' | 'Missing' | 'Rejected'
  updatedBy: string
  updatedOn: string
}

export const mrdDocuments: MrdDocument[] = []

export type Audit = {
  id: string
  department: string
  date: string
  score: number
  status: 'Open' | 'In Review' | 'Closed' | 'Non-Compliant'
}

export const audits: Audit[] = []

export const notifications = []
