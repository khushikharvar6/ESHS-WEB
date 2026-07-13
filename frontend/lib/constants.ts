import {
  LayoutDashboard,
  PhoneCall,
  CalendarDays,
  UserPlus,
  Users,
  Receipt,
  MessageSquare,
  FolderCheck,
  ClipboardCheck,
  UserCog,
  type LucideIcon,
} from 'lucide-react'

export type NavItem = {
  title: string
  href: string
  icon: LucideIcon
}

/** Sidebar items */
export const NAV_ITEMS: NavItem[] = [
  { title: 'Dashboard', href: '/', icon: LayoutDashboard },
  { title: 'Inquiry', href: '/inquiry', icon: PhoneCall },
  { title: 'Appointment', href: '/appointment', icon: CalendarDays },
  { title: 'Registration', href: '/registration', icon: UserPlus },
  { title: 'Patients List', href: '/patient-profile', icon: Users },
  { title: 'Billing', href: '/billing', icon: Receipt },
  { title: 'Feedback', href: '/feedback', icon: MessageSquare },
  { title: 'MRD', href: '/mrd', icon: FolderCheck },
  { title: 'QA', href: '/qa', icon: ClipboardCheck },
  { title: 'User Management', href: '/user-management', icon: UserCog },
]

/** Shared services — used as a Select inside Inquiry, Appointment, Registration & Billing forms. */
export const SERVICES = [
  'Doctor Consultation',
  'Cardiology',
  'Pulmonology',
  'Radiology',
  'Pathology',
  'Sample Collection',
  'Dental',
  'Ophthalmology',
  'Home Healthcare',
  'Day Care',
  'Vaccination',
  'Physiotherapy',
] as const

export type Service = (typeof SERVICES)[number]

/** Base unit price (INR) per service, used to build billing line items. */
export const SERVICE_PRICES: Record<string, number> = {
  Pathology: 1200,
  Cardiology: 2500,
  Pulmonology: 2200,
  Radiology: 3500,
  'Doctor Consultation': 800,
  'Home Healthcare': 1800,
  Vaccination: 950,
  Dental: 1500,
  Ophthalmology: 1100,
  'Sample Collection': 400,
  'Day Care': 3000,
}

export const GST_RATE = 0.18

export const PAYMENT_MODES = ['UPI', 'Card', 'Cash', 'Insurance'] as const
export type PaymentMode = (typeof PAYMENT_MODES)[number]

export const SALUTATIONS = ['Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Master', 'Baby'] as const
export const GENDERS = ['Male', 'Female', 'Other'] as const
export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const
export const MARITAL_STATUSES = ['Single', 'Married', 'Divorced', 'Widowed'] as const
export const RELATIONSHIPS = ['Father', 'Mother', 'Husband', 'Wife', 'Son', 'Daughter', 'Brother', 'Sister', 'Friend', 'Relative', 'Other'] as const
export const PATIENT_CATEGORIES = ['Walk-In', 'Insurance', 'Corporate', 'Health Camp', 'Referral', 'Existing Patient'] as const
export const CARE_TYPES = ['OPD', 'Day Care'] as const
export const PRIORITIES = ['Routine', 'Urgent', 'Emergency'] as const
export const INQUIRY_SOURCES = [
  'Walk-in',
  'Phone',
  'Website',
  'Referral',
  'Camp',
  'Social Media',
] as const

export const PATIENT_JOURNEY = [
  'Inquiry',
  'Appointment',
  'Registration',
  'Diagnostics',
  'Billing',
  'MRD',
  'QA',
  'Feedback',
] as const

export type RoleKey = string

export type UserProfile = {
  name: string
  email: string
  role: string
  roleKey: string
  initials: string
}

export const USERS: UserProfile[] = [
  {
    name: 'Khushi Kharvar',
    email: 'khushi@eshs.in',
    role: 'Front Office Executive',
    roleKey: 'FRONT_DESK',
    initials: 'KK',
  },
  {
    name: 'Harsha Patel',
    email: 'harsha@eshs.in',
    role: 'Front Office Executive',
    roleKey: 'FRONT_DESK',
    initials: 'HP',
  },
  {
    name: 'Aniket Shah',
    email: 'aniket@eshs.in',
    role: 'OPD Coordinator',
    roleKey: 'OPD',
    initials: 'AS',
  },
  {
    name: 'Pinal Patel',
    email: 'pinal@eshs.in',
    role: 'QA Auditor',
    roleKey: 'QA',
    initials: 'PP',
  },
]

