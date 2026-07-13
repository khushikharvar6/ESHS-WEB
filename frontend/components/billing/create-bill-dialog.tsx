'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'motion/react'
import {
  Check,
  ChevronLeft,
  Printer,
  FileText,
  Smartphone,
  CreditCard,
  Banknote,
  ShieldCheck,
  Mail,
  MessageSquare,
  MessageCircle,
  MapPin,
  Minus,
  Plus,
} from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Field, FieldLabel } from '@/components/ui/field'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { StatusBadge } from '@/components/status-badge'
import { cn } from '@/lib/utils'
import { inr } from '@/lib/format'
import {
  SERVICE_PRICES,
  GST_RATE,
  PAYMENT_MODES,
  type PaymentMode,
} from '@/lib/constants'
import { useHealthcare, type Invoice, type Patient } from '@/lib/store'

const STEPS = [
  'Billing Summary',
  'Discount',
  'Deposit',
  'Payment Details',
  'Due',
  'Report Dispatch',
  'Remarks',
] as const
type Step = (typeof STEPS)[number]

const MODE_ICONS: Record<PaymentMode, typeof Smartphone> = {
  UPI: Smartphone,
  Card: CreditCard,
  Cash: Banknote,
  Insurance: ShieldCheck,
}

type LineItem = { service: string; qty: number; unitPrice: number }

const DISPATCH_OPTIONS = [
  { key: 'SMS', icon: MessageSquare },
  { key: 'WhatsApp', icon: Smartphone },
  { key: 'Email', icon: Mail },
  { key: 'Print', icon: Printer },
  { key: 'Hand Delivery', icon: MapPin },
] as const

