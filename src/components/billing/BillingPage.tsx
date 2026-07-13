"use client"

import { useCallback, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Plus, Search, X, Printer, FileText, Save, ChevronLeft, Info, Trash2 } from 'lucide-react'
import { billingApi } from '@/src/services/billing.api'
import { calculateBillingTotals } from '@/src/hooks/useBillingCalculator'
import { SERVICE_MASTER } from '@/src/config/serviceMaster'
import { ESHEALTH_TEST_MASTER } from '@/src/config/testMaster'
import { PACKAGE_MASTER } from '@/src/config/packageMaster'
import { DEPARTMENTS, CURRENT_USER } from '@/lib/constants'
import type { BillingInvoice, BillingInvoiceItem, BillingPatient, DiscountType, PaymentMode } from '@/src/types/billing.types'
import { Protect } from '@/components/protect'

/* ------------------------------------------------------------------ */
/* Constants                                                           */
/* ------------------------------------------------------------------ */
const BILLING_TYPES = ['Consultation', 'Services', 'Package', 'Misc', 'Vaccination', 'Orderset'] as const
const PAYER_OPTIONS = ['Self', 'Insurance', 'Corporate', 'Government'] as const
const REFER_TYPES = ['Self', 'Internal', 'External'] as const
const DOCTORS = ['Dr. Anand Gadhvi', 'Dr. Nidhi Desai', 'Dr. Vidhi Shukla', 'Dr. Narendra Shah', 'Dr. Jyoti Shah'] as const
const PAYMENT_TABS = ['Billing Summary', 'Discount', 'Deposit', 'Payment Details', 'Due', 'Delivery Charges', 'Remarks'] as const

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */
const createInvoice = (patient: BillingPatient): BillingInvoice => ({
  id: '',
  invoiceNumber: '',
  patient,
  items: [],
  subtotal: 0,
  discountType: 'flat',
  discountValue: 0,
  discountAmount: 0,
  taxAmount: 0,
  grandTotal: 0,
  depositAmount: 0,
  amountReceived: 0,
  dueAmount: 0,
  paymentMode: 'Cash',
  paymentStatus: 'Pending',
  dispatchMethods: [],
  remarks: '',
  billingNotes: '',
  specialInstructions: '',
  createdAt: '',
  updatedAt: '',
})

const emptyPatient: BillingPatient = {
  id: '',
  uhid: '',
  name: '',
  age: 0,
  gender: '',
  phone: '',
  servicesTaken: [],
}

const OUR_SERVICES_LIST = [
  'Pathology',
  'Cardiology',
  'Pulmonology',
  'Radiology',
  'Doctor Consultation',
  'Home Healthcare',
  'Vaccination',
  'Dental',
  'Ophthalmology',
  'Sample Collection',
  'Day Care'
]