export function getLoggedInUser(): UserProfile {
  if (typeof window === 'undefined') return USERS[0]
  const email = window.localStorage.getItem('es-homs-user') || USERS[0].email
  const dbRole = window.localStorage.getItem('es-homs-role') || 'FRONT_DESK'
  const name = window.localStorage.getItem('es-homs-name') || USERS[0].name

  return {
    name,
    email,
    role: dbRole.replace('_', ' '),
    roleKey: dbRole,
    initials: name.substring(0, 2).toUpperCase(),
  }
}

export const CURRENT_USER = {
  get name() { return getLoggedInUser().name },
  get role() { return getLoggedInUser().role },
  get roleKey() { return getLoggedInUser().roleKey },
  get email() { return getLoggedInUser().email },
  get initials() { return getLoggedInUser().initials },
}

import { hasPermission, type Module } from './rbac'

export function isNavAllowed(title: string, roleKey: string): boolean {
  let moduleName: Module | null = null
  switch (title) {
    case 'Dashboard': moduleName = 'DASHBOARD'; break;
    case 'Inquiry': moduleName = 'INQUIRY'; break;
    case 'Appointment': moduleName = 'APPOINTMENT'; break;
    case 'Registration': moduleName = 'REGISTRATION'; break;
    case 'Patients List': moduleName = 'PATIENT_PROFILE'; break;
    case 'Billing': moduleName = 'BILLING'; break;
    case 'Feedback': moduleName = 'FEEDBACK'; break;
    case 'MRD': moduleName = 'MRD'; break;
    case 'QA': moduleName = 'QA'; break;
    case 'User Management': moduleName = 'USER_MANAGEMENT'; break;
  }
  
  if (!moduleName) return false
  return hasPermission(roleKey, moduleName, 'READ')
}

/** Centre contact details used across patient/billing messages. */
export const CENTRE = {
  name: 'ES Healthcare Centre',
  phone: '+917961616161',
}

export const APPOINTMENT_TYPES = [
  'New Visit',
  'Follow-up',
  'Tele-consult',
  'Emergency',
] as const

/** Document categories used across MRD, Patient Profile uploads and NCs. */
export const DOCUMENT_TYPES = [
  'ID Proof',
  'Prescription',
  'Consultation Notes',
  'Pathology Report',
  'Radiology Report',
  'Billing Invoice',
  'Vaccination Certificate',
  'Dental Report',
  'Ophthalmology Report',
  'Consent Form',
  'Home Healthcare Visit Notes',
  'Day Care Summary',
  'Other',
] as const

export type DocumentType = (typeof DOCUMENT_TYPES)[number]

export const DEPARTMENTS = [
  'Front Office',
  'Pathology',
  'Radiology',
  'Cardiology',
  'Pulmonology',
  'Dental',
  'Ophthalmology',
  'Pharmacy',
  'Home Healthcare',
  'Day Care',
  'MRD',
  'Nursing',
] as const

export const NC_SEVERITIES = ['Minor', 'Major', 'Critical'] as const
export const NC_STATUSES = ['Open', 'In Progress', 'Closed'] as const

export type FeedbackQuestion = {
  text: string
  /** rating = 5-point grid; text = blank lines; yesno = tick boxes. */
  kind: 'rating' | 'text' | 'yesno'
}

export type FeedbackSection = {
  /** Service name that triggers this section, or 'common' for always-included. */
  service: string
  title: string
  questions: FeedbackQuestion[]
}

