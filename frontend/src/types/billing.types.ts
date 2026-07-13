export type BillingItemType = 'SERVICE' | 'TEST' | 'PACKAGE'

export type PaymentMode = 'UPI' | 'Card' | 'Cash' | 'Insurance'

export type PaymentStatus = 'Draft' | 'Pending' | 'Partially Paid' | 'Paid'

export type DiscountType = 'percentage' | 'flat'

export interface ServiceMaster {
  id: string
  itemType: 'SERVICE'
  name: string
  category: string
  department: string
  price: number
  taxRate: number
  sourceUrl: string
  isActive: boolean
}

export interface TestMaster {
  id: string
  itemType: 'TEST'
  category: string
  subcategory?: string
  serviceType: string
  department: string
  name: string
  price: number
  taxRate: number
  sourceUrl: string
  isActive: boolean
}

export interface PackageMaster {
  id: string
  itemType: 'PACKAGE'
  name: string
  category: string
  includedItems: string[]
  price: number
  taxRate: number
  sourceUrl: string
  isActive: boolean
}

export interface BillingPatient {
  id: string
  uhid: string
  name: string
  age: number
  gender: string
  phone: string
  email?: string
  servicesTaken: string[]
}

export interface BillingInvoiceItem {
  id: string
  itemType: BillingItemType
  itemName: string
  category: string
  department: string
  quantity: number
  unitPrice: number
  taxRate: number
  amount: number
  appointmentDateTime?: string
  performBy?: string
  subDepartment?: string
  servicePriority?: string
  orderId?: string
  confirmOrder?: string
  patientAmount?: number
  discount?: number
  payerAmount?: number
  emergencyCharges?: number
  emergencyPercent?: number
  serviceCode?: string
  patientInstructions?: string
  outsource?: string
}

export interface Payment {
  id: string
  invoiceId: string
  mode: PaymentMode
  amount: number
  reference: string
  createdAt: string
}

export interface InsuranceClaim {
  provider: string
  policyNumber: string
  tpaReference: string
  approvedAmount: number
}

export interface BillingInvoice {
  id: string
  invoiceNumber: string
  patient: BillingPatient
  items: BillingInvoiceItem[]
  subtotal: number
  discountType: DiscountType
  discountValue: number
  discountAmount: number
  taxAmount: number
  grandTotal: number
  depositAmount: number
  amountReceived: number
  dueAmount: number
  paymentMode: PaymentMode
  transactionReference?: string
  bankName?: string
  transactionId?: string
  insurance?: InsuranceClaim
  paymentStatus: PaymentStatus
  dispatchMethods: string[]
  remarks: string
  billingNotes: string
  specialInstructions: string
  createdAt: string
  updatedAt: string
}
