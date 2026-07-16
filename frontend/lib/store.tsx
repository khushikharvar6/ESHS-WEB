'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  SERVICE_DOCUMENT_MAP,
  DOCUMENT_DEPARTMENT_MAP,
  CURRENT_USER,
  type DocumentType,
} from '@/lib/constants'
import {
  createResource as apiCreateResource,
  deleteResource as apiDeleteResource,
  getAppointments as apiGetAppointments,
  getConsultations as apiGetConsultations,
  getDocuments as apiGetDocuments,
  getInvoices as apiGetInvoices,
  getNcs as apiGetNcs,
  getPatients as apiGetPatients,
  getInquiries as apiGetInquiries,
  updateResource as apiUpdateResource,
} from '@/lib/api'

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type InquiryStatus = 'New' | 'In Progress' | 'Converted' | 'Lost'

export type Inquiry = {
  id: string
  firstName: string
  lastName: string
  phone: string
  email?: string
  service: string
  source: string
  priority: 'Routine' | 'Urgent' | 'Emergency'
  status: InquiryStatus
  followUp: string
  notes?: string
  appointmentId?: string
}

export type AppointmentStatus =
  | 'Scheduled'
  | 'Confirmed'
  | 'Checked In'
  | 'Registered'
  | 'Completed'
  | 'Cancelled'
  | 'No Show'

export type Appointment = {
  id: string
  firstName: string
  lastName: string
  phone: string
  email?: string
  doctor: string
  service: string
  date: string
  time: string
  type: string
  notes?: string
  status: AppointmentStatus
  inquiryId?: string
  uhid?: string
}

export type Patient = {
  uhid: string
  salutation: string
  firstName: string
  middleName?: string
  lastName: string
  name: string // Virtual field for UI
  age: number
  dob?: string
  gender: string
  bloodGroup?: string
  maritalStatus?: string
  mobileNo: string
  phone: string // Virtual field for UI
  alternateMobile?: string
  emailAddress?: string
  email?: string
  residentialAddress?: string
  address?: string // Virtual field for UI
  city?: string
  state?: string
  country?: string
  pincode?: string
  emergencyContactName?: string
  emergencyName?: string
  emergencyContact?: string
  emergencyRelationship?: string
  emergencyPhoneNumber?: string
  emergencyPhone?: string
  patientCategory?: string
  careType?: string
  assignedDepartmentServices?: string
  service: string
  insuranceProvider?: string
  policyNumber?: string
  tpaNetwork?: string
  insuranceContact?: string
  insuranceNotes?: string
  companyName?: string
  corporateId?: string
  employeeId?: string
  companyContact?: string
  corporateAddress?: string
  registeredOn: string
  lastVisit: string
  status: string
  initials: string
  inquiryId?: string
  appointmentId?: string
  vip: boolean
  assignedDepartment?: string
  id?: string
  createdAt?: string
  updatedAt?: string
  updatedBy?: string
} & AuditMeta

export type AuditMeta = {
  updatedBy?: string
  updatedAt?: string
}

export type Consultation = {
  id: string
  uhid: string
  patientId?: string
  doctor: string
  service: string
  date: string
  vitals?: {
    bp?: string
    pulse?: string
    temp?: string
    weight?: string
  }
  chiefComplaint: string
  diagnosis: string
  treatmentNotes?: string
  prescription?: string
  medicines?: Array<{
    name: string
    dosage: string
    duration: string
    instructions: string
  }>
  advice?: string
  followUp?: string
  files: string[]
  createdAt?: string
} & AuditMeta

export type InvoiceStatus = 'Draft' | 'Pending' | 'Partially Paid' | 'Paid'

export type InvoiceItem = {
  id?: string
  invoiceId?: string
  itemName: string
  department?: string
  qty: number
  price: number
  total: number
}

export type Invoice = {
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
  status: InvoiceStatus
  paymentMode?: string
  transactionId?: string
  remarks?: string
  items?: InvoiceItem[]
} & AuditMeta