/** Feedback questionnaire: common sections + one section per availed service. */
export const FEEDBACK_SECTIONS: FeedbackSection[] = [
  {
    service: 'common',
    title: 'Reception & Front Office',
    questions: [
      { text: 'Ease of booking your appointment / inquiry', kind: 'rating' },
      { text: 'Courtesy and helpfulness of front office staff', kind: 'rating' },
      { text: 'Waiting time before you were attended to', kind: 'rating' },
      { text: 'Clarity of information provided about your visit', kind: 'rating' },
    ],
  },
  {
    service: 'common',
    title: 'Facility & Cleanliness',
    questions: [
      { text: 'Overall cleanliness and hygiene of the premises', kind: 'rating' },
      { text: 'Comfort of the waiting area', kind: 'rating' },
      { text: 'Signage and ease of finding your way around', kind: 'rating' },
    ],
  },
  {
    service: 'common',
    title: 'Billing & Discharge',
    questions: [
      { text: 'Transparency and accuracy of billing', kind: 'rating' },
      { text: 'Time taken to complete billing formalities', kind: 'rating' },
      { text: 'Were the charges explained to your satisfaction?', kind: 'yesno' },
    ],
  },
  {
    service: 'Doctor Consultation',
    title: 'Doctor Consultation',
    questions: [
      { text: 'Doctor listened to your concerns carefully', kind: 'rating' },
      { text: 'Clarity of diagnosis and treatment explanation', kind: 'rating' },
      { text: 'Time the doctor spent with you', kind: 'rating' },
      { text: 'Were your questions answered satisfactorily?', kind: 'yesno' },
    ],
  },
  {
    service: 'Pathology',
    title: 'Pathology / Laboratory',
    questions: [
      { text: 'Comfort during sample collection', kind: 'rating' },
      { text: 'Turnaround time for receiving reports', kind: 'rating' },
      { text: 'Clarity of the report format', kind: 'rating' },
    ],
  },
  {
    service: 'Sample Collection',
    title: 'Sample Collection',
    questions: [
      { text: 'Comfort and hygiene during sample collection', kind: 'rating' },
      { text: 'Punctuality of the collection', kind: 'rating' },
    ],
  },
  {
    service: 'Radiology',
    title: 'Radiology / Imaging',
    questions: [
      { text: 'Explanation of the imaging procedure', kind: 'rating' },
      { text: 'Comfort during the scan', kind: 'rating' },
      { text: 'Timeliness of imaging reports', kind: 'rating' },
    ],
  },
  {
    service: 'Cardiology',
    title: 'Cardiology',
    questions: [
      { text: 'Thoroughness of the cardiac assessment', kind: 'rating' },
      { text: 'Explanation of your heart health and next steps', kind: 'rating' },
    ],
  },
  {
    service: 'Pulmonology',
    title: 'Pulmonology',
    questions: [
      { text: 'Thoroughness of the respiratory assessment', kind: 'rating' },
      { text: 'Explanation of your condition and treatment', kind: 'rating' },
    ],
  },
  {
    service: 'Dental',
    title: 'Dental Care',
    questions: [
      { text: 'Comfort during the dental procedure', kind: 'rating' },
      { text: 'Explanation of dental treatment and aftercare', kind: 'rating' },
    ],
  },
  {
    service: 'Ophthalmology',
    title: 'Ophthalmology',
    questions: [
      { text: 'Thoroughness of the eye examination', kind: 'rating' },
      { text: 'Clarity of vision advice and prescription', kind: 'rating' },
    ],
  },
  {
    service: 'Vaccination',
    title: 'Vaccination',
    questions: [
      { text: 'Comfort during vaccination', kind: 'rating' },
      { text: 'Guidance on post-vaccination care', kind: 'rating' },
      { text: 'Did you receive your vaccination certificate?', kind: 'yesno' },
    ],
  },
  {
    service: 'Home Healthcare',
    title: 'Home Healthcare',
    questions: [
      { text: 'Punctuality of the home visit', kind: 'rating' },
      { text: 'Professionalism of the visiting staff', kind: 'rating' },
      { text: 'Quality of care provided at home', kind: 'rating' },
    ],
  },
  {
    service: 'Day Care',
    title: 'Day Care',
    questions: [
      { text: 'Comfort of the day care facility', kind: 'rating' },
      { text: 'Attentiveness of nursing staff', kind: 'rating' },
      { text: 'Clarity of the day care summary provided', kind: 'rating' },
    ],
  },
]

/**
 * Maps a service to the documents expected for a compliant patient file.
 * "ID Proof" is implicitly required for every patient (added by the store).
 */
export const SERVICE_DOCUMENT_MAP: Record<string, DocumentType[]> = {
  'Doctor Consultation': ['Consultation Notes', 'Prescription'],
  Pathology: ['Pathology Report'],
  'Sample Collection': ['Pathology Report'],
  Radiology: ['Radiology Report'],
  Cardiology: ['Consultation Notes', 'Radiology Report'],
  Pulmonology: ['Consultation Notes', 'Radiology Report'],
  Vaccination: ['Vaccination Certificate'],
  Dental: ['Dental Report', 'Prescription'],
  Ophthalmology: ['Ophthalmology Report', 'Prescription'],
  'Home Healthcare': ['Home Healthcare Visit Notes', 'Consent Form'],
  'Day Care': ['Day Care Summary', 'Consent Form'],
}

/** Which department is responsible for producing / verifying a document type. */
export const DOCUMENT_DEPARTMENT_MAP: Record<string, string> = {
  'ID Proof': 'Front Office',
  'Consent Form': 'Front Office',
  Prescription: 'Pharmacy',
  'Consultation Notes': 'Front Office',
  'Pathology Report': 'Pathology',
  'Radiology Report': 'Radiology',
  'Vaccination Certificate': 'Nursing',
  'Dental Report': 'Dental',
  'Ophthalmology Report': 'Ophthalmology',
  'Home Healthcare Visit Notes': 'Home Healthcare',
  'Day Care Summary': 'Day Care',
  'Billing Invoice': 'Front Office',
  Other: 'MRD',
}