/* ------------------------------------------------------------------ */
/* Main Component                                                      */
/* ------------------------------------------------------------------ */
export function BillingPage() {
  const router = useRouter()

  // Patient state
  const [patients, setPatients] = useState<BillingPatient[]>([])
  const [patient, setPatient] = useState<BillingPatient | null>(null)
  const [patientSearch, setPatientSearch] = useState('')
  const [showPatientDropdown, setShowPatientDropdown] = useState(false)

  // Invoice state
  const [invoice, setInvoice] = useState<BillingInvoice>(() => createInvoice(emptyPatient))

  // Prevent SSR hydration mismatch for random values
  useEffect(() => {
    setInvoice(prev => ({
      ...prev,
      id: `INV-${Math.floor(100000 + Math.random() * 900000)}`,
      invoiceNumber: `CROP-${Math.floor(10000 + Math.random() * 90000)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }))
  }, [])

  // Form controls
  const [payer, setPayer] = useState('Self')
  const [referType, setReferType] = useState('Self')
  const [referredBy, setReferredBy] = useState('Dr. Anand Gadhvi')
  const [treatingDoctor, setTreatingDoctor] = useState('Dr. Anand Gadhvi')
  const [billingType, setBillingType] = useState<string>('Services')
  const [serviceType, setServiceType] = useState('')
  const [department, setDepartment] = useState('')
  const [serviceSearch, setServiceSearch] = useState('')
  const [showServiceDropdown, setShowServiceDropdown] = useState(false)

  // Payment tab
  const [activePaymentTab, setActivePaymentTab] = useState(0)

  // Payment fields
  const [discountAmt, setDiscountAmt] = useState(0)
  const [taxAmt, setTaxAmt] = useState(0)
  const [payerAmount, setPayerAmount] = useState(0)
  const [depositAmt, setDepositAmt] = useState(0)
  const [paymentMode, setPaymentMode] = useState<string>('Cash')
  const [receivedAmt, setReceivedAmt] = useState(0)
  const [deliveryCharges, setDeliveryCharges] = useState(0)
  const [remarksText, setRemarksText] = useState('')

  // Load patients from DB
  useEffect(() => {
    billingApi.getPatients().then(setPatients).catch(() => {})
  }, [])

  // Totals
  const totals = useMemo(() => calculateBillingTotals({
    items: invoice.items,
    discountType: invoice.discountType,
    discountValue: discountAmt,
    depositAmount: depositAmt,
    amountReceived: receivedAmt,
  }), [invoice.items, invoice.discountType, discountAmt, depositAmt, receivedAmt])

  const finalAmount = Math.max(totals.grandTotal - deliveryCharges * -1, 0)

  // Filter patients
  const filteredPatients = useMemo(() => {
    if (!patientSearch.trim()) return patients
    const q = patientSearch.toLowerCase()
    return patients.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.uhid.toLowerCase().includes(q) ||
      p.phone.includes(q)
    )
  }, [patients, patientSearch])

  // Filter services for the combobox
  const filteredServices = useMemo(() => {
    const q = serviceSearch.toLowerCase()
    if (billingType === 'Consultation' || billingType === 'Services') {
      return SERVICE_MASTER.filter(s =>
        s.isActive &&
        s.name.toLowerCase().includes(q) &&
        (!department || s.department === department)
      )
    }
    if (billingType === 'Package') {
      return PACKAGE_MASTER.filter(p =>
        p.isActive &&
        p.name.toLowerCase().includes(q)
      )
    }
    // For tests (default)
    return ESHEALTH_TEST_MASTER.filter(t =>
      t.isActive &&
      t.name.toLowerCase().includes(q) &&
      (!department || t.department === department) &&
      (!serviceType || t.serviceType === serviceType)
    ).slice(0, 50)
  }, [billingType, serviceSearch, department, serviceType])

  // Get unique service types for tests
  const testServiceTypes = useMemo(() =>
    Array.from(new Set(ESHEALTH_TEST_MASTER.map(t => t.serviceType).filter(Boolean))),
  [])

  // Select patient
  const handleSelectPatient = (p: BillingPatient) => {
    setPatient(p)
    setPatientSearch(p.name)
    setShowPatientDropdown(false)
    setInvoice(prev => ({ ...prev, patient: p, updatedAt: new Date().toISOString() }))
  }

  // Add service/test/package to invoice
  const addServiceItem = (item: { id: string; name: string; price: number; taxRate: number; category: string; department: string; itemType: string; serviceCode?: string }) => {
    const defaultDateStr = new Date().toLocaleString('en-GB')
    const invoiceItem: BillingInvoiceItem = {
      id: `${item.id}-${Date.now()}`,
      itemType: item.itemType as 'SERVICE' | 'TEST' | 'PACKAGE',
      itemName: item.name,
      category: item.category,
      department: item.department,
      quantity: 1,
      unitPrice: item.price,
      taxRate: item.taxRate,
      amount: item.price,
      appointmentDateTime: defaultDateStr,
      performBy: 'Dr. Anand Gadhvi',
      subDepartment: item.category || 'General',
      servicePriority: 'Routine',
      orderId: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      confirmOrder: 'Confirmed',
      patientAmount: item.price,
      discount: 0,
      payerAmount: 0,
      emergencyCharges: 0,
      emergencyPercent: 0,
      serviceCode: item.serviceCode || `ES${Math.floor(100 + Math.random() * 900)}`,
      patientInstructions: 'N/A',
      outsource: 'No',
    }
    setInvoice(prev => {
      const nextItems = [...prev.items, invoiceItem]
      const nextTotals = calculateBillingTotals({ items: nextItems, discountType: prev.discountType, discountValue: discountAmt, depositAmount: depositAmt, amountReceived: receivedAmt })
      return { ...prev, items: nextItems, ...nextTotals, updatedAt: new Date().toISOString() }
    })
    setServiceSearch('')
    setShowServiceDropdown(false)
    toast.success(`Added: ${item.name}`)
  }

  // Remove item
  const removeItem = (itemId: string) => {
    setInvoice(prev => {
      const nextItems = prev.items.filter(i => i.id !== itemId)
      const nextTotals = calculateBillingTotals({ items: nextItems, discountType: prev.discountType, discountValue: discountAmt, depositAmount: depositAmt, amountReceived: receivedAmt })
      return { ...prev, items: nextItems, ...nextTotals, updatedAt: new Date().toISOString() }
    })
  }

  // Update item field dynamically with custom calculations
  const updateItemField = (itemId: string, field: keyof BillingInvoiceItem, value: any) => {
    setInvoice(prev => {
      const nextItems = prev.items.map(i => {
        if (i.id === itemId) {
          const updated = { ...i, [field]: value }
          const qty = Number(updated.quantity ?? 1)
          const price = Number(updated.unitPrice ?? 0)
          const itemDisc = Number(updated.discount ?? 0)
          const emgCharges = Number(updated.emergencyCharges ?? 0)
          
          updated.amount = qty * price - itemDisc + emgCharges
          return updated
        }
        return i
      })
      const nextTotals = calculateBillingTotals({ items: nextItems, discountType: prev.discountType, discountValue: discountAmt, depositAmount: depositAmt, amountReceived: receivedAmt })
      return { ...prev, items: nextItems, ...nextTotals, updatedAt: new Date().toISOString() }
    })
  }

  // Clear all items
  const clearAll = () => {
    setInvoice(prev => {
      const nextTotals = calculateBillingTotals({ items: [], discountType: prev.discountType, discountValue: 0, depositAmount: 0, amountReceived: 0 })
      return { ...prev, items: [], ...nextTotals, updatedAt: new Date().toISOString() }
    })
    setDiscountAmt(0)
    setDepositAmt(0)
    setReceivedAmt(0)
  }

  // Create Bill
  const createBill = async () => {
    if (!patient) { toast.error('Please select a patient first'); return }
    if (invoice.items.length === 0) { toast.error('Please add at least one service'); return }
    const finalInvoice: BillingInvoice = {
      ...invoice,
      ...totals,
      discountValue: discountAmt,
      depositAmount: depositAmt,
      amountReceived: receivedAmt,
      paymentMode: paymentMode as PaymentMode,
      remarks: remarksText,
      paymentStatus: totals.dueAmount <= 0 ? 'Paid' : receivedAmt > 0 || depositAmt > 0 ? 'Partially Paid' : 'Pending',
    }
    try {
      const result = await billingApi.createInvoice(finalInvoice)
      toast.success(`Invoice created: ${result.invoiceNumber ?? result.id}`)
    } catch {
      toast.error('Failed to create invoice')
    }
  }

  const createAndPrint = async () => {
    await createBill()
    window.print()
  }

  const saveDraft = async () => {
    if (!patient) { toast.error('Please select a patient first'); return }
    try {
      const result = await billingApi.saveDraft({ ...invoice, ...totals, discountValue: discountAmt, depositAmount: depositAmt, amountReceived: receivedAmt, paymentMode: paymentMode as PaymentMode, remarks: remarksText })
      toast.success(`Draft saved: ${result.invoiceNumber ?? result.id}`)
    } catch {
      toast.error('Failed to save draft')
    }
  }

  // Format date/time for order column (client-side only to prevent hydration mismatch)
  const [orderDateTime, setOrderDateTime] = useState('')
  useEffect(() => {
    setOrderDateTime(new Date().toLocaleString('en-GB', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    }))
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      
      {/* ─── Interactive Layout (Hidden during print) ─── */}
      <div className="print:hidden flex flex-col flex-1">
        {/* Top Header Bar */}
        <div className="bg-white border-b border-slate-200 px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-emerald-700">OP Billing</span>
            </div>
          </div>
        </div>

        {/* Patient Profile Header */}
        <div className="bg-white border-b border-slate-200 px-4 py-3">
          <div className="flex items-center gap-4">
            {/* Patient avatar */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
              {patient ? patient.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : '?'}
            </div>
            {/* Patient search / info */}
            <div className="flex-1 relative">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Search patient by name, UHID, or phone..."
                  className="w-full max-w-md border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                  value={patientSearch}
                  onChange={(e) => { setPatientSearch(e.target.value); setShowPatientDropdown(true) }}
                  onFocus={() => setShowPatientDropdown(true)}
                />
                <Search className="w-4 h-4 text-slate-400 -ml-8" />
              </div>
              {showPatientDropdown && filteredPatients.length > 0 && (
                <div className="absolute z-50 top-full left-0 mt-1 w-full max-w-md bg-white border border-slate-200 rounded-lg shadow-xl max-h-60 overflow-auto">
                  {filteredPatients.map(p => (
                    <button key={p.id} type="button" className="w-full text-left px-3 py-2 hover:bg-blue-50 transition-colors text-sm border-b border-slate-100 last:border-0" onClick={() => handleSelectPatient(p)}>
                      <span className="font-medium">{p.name}</span>
                      <span className="text-slate-500 ml-2 text-xs">{p.uhid} • {p.phone}</span>
                    </button>
                  ))}
                </div>
              )}
              {/* Patient summary line */}
              {patient && (
                <p className="text-xs text-slate-500 mt-1">
                  <span className="font-semibold text-slate-700">{patient.name}</span>
                  {' '}{patient.age} Y {patient.gender?.charAt(0)} / {patient.gender} / {patient.uhid} {patient.phone}
                  <span className="ml-3 text-slate-400">Payer: <span className="text-slate-600 font-medium">{payer}/{payer === 'Self' ? 'Self' : 'cash'}</span></span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Payer / Refer Type / Referred By / Treating Doctor row */}
        <div className="bg-white border-b border-slate-200 px-4 py-2">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* Payer */}
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Payer</label>
              <div className="flex gap-1">
                <select className="flex-1 border border-slate-300 rounded px-2 py-1.5 text-sm bg-white" value={payer} onChange={e => setPayer(e.target.value)}>
                  {PAYER_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <button className="w-7 h-7 border border-blue-400 rounded text-blue-500 hover:bg-blue-50 flex items-center justify-center text-lg" title="Add new payer">+</button>
              </div>
            </div>
            {/* Refer Type */}
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Refer Type</label>
              <select className="w-full border border-slate-300 rounded px-2 py-1.5 text-sm bg-white" value={referType} onChange={e => setReferType(e.target.value)}>
                {REFER_TYPES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            {/* Reference By */}
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Reference By</label>
              <select className="w-full border border-slate-300 rounded px-2 py-1.5 text-sm bg-white" value={referredBy} onChange={e => setReferredBy(e.target.value)}>
                {DOCTORS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            {/* Treating Doctor */}
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Treating Doctor <span className="text-red-500">*</span></label>
              <select className="w-full border border-slate-300 rounded px-2 py-1.5 text-sm bg-white font-medium" value={treatingDoctor} onChange={e => setTreatingDoctor(e.target.value)}>
                {DOCTORS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* OP Billing Controls */}
        <div className="bg-white border-b border-slate-200 px-4 py-3">
          <h3 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1">
            <Plus className="w-4 h-4" /> OP Billing
          </h3>
          {/* Radio buttons row */}
          <div className="flex flex-wrap items-center gap-4 mb-3">
            {BILLING_TYPES.map(bt => (
              <label key={bt} className="flex items-center gap-1.5 cursor-pointer text-sm">
                <input
                  type="radio"
                  name="billingType"
                  value={bt}
                  checked={billingType === bt}
                  onChange={() => { setBillingType(bt); setServiceType(''); setDepartment('') }}
                  className="accent-blue-600"
                />
                <span className={billingType === bt ? 'font-semibold text-blue-700' : 'text-slate-600'}>{bt}</span>
              </label>
            ))}
            {/* Chamber Case toggle */}
            <div className="ml-auto flex items-center gap-2">
              <label className="flex items-center gap-1.5 text-sm text-slate-600 cursor-pointer">
                <input type="checkbox" className="accent-blue-600 rounded" />
                Chamber Case
              </label>
              <button className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center" title="Info">
                <Info className="w-3 h-3" />
              </button>
            </div>
          </div>
          {/* Select Service Type / Department / Service Search */}
          <div className="flex flex-wrap items-end gap-3">
            {/* Service Type (for tests) */}
            <div className="w-44">
              <label className="text-xs text-slate-500 mb-1 block">Select Service Type</label>
              <select className="w-full border border-slate-300 rounded px-2 py-1.5 text-sm bg-white" value={serviceType} onChange={e => setServiceType(e.target.value)}>
                <option value="">All Types</option>
                {OUR_SERVICES_LIST.map(st => <option key={st} value={st}>{st}</option>)}
              </select>
            </div>
            {/* Department */}
            <div className="w-44">
              <label className="text-xs text-slate-500 mb-1 block">Select Department</label>
              <select className="w-full border border-slate-300 rounded px-2 py-1.5 text-sm bg-white" value={department} onChange={e => setDepartment(e.target.value)}>
                <option value="">All Departments</option>
                {OUR_SERVICES_LIST.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            {/* Service Name Search */}
            <div className="flex-1 min-w-[250px] relative">
              <label className="text-xs text-slate-500 mb-1 block">Service Name ▾ &nbsp; Search service</label>
              <div className="flex gap-1">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="🔍 Search service"
                    className="w-full border border-slate-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                    value={serviceSearch}
                    onChange={e => { setServiceSearch(e.target.value); setShowServiceDropdown(true) }}
                    onFocus={() => setShowServiceDropdown(true)}
                  />
                  {showServiceDropdown && serviceSearch.length > 0 && (
                    <div className="absolute z-50 top-full left-0 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-xl max-h-72 overflow-auto">
                      {filteredServices.length === 0 ? (
                        <p className="px-3 py-2 text-sm text-slate-400">No matching services found</p>
                      ) : (
                        filteredServices.map((item: any) => (
                          <button
                            key={item.id}
                            type="button"
                            className="w-full text-left px-3 py-2 hover:bg-blue-50 transition-colors text-sm border-b border-slate-100 last:border-0 flex justify-between items-center"
                            onClick={() => addServiceItem(item)}
                          >
                            <div>
                              <span className="font-medium">{item.name}</span>
                              <span className="text-slate-400 ml-2 text-xs">{item.category} • {item.department}</span>
                            </div>
                            <span className="font-semibold text-emerald-700">₹{item.price}</span>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
                <button
                  className="w-8 h-8 bg-blue-600 text-white rounded flex items-center justify-center hover:bg-blue-700 transition-colors shrink-0"
                  title="Add service"
                  onClick={() => setShowServiceDropdown(true)}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Success Item List Table */}
        <div className="flex-1 px-4 py-2 overflow-auto">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-slate-700">Success Item List</h3>
            {invoice.items.length > 0 && (
              <button onClick={clearAll} className="flex items-center gap-1 text-xs bg-red-50 text-red-600 border border-red-200 rounded px-2 py-1 hover:bg-red-100 transition-colors">
                Clear All <X className="w-3 h-3" />
              </button>
            )}
          </div>
          <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full text-[11px]">
              <thead>
                <tr className="bg-gradient-to-r from-slate-100 to-slate-50">
                  <th className="px-2 py-2 text-left font-semibold text-slate-600 whitespace-nowrap border-b">Service Type</th>
                  <th className="px-2 py-2 text-left font-semibold text-slate-600 whitespace-nowrap border-b">Appointment Date/Time</th>
                  <th className="px-2 py-2 text-left font-semibold text-slate-600 whitespace-nowrap border-b">Perform By</th>
                  <th className="px-2 py-2 text-center font-semibold text-slate-600 whitespace-nowrap border-b">Qty</th>
                  <th className="px-2 py-2 text-left font-semibold text-slate-600 whitespace-nowrap border-b">Service Item</th>
                  <th className="px-2 py-2 text-left font-semibold text-slate-600 whitespace-nowrap border-b">Department Name</th>
                  <th className="px-2 py-2 text-left font-semibold text-slate-600 whitespace-nowrap border-b">Sub Department</th>
                  <th className="px-2 py-2 text-left font-semibold text-slate-600 whitespace-nowrap border-b">Service Priority</th>
                  <th className="px-2 py-2 text-left font-semibold text-slate-600 whitespace-nowrap border-b">Order Id</th>
                  <th className="px-2 py-2 text-left font-semibold text-slate-600 whitespace-nowrap border-b">Confirm Order</th>
                  <th className="px-2 py-2 text-right font-semibold text-slate-600 whitespace-nowrap border-b">Price</th>
                  <th className="px-2 py-2 text-right font-semibold text-slate-600 whitespace-nowrap border-b">Total Amount</th>
                  <th className="px-2 py-2 text-right font-semibold text-slate-600 whitespace-nowrap border-b">Patient Amount</th>
                  <th className="px-2 py-2 text-right font-semibold text-slate-600 whitespace-nowrap border-b">Discount</th>
                  <th className="px-2 py-2 text-right font-semibold text-slate-600 whitespace-nowrap border-b">Payer Amount</th>
                  <th className="px-2 py-2 text-right font-semibold text-slate-600 whitespace-nowrap border-b">Net Amount</th>
                  <th className="px-2 py-2 text-right font-semibold text-slate-600 whitespace-nowrap border-b">Tax</th>
                  <th className="px-2 py-2 text-right font-semibold text-slate-600 whitespace-nowrap border-b">Emergency Charges</th>
                  <th className="px-2 py-2 text-right font-semibold text-slate-600 whitespace-nowrap border-b">Emergency %</th>
                  <th className="px-2 py-2 text-left font-semibold text-slate-600 whitespace-nowrap border-b">Order Date/Time</th>
                  <th className="px-2 py-2 text-left font-semibold text-slate-600 whitespace-nowrap border-b">Service Code</th>
                  <th className="px-2 py-2 text-left font-semibold text-slate-600 whitespace-nowrap border-b">Patient Instructions</th>
                  <th className="px-2 py-2 text-center font-semibold text-slate-600 whitespace-nowrap border-b">Outsource</th>
                  <th className="px-2 py-2 text-center font-semibold text-slate-600 whitespace-nowrap border-b">Action</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.length === 0 ? (
                  <tr>
                    <td colSpan={24} className="px-4 py-8 text-center text-slate-400 text-sm">
                      No items added yet. Use the service search above to add services, tests, or packages.
                    </td>
                  </tr>
                ) : (
                  invoice.items.map((item, idx) => {
                    const rowTotal = item.quantity * item.unitPrice
                    const rowTax = rowTotal * (item.taxRate / 100)
                    const rowNet = rowTotal - (item.discount || 0) + (item.emergencyCharges || 0)
                    return (
                      <tr key={item.id} className={`border-b border-slate-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'} hover:bg-blue-50/40 transition-colors`}>
                        {/* Service Type */}
                        <td className="px-1 py-1">
                          <select className="border border-slate-300 rounded px-1 py-0.5 text-xs bg-white" value={item.itemType} onChange={e => updateItemField(item.id, 'itemType', e.target.value)}>
                            <option value="SERVICE">Service</option>
                            <option value="TEST">Pathology</option>
                            <option value="PACKAGE">Package</option>
                          </select>
                        </td>
                        {/* Appointment Date/Time */}
                        <td className="px-1 py-1">
                          <input type="text" className="border border-slate-300 rounded px-1 py-0.5 text-xs w-28" value={item.appointmentDateTime || ''} onChange={e => updateItemField(item.id, 'appointmentDateTime', e.target.value)} />
                        </td>
                        {/* Perform By */}
                        <td className="px-1 py-1">
                          <select className="border border-slate-300 rounded px-1 py-0.5 text-xs bg-white w-28" value={item.performBy || ''} onChange={e => updateItemField(item.id, 'performBy', e.target.value)}>
                            {DOCTORS.map(d => <option key={d} value={d}>{d}</option>)}
                          </select>
                        </td>
                        {/* Qty */}
                        <td className="px-1 py-1 text-center">
                          <input type="number" min={1} className="w-10 border border-slate-300 rounded px-1 py-0.5 text-center text-xs" value={item.quantity} onChange={e => updateItemField(item.id, 'quantity', Math.max(1, parseInt(e.target.value) || 1))} />
                        </td>
                        {/* Service Item */}
                        <td className="px-1 py-1">
                          <input type="text" className="border border-slate-300 rounded px-1 py-0.5 text-xs w-32 font-medium" value={item.itemName} onChange={e => updateItemField(item.id, 'itemName', e.target.value)} />
                        </td>
                        {/* Department Name */}
                        <td className="px-1 py-1">
                          <input type="text" className="border border-slate-300 rounded px-1 py-0.5 text-xs w-24" value={item.department} onChange={e => updateItemField(item.id, 'department', e.target.value)} />
                        </td>
                        {/* Sub Department */}
                        <td className="px-1 py-1">
                          <input type="text" className="border border-slate-300 rounded px-1 py-0.5 text-xs w-24" value={item.subDepartment || ''} onChange={e => updateItemField(item.id, 'subDepartment', e.target.value)} />
                        </td>
                        {/* Service Priority */}
                        <td className="px-1 py-1">
                          <select className="border border-slate-300 rounded px-1 py-0.5 text-xs bg-white" value={item.servicePriority || 'Routine'} onChange={e => updateItemField(item.id, 'servicePriority', e.target.value)}>
                            <option value="Routine">Routine</option>
                            <option value="Urgent">Urgent</option>
                            <option value="Emergency">Emergency</option>
                          </select>
                        </td>
                        {/* Order Id */}
                        <td className="px-1 py-1">
                          <input type="text" className="border border-slate-300 rounded px-1 py-0.5 text-xs w-20" value={item.orderId || ''} onChange={e => updateItemField(item.id, 'orderId', e.target.value)} />
                        </td>
                        {/* Confirm Order */}
                        <td className="px-1 py-1">
                          <input type="text" className="border border-slate-300 rounded px-1 py-0.5 text-xs w-20" value={item.confirmOrder || ''} onChange={e => updateItemField(item.id, 'confirmOrder', e.target.value)} />
                        </td>
                        {/* Price */}
                        <td className="px-1 py-1">
                          <input type="number" min={0} className="w-14 border border-slate-300 rounded px-1 py-0.5 text-right text-xs" value={item.unitPrice} onChange={e => updateItemField(item.id, 'unitPrice', Number(e.target.value) || 0)} />
                        </td>
                        {/* Total Amount */}
                        <td className="px-2 py-1.5 text-right font-medium text-slate-700">{rowTotal}</td>
                        {/* Patient Amount */}
                        <td className="px-1 py-1">
                          <input type="number" className="w-14 border border-slate-300 rounded px-1 py-0.5 text-right text-xs bg-amber-50" value={item.patientAmount || 0} onChange={e => updateItemField(item.id, 'patientAmount', Number(e.target.value) || 0)} />
                        </td>
                        {/* Discount */}
                        <td className="px-1 py-1">
                          <input type="number" className="w-12 border border-slate-300 rounded px-1 py-0.5 text-right text-xs bg-green-50" value={item.discount || 0} onChange={e => updateItemField(item.id, 'discount', Number(e.target.value) || 0)} />
                        </td>
                        {/* Payer Amount */}
                        <td className="px-1 py-1">
                          <input type="number" className="w-12 border border-slate-300 rounded px-1 py-0.5 text-right text-xs" value={item.payerAmount || 0} onChange={e => updateItemField(item.id, 'payerAmount', Number(e.target.value) || 0)} />
                        </td>
                        {/* Net Amount */}
                        <td className="px-2 py-1.5 text-right font-bold text-slate-800">{rowNet}</td>
                        {/* Tax */}
                        <td className="px-1 py-1">
                          <input type="number" className="w-10 border border-slate-300 rounded px-1 py-0.5 text-right text-xs" value={item.taxRate} onChange={e => updateItemField(item.id, 'taxRate', Number(e.target.value) || 0)} />
                        </td>
                        {/* Emergency Charges */}
                        <td className="px-1 py-1">
                          <input type="number" className="w-12 border border-slate-300 rounded px-1 py-0.5 text-right text-xs" value={item.emergencyCharges || 0} onChange={e => updateItemField(item.id, 'emergencyCharges', Number(e.target.value) || 0)} />
                        </td>
                        {/* Emergency % */}
                        <td className="px-1 py-1">
                          <input type="number" className="w-10 border border-slate-300 rounded px-1 py-0.5 text-right text-xs" value={item.emergencyPercent || 0} onChange={e => updateItemField(item.id, 'emergencyPercent', Number(e.target.value) || 0)} />
                        </td>
                        {/* Order Date/Time */}
                        <td className="px-2 py-1.5 whitespace-nowrap text-xs text-slate-400">{orderDateTime}</td>
                        {/* Service Code */}
                        <td className="px-1 py-1">
                          <input type="text" className="border border-slate-300 rounded px-1 py-0.5 text-xs w-16 font-mono text-center" value={item.serviceCode || ''} onChange={e => updateItemField(item.id, 'serviceCode', e.target.value)} />
                        </td>
                        {/* Patient Instructions */}
                        <td className="px-1 py-1">
                          <input type="text" className="border border-slate-300 rounded px-1 py-0.5 text-xs w-28" value={item.patientInstructions || ''} onChange={e => updateItemField(item.id, 'patientInstructions', e.target.value)} />
                        </td>
                        {/* Outsource */}
                        <td className="px-1 py-1 text-center">
                          <select className="border border-slate-300 rounded px-1 py-0.5 text-xs bg-white" value={item.outsource || 'No'} onChange={e => updateItemField(item.id, 'outsource', e.target.value)}>
                            <option value="No">No</option>
                            <option value="Yes">Yes</option>
                          </select>
                        </td>
                        {/* Action */}
                        <td className="px-2 py-1.5 text-center">
                          <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600 transition-colors" title="Remove item">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Details Section */}
        <div className="bg-white border-t border-slate-200 px-4 py-3">
          <h3 className="text-sm font-semibold text-slate-700 mb-2">Payment Details</h3>
          {/* Payment tabs */}
          <div className="flex flex-wrap gap-1 mb-3 border-b border-slate-200 pb-2">
            {PAYMENT_TABS.map((tab, idx) => (
              <button
                key={tab}
                type="button"
                className={`text-xs px-3 py-1.5 rounded-t transition-colors ${idx === activePaymentTab ? 'bg-blue-600 text-white font-semibold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                onClick={() => setActivePaymentTab(idx)}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left - Summary or active tab */}
            <div className="space-y-3">
              {activePaymentTab === 0 && (
                <>
                  <h4 className="text-xs font-semibold text-slate-600 uppercase">Billing Summary</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-slate-500">▸ Total Amount</span>
                    <input type="text" className="border border-slate-300 rounded px-2 py-1 text-sm font-semibold bg-amber-50" value={totals.subtotal.toFixed(0)} readOnly />
                    <span className="text-slate-500">▸ Net Amount</span>
                    <input type="text" className="border border-slate-300 rounded px-2 py-1 text-sm font-semibold bg-amber-50" value={totals.grandTotal.toFixed(0)} readOnly />
                    <span className="text-slate-500">▸ Authorized Amount</span>
                    <input type="text" className="border border-slate-300 rounded px-2 py-1 text-sm bg-white" value={totals.grandTotal.toFixed(0)} readOnly />
                  </div>
                </>
              )}
              {activePaymentTab === 1 && (
                <>
                  <h4 className="text-xs font-semibold text-slate-600 uppercase">Discount</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-slate-500">Discount (In Amt)</span>
                    <input type="number" className="border border-slate-300 rounded px-2 py-1 text-sm bg-white" value={discountAmt} onChange={e => setDiscountAmt(Number(e.target.value))} />
                  </div>
                </>
              )}
              {activePaymentTab === 2 && (
                <>
                  <h4 className="text-xs font-semibold text-slate-600 uppercase">Deposit</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-slate-500">Deposit Amount</span>
                    <input type="number" className="border border-slate-300 rounded px-2 py-1 text-sm bg-white" value={depositAmt} onChange={e => setDepositAmt(Number(e.target.value))} />
                  </div>
                </>
              )}
              {activePaymentTab === 3 && (
                <>
                  <h4 className="text-xs font-semibold text-slate-600 uppercase">Payment Details</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-slate-500">Payment Mode <span className="text-red-500">*</span></span>
                    <select className="border border-slate-300 rounded px-2 py-1 text-sm bg-white" value={paymentMode} onChange={e => setPaymentMode(e.target.value)}>
                      <option value="Cash">Cash</option>
                      <option value="UPI">UPI</option>
                      <option value="Card">Card</option>
                      <option value="Insurance">Insurance</option>
                    </select>
                    <span className="text-slate-500">Amount <span className="text-red-500">*</span></span>
                    <input type="number" className="border border-slate-300 rounded px-2 py-1 text-sm bg-white" value={receivedAmt} onChange={e => setReceivedAmt(Number(e.target.value))} />
                  </div>
                </>
              )}
              {activePaymentTab === 4 && (
                <>
                  <h4 className="text-xs font-semibold text-slate-600 uppercase">Due</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-slate-500">Due Amount</span>
                    <input type="text" className="border border-slate-300 rounded px-2 py-1 text-sm bg-amber-50 font-semibold" value={totals.dueAmount.toFixed(0)} readOnly />
                  </div>
                </>
              )}
              {activePaymentTab === 5 && (
                <>
                  <h4 className="text-xs font-semibold text-slate-600 uppercase">Delivery Charges</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-slate-500">Delivery Charges</span>
                    <input type="number" className="border border-slate-300 rounded px-2 py-1 text-sm bg-white" value={deliveryCharges} onChange={e => setDeliveryCharges(Number(e.target.value))} />
                  </div>
                </>
              )}
              {activePaymentTab === 6 && (
                <>
                  <h4 className="text-xs font-semibold text-slate-600 uppercase">Remarks</h4>
                  <textarea
                    className="w-full border border-slate-300 rounded px-2 py-1 text-sm bg-white min-h-[60px]"
                    placeholder="Add remarks..."
                    value={remarksText}
                    onChange={e => setRemarksText(e.target.value)}
                  />
                </>
              )}
            </div>

            {/* Right - Amount fields always visible */}
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-slate-500">Discount(In Amt)</span>
              <input type="number" className="border border-slate-300 rounded px-2 py-1 text-sm bg-white" value={discountAmt} onChange={e => setDiscountAmt(Number(e.target.value))} />
              <span className="text-slate-500">Payer Amount</span>
              <input type="number" className="border border-slate-300 rounded px-2 py-1 text-sm bg-white" value={payerAmount} onChange={e => setPayerAmount(Number(e.target.value))} />
              <span className="text-slate-500">Final Amount</span>
              <input type="text" className="border border-slate-300 rounded px-2 py-1 text-sm font-bold bg-amber-50" value={finalAmount.toFixed(0)} readOnly />
              <span className="text-slate-500">Tax</span>
              <input type="text" className="border border-slate-300 rounded px-2 py-1 text-sm bg-white" value={totals.taxAmount.toFixed(0)} readOnly />
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="bg-white border-t border-slate-200 px-4 py-3 flex items-center justify-end gap-3 sticky bottom-0 shadow-[0_-2px_8px_rgba(0,0,0,0.06)]">
          <button onClick={() => router.back()} className="flex items-center gap-1 px-4 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-slate-600">
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          <Protect module="BILLING" action="CREATE">
            <button onClick={createBill} className="flex items-center gap-1 px-5 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold shadow-sm">
              <FileText className="w-4 h-4" /> Create Bill ✓
            </button>
            <button onClick={createAndPrint} className="flex items-center gap-1 px-5 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-sm">
              <Printer className="w-4 h-4" /> Create & Print Bill ✓
            </button>
            <button onClick={saveDraft} className="flex items-center gap-1 px-5 py-2 text-sm bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-semibold shadow-sm">
              <Save className="w-4 h-4" /> Draft Order ▸
            </button>
          </Protect>
        </div>
      </div>

      {/* ─── Printable Invoice Layout (Only visible during print) ─── */}
      <div className="hidden print:block font-sans text-xs text-black p-4 bg-white min-h-screen">
        {/* Printable Header */}
        <div className="flex items-center justify-between border-b border-black pb-2 mb-3">
          {/* Teal left banner */}
          <div className="w-6 h-12 bg-gradient-to-b from-emerald-600 to-teal-500 rounded" />
          {/* Centered logo */}
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-card shadow-sm">
              <Image
                src="/es-logo.jpg"
                alt="ES Healthcare Centre logo"
                width={40}
                height={40}
                className="size-9 object-contain"
                priority
              />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold tracking-tight text-foreground">
                ES Healthcare Centre
              </span>
            </div>
          </div>
          {/* Teal right banner */}
          <div className="w-6 h-12 bg-gradient-to-b from-emerald-600 to-teal-500 rounded" />
        </div>

        {/* Invoice Metadata Grid */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-[10px] mb-3">
          <div className="space-y-0.5">
            <div className="flex justify-between"><span className="font-semibold w-24">UHID</span><span>: {patient?.uhid || 'ESHS2025-15550'}</span></div>
            <div className="flex justify-between"><span className="font-semibold w-24">Patient Name</span><span>: {patient?.name || 'Ms. Khushi Jayeshkumar Kharvar'}</span></div>
            <div className="flex justify-between"><span className="font-semibold w-24">Contact Number</span><span>: {patient?.phone || '9904263460'}</span></div>
            <div className="flex justify-between"><span className="font-semibold w-24">Consultant Name</span><span>: {treatingDoctor}</span></div>
            <div className="flex justify-between"><span className="font-semibold w-24">Tariff</span><span>: {payer.toLowerCase()}</span></div>
          </div>
          <div className="space-y-0.5">
            <div className="flex justify-between"><span className="font-semibold w-28">Bill Number</span><span>: {invoice.invoiceNumber}</span></div>
            <div className="flex justify-between"><span className="font-semibold w-28">Visit Id</span><span>: SIOP-{invoice.invoiceNumber.split('-')[1] || '21812'}</span></div>
            <div className="flex justify-between"><span className="font-semibold w-28">Bill Date and Time</span><span>: {orderDateTime}</span></div>
            <div className="flex justify-between"><span className="font-semibold w-28">Reg. Date Time</span><span>: {orderDateTime}</span></div>
          </div>
        </div>

        {/* Thick line separator */}
        <div className="border-b-2 border-black my-2" />

        {/* OP Bill Title */}
        <div className="text-center font-bold text-sm tracking-widest my-2">OP BILL</div>

        {/* Printable Items Table */}
        <table className="w-full text-left text-[10px] mb-6">
          <thead>
            <tr className="border-b border-black">
              <th className="py-1 font-semibold w-12">S.No.</th>
              <th className="py-1 font-semibold">Particular</th>
              <th className="py-1 font-semibold text-center w-16">Qty</th>
              <th className="py-1 font-semibold text-right w-24">Amount</th>
              <th className="py-1 font-semibold text-right w-24">Net Amt.</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-4 text-center text-slate-400">No services billed.</td>
              </tr>
            ) : (
              invoice.items.map((item, idx) => (
                <tr key={item.id} className="border-b border-slate-100">
                  <td className="py-1">{idx + 1}</td>
                  <td className="py-1 font-medium">{item.itemName}</td>
                  <td className="py-1 text-center">{item.quantity}</td>
                  <td className="py-1 text-right">{item.unitPrice.toFixed(2)}</td>
                  <td className="py-1 text-right">{item.amount.toFixed(2)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Receipt Details section */}
        <div className="flex justify-between items-start text-[10px] mt-4">
          <div>
            <span className="font-semibold text-slate-800">Receipt Details</span>
          </div>
          <div className="w-64 space-y-1">
            <div className="flex justify-between"><span className="font-semibold">Total Amount</span><span>{totals.subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="font-semibold">Discount Amount</span><span>{totals.discountAmount.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="font-semibold text-sm">Payable Amount</span><span className="font-bold text-sm">{finalAmount.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="font-semibold">Refunded Amount</span><span>0.00</span></div>
            <div className="flex justify-between pt-2 border-t border-slate-200"><span className="font-semibold">Discount Authorised By</span><span>Pranav Shah</span></div>
          </div>
        </div>

        {/* Signatures */}
        <div className="flex justify-between text-[9px] mt-16 pt-4 border-t border-slate-100">
          <div>
            <div className="font-semibold">Printed By</div>
            <div className="text-slate-500">{CURRENT_USER.name}</div>
            <div className="text-slate-400">{orderDateTime}</div>
          </div>
          <div className="text-center">
            <div className="font-semibold">Created By/Login Id</div>
            <div className="text-slate-500">{CURRENT_USER.name} / {CURRENT_USER.name.toLowerCase().replace(' ', '.')}.eshs</div>
          </div>
        </div>

        {/* Printable Teal/Green footer banner matching reference perfectly */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded text-center space-y-1">
          <div className="text-[11px] font-bold tracking-widest">CHANGING THE WAY OF HEALTHCARE</div>
          <div className="flex justify-center items-center gap-6 text-[9px]">
            <span>📞 079 61 61 61 61</span>
            <span>✉ info@eshs.in</span>
            <span>CIN : U74999GJ2021PTC127536</span>
          </div>
          <div className="text-[8px] opacity-90 leading-tight">
            📍 ES Healthcare Centre, Ground floor, YSL Avenue, Dr Vikram Sarabhai Marg, opposite Ketav Petrol Pump, Ambawadi, Ahmedabad, Gujarat 380006
          </div>
        </div>
      </div>

      {/* Click-away handler for dropdowns */}
      {(showPatientDropdown || showServiceDropdown) && (
        <div className="fixed inset-0 z-40" onClick={() => { setShowPatientDropdown(false); setShowServiceDropdown(false) }} />
      )}
    </div>
  )
}
