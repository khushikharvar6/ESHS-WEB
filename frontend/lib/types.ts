export interface Patient {
  uhid: string
  salutation?: string
  name: string
  age: number
  dob?: string
  gender?: string
  bloodGroup?: string
  phone: string
  email?: string
  address?: string
  city?: string
  state?: string
  pincode?: string
  emergencyName?: string
  emergencyRelationship?: string
  emergencyPhone?: string
  patientCategory?: string
  careType?: string
  service: string
  registeredOn?: string
  lastVisit?: string
  status?: 'Active' | 'Inactive'
  initials?: string
  inquiryId?: string
  appointmentId?: string
}

export interface Inquiry {
  id: string
  name: string
  phone: string
  email?: string
  service: string
  source: string
  priority: 'Routine' | 'Urgent' | 'Emergency'
  status: 'New' | 'In Progress' | 'Converted' | 'Lost'
  followUp: string
  notes?: string
  appointmentId?: string
}

export interface Appointment {
  id: string
  patient: string
  phone: string
  email?: string
  doctor: string
  service: string
  date: string
  time: string
  type: string
  notes?: string
  status: 'Scheduled' | 'Confirmed' | 'Checked In' | 'Registered' | 'Completed' | 'Cancelled' | 'No Show'
  inquiryId?: string
  uhid?: string
}

export interface BillingItem {
  service: string
  qty: number
  unitPrice: number
  amount: number
}

export interface BillingInvoice {
  id: string
  uhid?: string
  patient: string
  service: string
  date: string
  subtotal: number
  tax: number
  discount: number
  total: number
  paid: number
  balance: number
  status: 'Draft' | 'Pending' | 'Partially Paid' | 'Paid'
  paymentMode?: string
  transactionId?: string
  remarks?: string
}

export interface ServiceMaster {
  id: string
  name: string
  price: number
  category?: string
}

export interface DocumentUpload {
  id: string
  uhid: string
  name: string
  type: string
  uploadedBy: string
  uploadedOn: string
  verified: boolean
}

export interface Feedback {
  id: string
  patient: string
  service: string
  rating: number
  comments: string
  date: string
}

export interface NotificationItem {
  id: number
  title: string
  detail: string
  time: string
  type: 'info' | 'warning' | 'success' | 'error'
  href: string
  module: string
}

export interface NCRecord {
  id: string
  uhid: string
  patient: string
  relatedDocument: string
  department: string
  severity: 'Minor' | 'Major' | 'Critical'
  status: 'Open' | 'In Progress' | 'Closed'
  dueDate: string
  assignedTo: string
  description?: string
  rootCause?: string
}