export type PatientDocument = {
  id: string
  uhid: string
  patientName: string
  name: string
  type: DocumentType | string
  fileSize?: number
  storagePath?: string
  uploadedBy: string
  uploadedOn: string
  verified: boolean
  fileUrl?: string
} & AuditMeta

export type NcStatus = 'Open' | 'In Progress' | 'Closed'

export type NonConformance = {
  id: string
  uhid: string
  patient: string
  relatedDocument: string
  department: string
  severity: 'Minor' | 'Major' | 'Critical'
  status: NcStatus
  dueDate: string
  assignedTo: string
  description?: string
  rootCause?: string
  title?: string
  createdAt?: string
} & AuditMeta

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

export const DOCTORS = [
  'Dr. Anand Gadhvi',
  'Dr. Nidhi Desai',
  'Dr. Vidhi Shukla',
  'Dr. Narendra Shah',
  'Dr. Jyoti Shah',
] as const

function initialsOf(name: string) {
  return name
    .replace(/^(Mr|Mrs|Ms|Dr|Master|Baby)\.?\s+/i, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? '')
    .join('')
}

function today() {
  return new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

/** Human-readable timestamp for "last updated by" audit lines. */
function nowStamp() {
  return new Date().toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function auditStamp(): AuditMeta {
  return { updatedBy: CURRENT_USER.name, updatedAt: nowStamp() }
}

function addDays(days: number) {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

/** Documents expected for a patient given their service (ID Proof always required). */
export function expectedDocsForService(service: string): string[] {
  const base = ['ID Proof']
  const extra = SERVICE_DOCUMENT_MAP[service] ?? []
  return Array.from(new Set([...base, ...extra]))
}

export function departmentForDoc(docType: string): string {
  return DOCUMENT_DEPARTMENT_MAP[docType] ?? 'MRD'
}



/* ------------------------------------------------------------------ */
/* Seed data                                                           */
/* ------------------------------------------------------------------ */

const seedInquiries: Inquiry[] = []

const seedAppointments: Appointment[] = []

const seedPatients: Patient[] = []

const seedConsultations: Consultation[] = []
const seedInvoices: Invoice[] = []

const seedDocuments: PatientDocument[] = []

const seedNCs: NonConformance[] = []

/* ------------------------------------------------------------------ */
/* Context                                                             */
/* ------------------------------------------------------------------ */

type RegistrationInput = {
  uhid?: string
  salutation: string
  firstName: string
  middleName?: string
  lastName: string
  dob?: string
  age: number
  gender: string
  bloodGroup?: string
  maritalStatus?: string
  mobileNo: string
  alternateMobile?: string
  emailAddress?: string
  residentialAddress?: string
  city?: string
  state?: string
  country?: string
  pincode?: string
  emergencyContactName?: string
  emergencyRelationship?: string
  emergencyPhoneNumber?: string
  patientCategory?: string
  careType?: string
  assignedDepartmentServices?: string
  service: string
  insuranceProvider?: string
  policyNumber?: string
  tpaNetwork?: string
  insuranceContact?: string
  insuranceNotes?: string
  companyName?: string
  corporateId?: string
  employeeId?: string
  companyContact?: string
  corporateAddress?: string
  inquiryId?: string
  appointmentId?: string
}

type StoreValue = {
  inquiries: Inquiry[]
  appointments: Appointment[]
  patients: Patient[]
  consultations: Consultation[]
  invoices: Invoice[]
  documents: PatientDocument[]
  ncs: NonConformance[]

  addInquiry: (i: Omit<Inquiry, 'id' | 'status'>) => Inquiry
  updateInquiry: (id: string, patch: Partial<Inquiry>) => void
  markInquiryLost: (id: string) => void
  convertInquiryToAppointment: (inquiryId: string, data: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt' | 'inquiryId' | 'status'>) => Appointment
  addAppointment: (a: Omit<Appointment, 'id' | 'status'>) => Appointment
  updateAppointment: (id: string, patch: Partial<Appointment>) => void
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void
  registerPatient: (data: RegistrationInput) => Promise<Patient>
  updatePatient: (uhid: string, patch: Partial<Patient>) => void
  getPatient: (uhid: string) => Patient | undefined
  addConsultation: (data: Omit<Consultation, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Consultation>
  updateConsultation: (id: string, patch: Partial<Consultation>) => void
  deleteConsultation: (id: string) => void
  addInvoice: (i: Omit<Invoice, 'id'>) => Invoice
  updateInvoice: (id: string, patch: Partial<Invoice>) => void
  deleteInvoice: (id: string) => void
  addDocument: (d: Omit<PatientDocument, 'id' | 'uploadedOn' | 'verified' | 'uploadedBy'> & { uploadedBy?: string; fileUrl?: string; storagePath?: string; fileSize?: number; patientName: string }) => void
  updateDocument: (id: string, patch: Partial<PatientDocument>) => void
  verifyDocument: (id: string) => void
  deleteDocument: (id: string) => void
  generateNC: (nc: Omit<NonConformance, 'id' | 'status'>) => void
  updateNC: (id: string, patch: Partial<NonConformance>) => void
  closeNC: (id: string) => void
  documentsFor: (uhid: string) => PatientDocument[]
  ncsFor: (uhid: string) => NonConformance[]
  invoicesFor: (uhid: string) => Invoice[]
  consultationsFor: (uhid: string) => Consultation[]
  refreshData: () => Promise<void>
}

const StoreContext = createContext<StoreValue | null>(null)

function nextSeq(prefix: string, existing: string[], pad = 4) {
  const nums = existing
    .map((id) => parseInt(id.split('-').pop() ?? '0', 10))
    .filter((n) => !Number.isNaN(n))
  const max = nums.length ? Math.max(...nums) : 0
  return `${prefix}-${String(max + 1).padStart(pad, '0')}`
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [inquiries, setInquiries] = useState<Inquiry[]>(seedInquiries)
  const [appointments, setAppointments] = useState<Appointment[]>(seedAppointments)
  const [patients, setPatients] = useState<Patient[]>(seedPatients)
  const [consultations, setConsultations] = useState<Consultation[]>(seedConsultations)
  const [invoices, setInvoices] = useState<Invoice[]>(seedInvoices)
  const [documents, setDocuments] = useState<PatientDocument[]>(seedDocuments)
  const [ncs, setNcs] = useState<NonConformance[]>(seedNCs)

  useEffect(() => {
    refreshData()
  }, [])

  const refreshData = async () => {
    try {
      const [apiPatients, apiAppointments, apiInquiries, apiConsultations, apiInvoices, apiDocuments, apiNcs] = await Promise.all([
          apiGetPatients(),
          apiGetAppointments(),
          apiGetInquiries(),
          apiGetConsultations(),
          apiGetInvoices(),
          apiGetDocuments(),
          apiGetNcs(),
        ])

        setPatients(
          apiPatients.map((item: any) => {
            const name = item.name ?? `${item.firstName ?? ''} ${item.middleName ? item.middleName + ' ' : ''}${item.lastName ?? ''}`.trim()
            return {
              ...item,
              name,
              phone: item.mobileNo ?? item.phone ?? '',
              address: item.residentialAddress ?? item.address ?? '',
              emergencyName: item.emergencyContactName ?? item.emergencyName ?? '',
              emergencyRelationship: item.emergencyRelationship ?? '',
              emergencyPhone: item.emergencyPhoneNumber ?? item.emergencyPhone ?? '',
              status: item.status ?? 'Active',
              initials: initialsOf(String(name)),
              registeredOn: String(item.registeredOn ?? today()),
              lastVisit: String(item.lastVisit ?? today()),
              vip: item.vip ?? false,
            }
          }) as Patient[],
        )
        setAppointments(apiAppointments as Appointment[])
        setInquiries(apiInquiries as Inquiry[])
        setConsultations(apiConsultations as Consultation[])
        setInvoices(
          (apiInvoices || []).map((inv: any) => {
            if (inv && inv.patient && typeof inv.patient === 'object') {
              return {
                id: inv.id,
                uhid: inv.patient.uhid,
                patient: inv.patient.name,
                service: inv.items?.[0]?.itemName ?? 'Medical Services',
                date: inv.createdAt ? new Date(inv.createdAt).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                }) : today(),
                subtotal: Number(inv.subtotal ?? 0),
                tax: Number(inv.taxAmount ?? 0),
                discount: Number(inv.discountAmount ?? 0),
                total: Number(inv.grandTotal ?? 0),
                paid: Number(inv.amountReceived ?? 0) + Number(inv.depositAmount ?? 0),
                balance: Number(inv.dueAmount ?? 0),
                status: inv.paymentStatus ?? 'Pending',
                paymentMode: inv.paymentMode,
                transactionId: inv.transactionReference,
                remarks: inv.remarks,
                updatedBy: inv.updatedBy,
                updatedAt: inv.updatedAt,
              }
            }
            return {
              ...inv,
              date: (inv.date && inv.date.includes('T')) 
                ? new Date(inv.date).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase()
                : (inv.date || today()),
              subtotal: Number(inv.subtotal ?? 0),
              tax: Number(inv.tax ?? 0),
              discount: Number(inv.discount ?? 0),
              total: Number(inv.total ?? 0),
              paid: Number(inv.paid ?? 0),
              balance: Number(inv.balance ?? 0),
            }
          }) as Invoice[]
        )
        setDocuments(apiDocuments as PatientDocument[])
        setNcs(apiNcs as NonConformance[])
      } catch (error) {
        console.error('Error loading backend data:', error)
      }
    }

  const addInquiry: StoreValue['addInquiry'] = useCallback((i) => {
    const id = nextSeq('INQ', inquiries.map((p) => p.id))
    const created: Inquiry = { ...i, id, status: 'New' }
    setInquiries((prev) => [created, ...prev])
    apiCreateResource('inquiries', created).catch((error) => {
      console.warn('Failed to persist inquiry', error)
    })
    return created
  }, [inquiries])

  const updateInquiry: StoreValue['updateInquiry'] = useCallback((id, patch) => {
    setInquiries((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)))
    apiUpdateResource('inquiries', id, patch as Record<string, unknown>).catch((error) => {
      console.warn('Failed to update inquiry', error)
    })
  }, [])

  const markInquiryLost: StoreValue['markInquiryLost'] = useCallback((id) => {
    setInquiries((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: 'Lost' } : i)),
    )
    apiUpdateResource('inquiries', id, { status: 'Lost' }).catch((error) => {
      console.warn('Failed to mark inquiry lost', error)
    })
  }, [])

  const convertInquiryToAppointment: StoreValue['convertInquiryToAppointment'] =
    useCallback((inquiryId, data) => {
      const id = nextSeq('APT', appointments.map((p) => p.id))
      const created: Appointment = { ...data, id, status: 'Scheduled', inquiryId }
      setAppointments((prev) => [created, ...prev])
      setInquiries((prev) =>
        prev.map((i) =>
          i.id === inquiryId
            ? { ...i, status: 'Converted', appointmentId: created.id }
            : i,
        ),
      )
      apiCreateResource('appointments', created).catch((error) => {
        console.warn('Failed to persist converted appointment', error)
      })
      apiUpdateResource('inquiries', inquiryId, {
        status: 'Converted',
        appointmentId: created.id,
      }).catch((error) => {
        console.warn('Failed to update inquiry after conversion', error)
      })
      return created
    }, [appointments])

  const addAppointment: StoreValue['addAppointment'] = useCallback((a) => {
    const id = nextSeq('APT', appointments.map((p) => p.id))
    const created: Appointment = { ...a, id, status: 'Scheduled' }
    setAppointments((prev) => [created, ...prev])
    apiCreateResource('appointments', created).catch((error) => {
      console.warn('Failed to persist appointment', error)
    })
    return created
  }, [appointments])

  const updateAppointment: StoreValue['updateAppointment'] = useCallback(
    (id, patch) => {
      setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)))
      apiUpdateResource('appointments', id, patch as Record<string, unknown>).catch(
        (error) => {
          console.warn('Failed to update appointment', error)
        },
      )
    },
    [],
  )

  const updateAppointmentStatus: StoreValue['updateAppointmentStatus'] =
    useCallback((id, status) => {
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status } : a)),
      )
      apiUpdateResource('appointments', id, { status }).catch((error) => {
        console.warn('Failed to update appointment status', error)
      })
    }, [])

  const registerPatient: StoreValue['registerPatient'] = useCallback(async (data) => {
    const generatedUhid = data.uhid || ('ES2026-' + String(Math.floor(100000 + Math.random() * 900000)).padStart(6, '0'))
    const created = {
      ...data,
      uhid: generatedUhid,
      name: `${data.firstName} ${data.middleName ? data.middleName + ' ' : ''}${data.lastName}`.trim(),
      phone: data.mobileNo,
      address: data.residentialAddress,
      emergencyName: data.emergencyContactName,
      emergencyPhone: data.emergencyPhoneNumber,
      registeredOn: today(),
      lastVisit: today(),
      status: 'Active',
      initials: initialsOf(`${data.firstName} ${data.lastName}`),
      vip: false,
    } as Patient

    try {
      // Remove virtual fields that Prisma doesn't know about
      const { 
        name, phone, address, email, emergencyName, emergencyPhone, 
        insuranceProvider, policyNumber, tpaNetwork, insuranceContact, insuranceNotes,
        companyName, corporateId, employeeId, companyContact, corporateAddress,
        ...dbData 
      } = created as any
      
      // Ensure the correct Prisma fields are populated
      if (email) dbData.emailAddress = email
      if (emergencyName) dbData.emergencyContactName = emergencyName
      if (emergencyPhone) dbData.emergencyPhoneNumber = emergencyPhone
      
      if (created.patientCategory === 'Insurance' && insuranceProvider) {
        dbData.insurance = { create: { insuranceProvider, policyNumber, tpaNetwork, insuranceContact, insuranceNotes } }
      }
      if (created.patientCategory === 'Corporate' && companyName) {
        dbData.corporate = { create: { companyName, corporateId, employeeId, companyContact, corporateAddress } }
      }
      
      const ops = [
        apiCreateResource('patients', { ...dbData, uhid: created.uhid }),
      ]

      if (data.appointmentId) {
        ops.push(
          apiUpdateResource('appointments', data.appointmentId, {
            status: 'Registered',
            uhid: created.uhid,
          }),
        )
      }

      if (data.inquiryId) {
        ops.push(
          apiUpdateResource('inquiries', data.inquiryId, {
            status: 'Converted',
            appointmentId: data.appointmentId,
          }),
        )
      }

      await Promise.all(ops)

      setPatients((prev) => [created, ...prev])
      if (data.appointmentId) {
        setAppointments((prev) =>
          prev.map((a) =>
            a.id === data.appointmentId
              ? { ...a, status: 'Registered', uhid: created.uhid }
              : a,
          ),
        )
      }
      if (data.inquiryId) {
        setInquiries((prev) =>
          prev.map((i) =>
            i.id === data.inquiryId
              ? { ...i, status: 'Converted', appointmentId: data.appointmentId }
              : i,
          ),
        )
      }
      return created
    } catch (error) {
      console.warn('Failed to persist patient registration', error)
      throw error
    }
  }, [patients])

  const updatePatient: StoreValue['updatePatient'] = useCallback(
    (uhid, patch) => {
      setPatients((prev) =>
        prev.map((p) =>
          p.uhid === uhid
            ? {
                ...p,
                ...patch,
                initials: patch.name ? initialsOf(String(patch.name)) : p.initials,
                ...auditStamp(),
              }
            : p,
        ),
      )
      const { name, phone, address, email, emergencyName, emergencyPhone, ...dbPatch } = patch as Record<string, any>
      if (email !== undefined) dbPatch.emailAddress = email
      if (emergencyName !== undefined) dbPatch.emergencyContactName = emergencyName
      if (emergencyPhone !== undefined) dbPatch.emergencyPhoneNumber = emergencyPhone
      
      apiUpdateResource('patients', uhid, dbPatch).catch(
        (error) => {
          console.warn('Failed to update patient', error)
        },
      )
    },
    [],
  )

  const getPatient: StoreValue['getPatient'] = useCallback(
    (uhid) => patients.find((p) => p.uhid === uhid),
    [patients],
  )

  const addConsultation: StoreValue['addConsultation'] = useCallback(async (c) => {
    const id = nextSeq('CON', consultations.map((p) => p.id))
    const created = { ...c, id, ...auditStamp() } as Consultation
    setConsultations((prev) => [created, ...prev])
    try {
      await apiCreateResource('consultations', created)
    } catch (error) {
      console.warn('Failed to persist consultation', error)
    }
    return created
  }, [consultations])

  const updateConsultation: StoreValue['updateConsultation'] = useCallback(
    (id, patch) => {
      setConsultations((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...patch, ...auditStamp() } : c)),
      )
    },
    [],
  )

  const deleteConsultation: StoreValue['deleteConsultation'] = useCallback(
    (id) => {
      setConsultations((prev) => prev.filter((c) => c.id !== id))
    },
    [],
  )

  const addInvoice: StoreValue['addInvoice'] = useCallback((i) => {
    const id = nextSeq('INV', invoices.map((p) => p.id))
    const created: Invoice = { ...i, id, ...auditStamp() }
    setInvoices((prev) => [created, ...prev])
    apiCreateResource('invoices', created).catch((error) => {
      console.warn('Failed to persist invoice', error)
    })
    return created
  }, [invoices])

  const updateInvoice: StoreValue['updateInvoice'] = useCallback((id, patch) => {
    setInvoices((prev) =>
      prev.map((i) => (i.id === id ? { ...i, ...patch, ...auditStamp() } : i)),
    )
    apiUpdateResource('invoices', id, patch as Record<string, unknown>).catch((error) => {
      console.warn('Failed to update invoice', error)
    })
  }, [])

  const deleteInvoice: StoreValue['deleteInvoice'] = useCallback((id) => {
    setInvoices((prev) => prev.filter((i) => i.id !== id))
    apiDeleteResource('invoices', id).catch((error) => {
      console.warn('Failed to delete invoice', error)
    })
  }, [])

  const addDocument: StoreValue['addDocument'] = useCallback((d) => {
    setDocuments((prev) => {
      const id = nextSeq('DOC', prev.map((p) => p.id), 3)
      const created: PatientDocument = {
        id,
        uhid: d.uhid,
        patientName: d.patientName,
        name: d.name,
        type: d.type,
        fileSize: d.fileSize,
        storagePath: d.storagePath,
        uploadedBy: d.uploadedBy ?? CURRENT_USER.name,
        uploadedOn: today(),
        verified: false,
        fileUrl: d.fileUrl,
      }
      apiCreateResource('documents', created).catch((error) => {
        console.warn('Failed to persist document', error)
      })
      return [created, ...prev]
    })
  }, [])

  const updateDocument: StoreValue['updateDocument'] = useCallback(
    (id, patch) => {
      setDocuments((prev) =>
        prev.map((d) => (d.id === id ? { ...d, ...patch, ...auditStamp() } : d)),
      )
      apiUpdateResource('documents', id, patch as Record<string, unknown>).catch((error) => {
        console.warn('Failed to update document', error)
      })
    },
    [],
  )

  const verifyDocument: StoreValue['verifyDocument'] = useCallback((id) => {
    setDocuments((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, verified: true, ...auditStamp() } : d,
      ),
    )
    apiUpdateResource('documents', id, { verified: true }).catch((error) => {
      console.warn('Failed to verify document', error)
    })
  }, [])

  const deleteDocument: StoreValue['deleteDocument'] = useCallback((id) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id))
    apiDeleteResource('documents', id).catch((error) => {
      console.warn('Failed to delete document', error)
    })
  }, [])

  const generateNC: StoreValue['generateNC'] = useCallback((nc) => {
    const id = nextSeq('NC', ncs.map((n) => n.id))
    const created: NonConformance = {
      id,
      ...nc,
      status: 'Open',
      createdAt: today(),
      updatedBy: CURRENT_USER.name,
      updatedAt: nowStamp(),
    }
    setNcs((prev) => [created, ...prev])
    apiCreateResource('ncs', created).catch((error) => {
      console.warn('Failed to persist NC', error)
    })
    return created
  }, [ncs])

  const updateNC: StoreValue['updateNC'] = useCallback((id, patch) => {
    setNcs((prev) =>
      prev.map((n) => (n.id === id ? { ...n, ...patch, updatedBy: CURRENT_USER.name, updatedAt: nowStamp() } : n)),
    )
    apiUpdateResource('ncs', id, patch as Record<string, unknown>).catch((error) => {
      console.warn('Failed to update NC', error)
    })
  }, [])

  const closeNC: StoreValue['closeNC'] = useCallback((id) => {
    setNcs((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status: 'Closed', updatedBy: CURRENT_USER.name, updatedAt: nowStamp() } : n)),
    )
    apiUpdateResource('ncs', id, { status: 'Closed' }).catch((error) => {
      console.warn('Failed to close NC', error)
    })
  }, [])

  const documentsFor = useCallback(
    (uhid: string) => documents.filter((d) => d.uhid === uhid),
    [documents],
  )
  const ncsFor = useCallback(
    (uhid: string) => ncs.filter((n) => n.uhid === uhid),
    [ncs],
  )
  const invoicesFor = useCallback(
    (uhid: string) => invoices.filter((i) => i.uhid === uhid),
    [invoices],
  )
  const consultationsFor = useCallback(
    (uhid: string) => consultations.filter((c) => c.uhid === uhid),
    [consultations],
  )

  const value = useMemo<StoreValue>(
    () => ({
      inquiries,
      appointments,
      patients,
      consultations,
      invoices,
      documents,
      ncs,
      addInquiry,
      updateInquiry,
      markInquiryLost,
      convertInquiryToAppointment,
      addAppointment,
      updateAppointment,
      updateAppointmentStatus,
      registerPatient,
      updatePatient,
      getPatient,
      addConsultation,
      updateConsultation,
      deleteConsultation,
      addInvoice,
      updateInvoice,
      deleteInvoice,
      addDocument,
      updateDocument,
      verifyDocument,
      deleteDocument,
      generateNC,
      updateNC,
      closeNC,
      documentsFor,
      ncsFor,
      invoicesFor,
      consultationsFor,
      refreshData,
    }),
    [
      inquiries,
      appointments,
      patients,
      consultations,
      invoices,
      documents,
      ncs,
      addInquiry,
      updateInquiry,
      markInquiryLost,
      convertInquiryToAppointment,
      addAppointment,
      updateAppointment,
      updateAppointmentStatus,
      registerPatient,
      updatePatient,
      getPatient,
      addConsultation,
      updateConsultation,
      deleteConsultation,
      addInvoice,
      updateInvoice,
      deleteInvoice,
      addDocument,
      updateDocument,
      verifyDocument,
      deleteDocument,
      generateNC,
      updateNC,
      closeNC,
      documentsFor,
      ncsFor,
      invoicesFor,
      consultationsFor,
    ],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useHealthcare() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useHealthcare must be used within DataProvider')
  return ctx
}

// Force redeploy to clear cache