export function CreateBillDialog({
  open,
  onOpenChange,
  patient,
  onCreated,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  patient?: Patient | null
  onCreated?: (invoice: Invoice) => void
}) {
  const { patients, addInvoice } = useHealthcare()
  const [step, setStep] = useState<Step>('Billing Summary')

  const [uhid, setUhid] = useState<string>(patient?.uhid ?? '')
  const selected = useMemo(
    () => patients.find((p) => p.uhid === uhid) ?? null,
    [patients, uhid],
  )

  const [items, setItems] = useState<LineItem[]>([])
  const [discountType, setDiscountType] = useState<'Percentage' | 'Flat'>('Percentage')
  const [discountValue, setDiscountValue] = useState(0)
  const [discountReason, setDiscountReason] = useState('')
  const [deposit, setDeposit] = useState(0)
  const [depositDate, setDepositDate] = useState('')
  const [mode, setMode] = useState<PaymentMode | ''>('')
  const [amountReceived, setAmountReceived] = useState(0)
  const [txnId, setTxnId] = useState('')
  const [insurer, setInsurer] = useState('')
  const [policyNo, setPolicyNo] = useState('')
  const [approvedAmount, setApprovedAmount] = useState(0)
  const [tpaRef, setTpaRef] = useState('')
  const [dispatch, setDispatch] = useState<string[]>(['SMS'])
  const [expectedClearance, setExpectedClearance] = useState('')
  const [remarks, setRemarks] = useState('')
  const [referredBy, setReferredBy] = useState('')

  // reset each time the dialog opens for a (new) patient
  useEffect(() => {
    if (!open) return
    setStep('Billing Summary')
    const uid = patient?.uhid ?? ''
    setUhid(uid)
    const svc = patient?.service
    setItems(
      svc ? [{ service: svc, qty: 1, unitPrice: SERVICE_PRICES[svc] ?? 1000 }] : [],
    )
    setDiscountType('Percentage')
    setDiscountValue(0)
    setDiscountReason('')
    setDeposit(0)
    setDepositDate('')
    setMode('')
    setAmountReceived(0)
    setTxnId('')
    setInsurer('')
    setPolicyNo('')
    setApprovedAmount(0)
    setTpaRef('')
    setDispatch(['SMS'])
    setExpectedClearance('')
    setRemarks('')
    setReferredBy('')
  }, [open, patient])

  // when patient picked inside the dialog, seed a line item
  useEffect(() => {
    if (!selected) return
    setItems((prev) =>
      prev.length
        ? prev
        : [
            {
              service: selected.service,
              qty: 1,
              unitPrice: SERVICE_PRICES[selected.service] ?? 1000,
            },
          ],
    )
  }, [selected])

  const subtotal = items.reduce((s, i) => s + i.qty * i.unitPrice, 0)
  const discountAmount =
    discountType === 'Percentage'
      ? Math.round((subtotal * discountValue) / 100)
      : discountValue
  const taxable = Math.max(subtotal - discountAmount, 0)
  const tax = Math.round(taxable * GST_RATE)
  const total = taxable + tax
  const paid = amountReceived + deposit
  const balance = Math.max(total - paid, 0)
  const dueStatus: Invoice['status'] =
    paid <= 0 ? 'Pending' : balance > 0 ? 'Partially Paid' : 'Paid'

  function setQty(idx: number, delta: number) {
    setItems((prev) =>
      prev.map((it, i) =>
        i === idx ? { ...it, qty: Math.max(1, it.qty + delta) } : it,
      ),
    )
  }

  function persist(status: Invoice['status']) {
    if (!selected) {
      toast.error('Select a patient first')
      setStep('Billing Summary')
      return null
    }
    const created = addInvoice({
      uhid: selected.uhid,
      patient: selected.name,
      service: items.map((i) => i.service).join(', ') || selected.service,
      date: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      subtotal,
      tax,
      discount: discountAmount,
      total,
      paid,
      balance,
      status,
      paymentMode: mode || undefined,
      transactionId: txnId || undefined,
      remarks: remarks || undefined,
    })
    return created
  }

  function handleCreate(print = false) {
    const created = persist(dueStatus)
    if (!created) return
    onCreated?.(created)
    onOpenChange(false)
    if (print) {
      toast.success(`Invoice ${created.id} created — opening print view`)
    } else {
      toast.success(`Invoice ${created.id} created`)
    }
  }

  function handleDraft() {
    const created = persist('Draft')
    if (!created) return
    toast.success(`Draft ${created.id} saved`)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-1rem)] max-w-4xl overflow-hidden p-0 sm:max-w-4xl">
        <DialogHeader className="border-b border-border px-6 py-4">
          <DialogTitle>Create Bill</DialogTitle>
          <DialogDescription>
            {selected
              ? `${selected.name} · ${selected.uhid}`
              : 'Select a patient to begin billing.'}
          </DialogDescription>
        </DialogHeader>

        <div className="flex max-h-[70vh] flex-col md:flex-row">
          {/* Vertical steps */}
          <ol className="flex shrink-0 gap-1 overflow-x-auto border-b border-border bg-muted/30 p-3 md:w-56 md:flex-col md:overflow-visible md:border-b-0 md:border-r">
            {STEPS.map((s, i) => {
              const activeIdx = STEPS.indexOf(step)
              const done = i < activeIdx
              const active = s === step
              return (
                <li key={s}>
                  <button
                    type="button"
                    onClick={() => setStep(s)}
                    className={cn(
                      'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors',
                      active
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                    )}
                  >
                    <span
                      className={cn(
                        'flex size-5 shrink-0 items-center justify-center rounded-full border text-[11px]',
                        active
                          ? 'border-primary-foreground/60'
                          : done
                            ? 'border-transparent bg-primary text-primary-foreground'
                            : 'border-border',
                      )}
                    >
                      {done ? <Check className="size-3" /> : i + 1}
                    </span>
                    <span className="whitespace-nowrap">{s}</span>
                  </button>
                </li>
              )
            })}
          </ol>

          {/* Right panel */}
          <div className="flex-1 overflow-y-auto p-6">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18 }}
            >
              {step === 'Billing Summary' && (
                <div className="flex flex-col gap-4">
                  <Field>
                    <FieldLabel>Patient</FieldLabel>
                    <Select value={uhid} onValueChange={(value) => setUhid(value ?? '')}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select patient by UHID / name" />
                      </SelectTrigger>
                      <SelectContent>
                        {patients.map((p) => (
                          <SelectItem key={p.uhid} value={p.uhid}>
                            {p.name} · {p.uhid}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>

                  {selected && (
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 rounded-lg border border-border bg-muted/30 p-3 text-sm sm:grid-cols-4">
                      <Info label="UHID" value={selected.uhid} />
                      <Info label="Name" value={selected.name} />
                      <Info
                        label="Age / Gender"
                        value={`${selected.age} / ${selected.gender}`}
                      />
                      <Info label="Phone" value={selected.phone} />
                    </div>
                  )}

                  <Field>
                    <FieldLabel>Referred By</FieldLabel>
                    <Select value={referredBy} onValueChange={(v) => setReferredBy(v ?? '')}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select reference" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Doctor">Doctor</SelectItem>
                        <SelectItem value="Corporate Tie-up">Corporate Tie-up</SelectItem>
                        <SelectItem value="Existing Patient">Existing Patient</SelectItem>
                        <SelectItem value="Camps/community Activity">Camps/community Activity</SelectItem>
                        <SelectItem value="Insurance/TPA">Insurance/TPA</SelectItem>
                        <SelectItem value="Other">Other_______</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>

                  <div className="overflow-hidden rounded-lg border border-border">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                        <tr>
                          <th className="px-3 py-2 text-left font-medium">Service</th>
                          <th className="px-3 py-2 text-center font-medium">Qty</th>
                          <th className="px-3 py-2 text-right font-medium">Unit Price</th>
                          <th className="px-3 py-2 text-right font-medium">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((it, idx) => (
                          <tr key={idx} className="border-t border-border">
                            <td className="px-3 py-2">{it.service}</td>
                            <td className="px-3 py-2">
                              <div className="flex items-center justify-center gap-1">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  className="size-6"
                                  onClick={() => setQty(idx, -1)}
                                >
                                  <Minus className="size-3" />
                                </Button>
                                <span className="w-6 text-center tabular-nums">
                                  {it.qty}
                                </span>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  className="size-6"
                                  onClick={() => setQty(idx, 1)}
                                >
                                  <Plus className="size-3" />
                                </Button>
                              </div>
                            </td>
                            <td className="px-3 py-2 text-right tabular-nums">
                              {inr(it.unitPrice)}
                            </td>
                            <td className="px-3 py-2 text-right tabular-nums">
                              {inr(it.qty * it.unitPrice)}
                            </td>
                          </tr>
                        ))}
                        {items.length === 0 && (
                          <tr>
                            <td
                              colSpan={4}
                              className="px-3 py-6 text-center text-muted-foreground"
                            >
                              Select a patient to load their availed services.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  <SummaryTotals
                    subtotal={subtotal}
                    discount={discountAmount}
                    tax={tax}
                    total={total}
                  />
                </div>
              )}

              {step === 'Discount' && (
                <div className="flex max-w-md flex-col gap-4">
                  <Field>
                    <FieldLabel>Discount Type</FieldLabel>
                    <Select
                      value={discountType}
                      onValueChange={(v) =>
                        setDiscountType(v as 'Percentage' | 'Flat')
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Percentage">Percentage (%)</SelectItem>
                        <SelectItem value="Flat">Flat (₹)</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="disc-val">Discount Value</FieldLabel>
                    <Input
                      id="disc-val"
                      type="number"
                      min={0}
                      value={discountValue || ''}
                      onChange={(e) => setDiscountValue(Number(e.target.value))}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="disc-reason">Reason</FieldLabel>
                    <Input
                      id="disc-reason"
                      value={discountReason}
                      onChange={(e) => setDiscountReason(e.target.value)}
                      placeholder="e.g. Senior citizen, staff, camp"
                    />
                  </Field>
                  <SummaryTotals
                    subtotal={subtotal}
                    discount={discountAmount}
                    tax={tax}
                    total={total}
                  />
                </div>
              )}

              {step === 'Deposit' && (
                <div className="flex max-w-md flex-col gap-4">
                  <Field>
                    <FieldLabel htmlFor="dep-amt">Advance / Deposit Received</FieldLabel>
                    <Input
                      id="dep-amt"
                      type="number"
                      min={0}
                      value={deposit || ''}
                      onChange={(e) => setDeposit(Number(e.target.value))}
                      placeholder="₹0"
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="dep-date">Deposit Date</FieldLabel>
                    <Input
                      id="dep-date"
                      type="date"
                      value={depositDate}
                      onChange={(e) => setDepositDate(e.target.value)}
                    />
                  </Field>
                  <div className="rounded-lg border border-border bg-muted/30 p-3 text-sm">
                    Deposit of <strong>{inr(deposit)}</strong> will be adjusted
                    against the total of <strong>{inr(total)}</strong>.
                  </div>
                </div>
              )}

              {step === 'Payment Details' && (
                <div className="flex flex-col gap-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground">
                      Payment Details
                    </h3>
                    <span className="text-xs uppercase tracking-wide text-muted-foreground">
                      Tab Form Configuration
                    </span>
                  </div>

                  <div>
                    <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Select Active Mode of Settlement
                    </p>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {PAYMENT_MODES.map((m) => {
                        const Icon = MODE_ICONS[m]
                        const activeMode = mode === m
                        return (
                          <button
                            key={m}
                            type="button"
                            onClick={() => setMode(m)}
                            aria-pressed={activeMode}
                            className={cn(
                              'flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-colors',
                              activeMode
                                ? 'border-primary bg-primary/5 text-primary'
                                : 'border-border text-muted-foreground hover:border-primary/40',
                            )}
                          >
                            <Icon className="size-6" />
                            <span className="text-sm font-medium">{m}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field>
                      <FieldLabel htmlFor="amt-recv">Amount Received</FieldLabel>
                      <Input
                        id="amt-recv"
                        type="number"
                        min={0}
                        value={amountReceived || ''}
                        onChange={(e) => setAmountReceived(Number(e.target.value))}
                        placeholder={`e.g. ${inr(total)}`}
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="txn-id">
                        Transaction ID / Reference Number
                      </FieldLabel>
                      <Input
                        id="txn-id"
                        value={txnId}
                        onChange={(e) => setTxnId(e.target.value)}
                        placeholder="TXN-324203493"
                      />
                    </Field>
                  </div>

                  {mode === 'Insurance' && (
                    <div className="grid grid-cols-1 gap-4 rounded-lg border border-border bg-muted/30 p-4 sm:grid-cols-2">
                      <Field>
                        <FieldLabel htmlFor="insurer">Insurance Provider</FieldLabel>
                        <Input
                          id="insurer"
                          value={insurer}
                          onChange={(e) => setInsurer(e.target.value)}
                        />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="policy">Policy Number</FieldLabel>
                        <Input
                          id="policy"
                          value={policyNo}
                          onChange={(e) => setPolicyNo(e.target.value)}
                        />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="approved">Approved Amount</FieldLabel>
                        <Input
                          id="approved"
                          type="number"
                          min={0}
                          value={approvedAmount || ''}
                          onChange={(e) => setApprovedAmount(Number(e.target.value))}
                        />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="tpa">TPA Reference</FieldLabel>
                        <Input
                          id="tpa"
                          value={tpaRef}
                          onChange={(e) => setTpaRef(e.target.value)}
                        />
                      </Field>
                    </div>
                  )}
                </div>
              )}

              {step === 'Due' && (
                <div className="flex max-w-md flex-col gap-4">
                  <SummaryTotals
                    subtotal={subtotal}
                    discount={discountAmount}
                    tax={tax}
                    total={total}
                  />
                  <div className="flex items-center justify-between rounded-lg border border-border p-3 text-sm">
                    <span className="text-muted-foreground">Paid (incl. deposit)</span>
                    <span className="font-medium tabular-nums">{inr(paid)}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-border p-3">
                    <span className="text-sm text-muted-foreground">Balance Due</span>
                    <span className="text-lg font-semibold tabular-nums text-foreground">
                      {inr(balance)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <StatusBadge status={dueStatus} />
                  </div>
                  {balance > 0 && (
                    <Field>
                      <FieldLabel htmlFor="clearance">
                        Expected Clearance Date
                      </FieldLabel>
                      <Input
                        id="clearance"
                        type="date"
                        value={expectedClearance}
                        onChange={(e) => setExpectedClearance(e.target.value)}
                      />
                    </Field>
                  )}
                </div>
              )}

              {step === 'Report Dispatch' && (
                <div className="flex max-w-md flex-col gap-4">
                  <p className="text-sm text-muted-foreground">
                    How should the report / bill be sent?
                  </p>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {DISPATCH_OPTIONS.map(({ key, icon: Icon }) => {
                      const on = dispatch.includes(key)
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() =>
                            setDispatch((prev) =>
                              prev.includes(key)
                                ? prev.filter((d) => d !== key)
                                : [...prev, key],
                            )
                          }
                          aria-pressed={on}
                          className={cn(
                            'flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors',
                            on
                              ? 'border-primary bg-primary/5 text-primary'
                              : 'border-border text-muted-foreground hover:border-primary/40',
                          )}
                        >
                          <span
                            className={cn(
                              'flex size-4 items-center justify-center rounded border',
                              on
                                ? 'border-primary bg-primary text-primary-foreground'
                                : 'border-border',
                            )}
                          >
                            {on && <Check className="size-3" />}
                          </span>
                          <Icon className="size-4" />
                          {key}
                        </button>
                      )
                    })}
                  </div>
                  {selected && (
                    <div className="rounded-lg border border-border bg-muted/30 p-3 text-sm">
                      <p className="text-muted-foreground">Dispatch contact</p>
                      <p className="font-medium">{selected.phone}</p>
                      {selected.email && (
                        <p className="text-muted-foreground">{selected.email}</p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {step === 'Remarks' && (
                <div className="flex flex-col gap-3">
                  <Field>
                    <FieldLabel htmlFor="remarks">Remarks / Notes</FieldLabel>
                    <Textarea
                      id="remarks"
                      rows={5}
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      placeholder="Any notes for this bill..."
                    />
                  </Field>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Bottom action bar */}
        <div className="flex flex-wrap items-center gap-2 border-t border-border px-6 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              const idx = STEPS.indexOf(step)
              if (idx > 0) setStep(STEPS[idx - 1])
              else onOpenChange(false)
            }}
          >
            <ChevronLeft data-icon="inline-start" />
            Back
          </Button>
          <div className="ml-auto flex flex-wrap gap-2">
            <Button type="button" onClick={() => handleCreate(true)}>
              <Printer data-icon="inline-start" />
              Print Bill
            </Button>
            <Button
              type="button"
              className="bg-[#25D366] hover:bg-[#1da851] text-white flex items-center gap-2"
              onClick={() => {
                const created = persist(dueStatus)
                if (!created) return
                onCreated?.(created)
                onOpenChange(false)
                
                const link = `${window.location.origin}/invoice/${created.id}`
                const text = encodeURIComponent(`Dear ${selected?.name || 'Patient'}, your invoice for Rs. ${created.total} has been generated. Please find your detailed bill here: ${link} \n\nThank you for choosing ES Healthcare Centre!`)
                window.open(`https://wa.me/?text=${text}`, 'whatsapp_web')
              }}
            >
              <MessageCircle className="w-4 h-4" />
              Save &amp; Share
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  )
}

function SummaryTotals({
  subtotal,
  discount,
  tax,
  total,
}: {
  subtotal: number
  discount: number
  tax: number
  total: number
}) {
  return (
    <div className="ml-auto w-full max-w-xs space-y-1.5 rounded-lg border border-border p-3 text-sm">
      <Row label="Subtotal" value={inr(subtotal)} />
      {discount > 0 && <Row label="Discount" value={`- ${inr(discount)}`} />}
      <Row label="GST (18%)" value={inr(tax)} />
      <div className="mt-1 flex items-center justify-between border-t border-border pt-2">
        <span className="font-medium text-foreground">Total</span>
        <span className="font-semibold tabular-nums text-foreground">
          {inr(total)}
        </span>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="tabular-nums text-foreground">{value}</span>
    </div>
  )
}
