'use client'

import { useEffect, useState } from 'react'
import { Eye, Download, Share2, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import { StatusBadge } from '@/components/status-badge'
import { MessagePreview } from '@/components/message-preview'
import { Button } from '@/components/ui/button'
import { SERVICE_MASTER } from '@/src/config/serviceMaster'
import { ESHEALTH_TEST_MASTER } from '@/src/config/testMaster'
import { PACKAGE_MASTER } from '@/src/config/packageMaster'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Field, FieldLabel, FieldGroup } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { inr } from '@/lib/format'
import { CENTRE, PAYMENT_MODES, CURRENT_USER } from '@/lib/constants'
import { useHealthcare, type Invoice, type InvoiceStatus } from '@/lib/store'

const INVOICE_STATUSES: InvoiceStatus[] = [
  'Draft',
  'Pending',
  'Partially Paid',
  'Paid',
]

export function BillingTab({
  uhid,
  patientName,
}: {
  uhid: string
  patientName: string
}) {
  const { invoicesFor, updateInvoice, deleteInvoice, getPatient } = useHealthcare()
  const invoices = invoicesFor(uhid)
  const patient = getPatient(uhid)
  const [share, setShare] = useState<Invoice | null>(null)
  const [edit, setEdit] = useState<Invoice | null>(null)
  const [view, setView] = useState<Invoice | null>(null)

  // Editable fields
  const [paid, setPaid] = useState(0)
  const [discount, setDiscount] = useState(0)
  const [status, setStatus] = useState<InvoiceStatus>('Pending')
  const [paymentMode, setPaymentMode] = useState('')
  const [transactionId, setTransactionId] = useState('')
  const [remarks, setRemarks] = useState('')

  useEffect(() => {
    if (edit) {
      setPaid(edit.paid)
      setDiscount(edit.discount)
      setStatus(edit.status)
      setPaymentMode(edit.paymentMode ?? '')
      setTransactionId(edit.transactionId ?? '')
      setRemarks(edit.remarks ?? '')
    }
  }, [edit])

  // Recompute total & balance from the edited discount / payment.
  const newTotal = edit ? edit.subtotal + edit.tax - discount : 0
  const newBalance = Math.max(newTotal - paid, 0)

  function saveEdit() {
    if (!edit) return
    let derivedStatus = status
    if (newBalance <= 0 && newTotal > 0) derivedStatus = 'Paid'
    else if (paid > 0 && newBalance > 0) derivedStatus = 'Partially Paid'

    updateInvoice(edit.id, {
      paid,
      discount,
      total: newTotal,
      balance: newBalance,
      status: derivedStatus,
      paymentMode: paymentMode || undefined,
      transactionId: transactionId || undefined,
      remarks: remarks || undefined,
    })
    toast.success(`${edit.id} updated`)
    setEdit(null)
  }

  const invoiceContent = view && (
    <div className="p-8 bg-white font-sans text-sm text-black w-full">
      {/* Header Logo */}
      <div className="flex justify-center mb-4 border-b-2 border-black pb-4">
        <img src="/es-logo.jpg" alt="ES Healthcare" className="h-16 object-contain" />
      </div>

      {/* Patient Info Grid */}
      <div className="grid grid-cols-2 gap-x-8 gap-y-2 mb-4 border-b-2 border-black pb-4 font-medium text-xs">
        <div className="grid grid-cols-[120px_1fr] gap-2">
          <span className="font-bold">UHID</span>
          <span>{patient?.uhid || uhid}</span>
          <span className="font-bold">Patient Name</span>
          <span>{patientName}</span>
          <span className="font-bold">Contact Number</span>
          <span>{patient?.phone}</span>
          <span className="font-bold">Consultant Name</span>
          <span>{patient?.assignedDepartment || '-'}</span>
          <span className="font-bold">Tariff</span>
          <span>{patient?.patientCategory || 'self'}</span>
        </div>
        <div className="grid grid-cols-[120px_1fr] gap-2">
          <span className="font-bold">Bill Number</span>
          <span>{view.id.length > 20 ? `INV-${view.id.substring(0, 6).toUpperCase()}` : view.id}</span>
          <span className="font-bold">Visit Id</span>
          <span>{view.id.length > 20 ? `VIS-${view.id.substring(0, 6).toUpperCase()}` : view.id}</span>
          <span className="font-bold">Bill Date and Time</span>
          <span>{view.date ? new Date(view.date).toLocaleString('en-GB') : '-'}</span>
          <span className="font-bold">Reg. Date Time</span>
          <span>{patient?.registeredOn ? new Date(patient?.registeredOn).toLocaleString('en-GB') : '-'}</span>
        </div>
      </div>

      <div className="text-center mb-4">
        <h3 className="text-lg font-bold">OP BILL</h3>
      </div>

      {/* Particulars Table */}
      <div className="mb-6">
        <table className="w-full border-collapse border border-slate-300 text-xs">
          <thead>
            <tr className="bg-slate-50">
              <th className="border border-slate-300 p-2 text-left font-bold w-12">S.No.</th>
              <th className="border border-slate-300 p-2 text-left font-bold">Particular</th>
              <th className="border border-slate-300 p-2 text-left font-bold w-16">Qty</th>
              <th className="border border-slate-300 p-2 text-left font-bold w-24">Amount</th>
              <th className="border border-slate-300 p-2 text-left font-bold w-24">Net Amt.</th>
            </tr>
          </thead>
          <tbody>
            {view.items && view.items.length > 0 ? (
              view.items.map((item: any, idx: number) => (
                <tr key={idx}>
                  <td className="border border-slate-300 p-2">{idx + 1}</td>
                  <td className="border border-slate-300 p-2">{item.itemName}</td>
                  <td className="border border-slate-300 p-2">{item.qty}</td>
                  <td className="border border-slate-300 p-2">{Number(item.price).toFixed(2)}</td>
                  <td className="border border-slate-300 p-2">{Number(item.total).toFixed(2)}</td>
                </tr>
              ))
            ) : view.service.includes(':') ? (
              view.service.split(':')[1].split(',').map((testName, idx) => {
                const name = testName.trim()
                const foundService = SERVICE_MASTER.find(s => s.name.toLowerCase() === name.toLowerCase())
                const foundTest = ESHEALTH_TEST_MASTER.find(t => t.name.toLowerCase() === name.toLowerCase())
                const foundPkg = PACKAGE_MASTER.find(p => p.name.toLowerCase() === name.toLowerCase())
                const price = foundService?.price ?? foundTest?.price ?? foundPkg?.price ?? ''
                return (
                  <tr key={idx}>
                    <td className="border border-slate-300 p-2">{idx + 1}</td>
                    <td className="border border-slate-300 p-2">{name}</td>
                    <td className="border border-slate-300 p-2">1</td>
                    <td className="border border-slate-300 p-2">{price ? Number(price).toFixed(0) : ''}</td>
                    <td className="border border-slate-300 p-2">{price ? Number(price).toFixed(0) : ''}</td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td className="border border-slate-300 p-2">1</td>
                <td className="border border-slate-300 p-2">{view.service}</td>
                <td className="border border-slate-300 p-2">1</td>
                <td className="border border-slate-300 p-2">{view.subtotal}</td>
                <td className="border border-slate-300 p-2">{view.subtotal}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Receipt Details Table */}
      <h3 className="font-bold text-sm mb-2">Receipt Details</h3>
      <div className="mb-4">
        <table className="w-full border-collapse border border-slate-300 text-xs">
          <thead>
            <tr className="bg-slate-50">
              <th className="border border-slate-300 p-2 text-left font-bold">Mode</th>
              <th className="border border-slate-300 p-2 text-left font-bold">Bank Name</th>
              <th className="border border-slate-300 p-2 text-left font-bold">Transaction No</th>
              <th className="border border-slate-300 p-2 text-left font-bold">Transaction Type</th>
              <th className="border border-slate-300 p-2 text-left font-bold">Receipt Date Time</th>
              <th className="border border-slate-300 p-2 text-left font-bold">Amount</th>
              <th className="border border-slate-300 p-2 text-left font-bold">Receipt/Refund No</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-slate-300 p-2">{view.paymentMode || '-'}</td>
              <td className="border border-slate-300 p-2">{view.remarks?.split('|')[0]?.replace('Bank:', '')?.trim() || '-'}</td>
              <td className="border border-slate-300 p-2">{view.transactionId || '-'}</td>
              <td className="border border-slate-300 p-2">Paid Settlement</td>
              <td className="border border-slate-300 p-2">{view.date ? new Date(view.date).toLocaleString('en-GB') : '-'}</td>
              <td className="border border-slate-300 p-2">{view.paid || '0'}</td>
              <td className="border border-slate-300 p-2"></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end text-xs font-medium mb-16">
        <div className="w-64 space-y-1 text-right">
          <div className="flex justify-end gap-4"><span className="font-bold w-32">Total Amount</span><span>{Number(view.subtotal).toFixed(1)}</span></div>
          <div className="flex justify-end gap-4"><span className="font-bold w-32">Payable Amount</span><span>{Number(view.total).toFixed(1)}</span></div>
          <div className="flex justify-end gap-4"><span className="font-bold w-32">Paid Amount</span><span>{Number(view.paid).toFixed(1)}</span></div>
          <div className="flex justify-end gap-4"><span className="font-bold w-32">Refunded Amount</span><span>0</span></div>
        </div>
      </div>

      {/* Signatures */}
      <div className="grid grid-cols-3 gap-4 text-xs mt-12 pt-8">
        <div>
          <p className="font-bold mb-1">Printed By</p>
          <p>{new Date().toLocaleString('en-GB')}</p>
        </div>
        <div className="text-center">
          <p className="font-bold mb-1">Created By</p>
          <p>{CURRENT_USER.name}</p>
        </div>
        <div className="text-right">
          <p className="font-bold mt-4">{CURRENT_USER.name}</p>
        </div>
      </div>
      
      {/* Footer text */}
      <div className="mt-8 text-center text-[10px] text-gray-500 border-t pt-4">
        <p className="font-bold text-gray-400 mb-1">CHANGING THE WAY OF HEALTHCARE</p>
        <p>📞 079 61 61 61 61 ✉ info@eshs.in CIN : U74999GJ2021PTC127536</p>
        <p>📍 ES Healthcare Centre, Ground floor, YSL Avenue, Dr Vikram Sarabhai Marg, opposite Ketav Petrol Pump, Ambawadi, Ahmedabad, Gujarat 380006</p>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Full Print Container (Hidden on screen, covers entire screen on print) */}
      <div className="hidden print:block fixed inset-0 m-0 p-0 bg-white z-[99999] w-full min-h-screen print:w-screen print:h-screen">
        {invoiceContent}
      </div>

      {/* The normal screen layout is hidden during print */}
      <div className="print:hidden space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Billing History</CardTitle>
            <CardDescription>Invoices linked to this patient.</CardDescription>
          </CardHeader>
          <CardContent>
            {invoices.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No invoices for this patient yet.
              </p>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40 hover:bg-muted/40">
                      <TableHead>Invoice No</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Services</TableHead>
                      <TableHead className="text-right">Subtotal</TableHead>
                      <TableHead className="text-right">Tax</TableHead>
                      <TableHead className="text-right">Discount</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="text-right">Paid</TableHead>
                      <TableHead className="text-right">Balance</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((i) => (
                      <TableRow key={i.id}>
                        <TableCell className="font-medium tabular-nums">
                          {i.id.length > 20 ? `INV-${i.id.substring(0, 6).toUpperCase()}` : i.id}
                        </TableCell>
                        <TableCell>{i.date ? new Date(i.date).toLocaleDateString('en-GB') : '-'}</TableCell>
                        <TableCell>{i.service.includes(':') ? i.service.split(':')[0] : i.service}</TableCell>
                        <TableCell className="text-right tabular-nums">{inr(i.subtotal)}</TableCell>
                        <TableCell className="text-right tabular-nums">{inr(i.tax)}</TableCell>
                        <TableCell className="text-right tabular-nums">{inr(i.discount)}</TableCell>
                        <TableCell className="text-right font-medium tabular-nums">{inr(i.total)}</TableCell>
                        <TableCell className="text-right tabular-nums">{inr(i.paid)}</TableCell>
                        <TableCell className="text-right tabular-nums">{inr(i.balance)}</TableCell>
                        <TableCell><StatusBadge status={i.status} /></TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon-sm" aria-label="Edit invoice" onClick={() => setEdit(i)}>
                              <Pencil />
                            </Button>
                            <Button variant="ghost" size="icon-sm" aria-label="Delete invoice" onClick={() => { if(confirm('Are you sure you want to delete this invoice?')) deleteInvoice(i.id) }}>
                              <Trash2 className="text-red-500" />
                            </Button>
                            <Button variant="ghost" size="icon-sm" aria-label="View invoice" onClick={() => setView(i)}>
                              <Eye />
                            </Button>
                            <Button variant="ghost" size="icon-sm" aria-label="Download invoice" onClick={() => { setView(i); setTimeout(() => window.print(), 500); }}>
                              <Download />
                            </Button>
                            <Button variant="ghost" size="icon-sm" aria-label="Share invoice" onClick={() => setShare(i)}>
                              <Share2 />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* View Invoice Dialog (For Screen ONLY) */}
        <Dialog open={view !== null} onOpenChange={(o) => !o && setView(null)}>
          <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto bg-white text-black">
            <DialogHeader>
              <DialogTitle>Invoice Details</DialogTitle>
            </DialogHeader>
            
            {invoiceContent}

            <DialogFooter className="mt-6 flex gap-2 sm:justify-end">
              <Button variant="outline" onClick={() => setView(null)}>Close</Button>
              <Button onClick={() => window.print()}><Download className="w-4 h-4 mr-2" /> Print / Download</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit invoice payment / status */}
        <Dialog open={edit !== null} onOpenChange={(o) => !o && setEdit(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Invoice — {edit?.id && edit.id.length > 20 ? `INV-${edit.id.substring(0, 6).toUpperCase()}` : edit?.id}</DialogTitle>
              <DialogDescription>
                Update payment, discount and status for this invoice.
              </DialogDescription>
            </DialogHeader>
            {edit && (
            <FieldGroup className="px-0.5">
              <div className="flex items-center justify-between rounded-md border border-border bg-muted/30 px-3 py-2 text-sm">
                <span className="text-muted-foreground">Subtotal + Tax</span>
                <span className="font-medium tabular-nums">
                  {inr(edit.subtotal + edit.tax)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <Field>
                  <FieldLabel htmlFor="inv-discount">Discount (₹)</FieldLabel>
                  <Input
                    id="inv-discount"
                    type="number"
                    min={0}
                    value={String(discount)}
                    onChange={(e) => setDiscount(Number(e.target.value) || 0)}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="inv-paid">Amount Paid (₹)</FieldLabel>
                  <Input
                    id="inv-paid"
                    type="number"
                    min={0}
                    value={String(paid)}
                    onChange={(e) => setPaid(Number(e.target.value) || 0)}
                  />
                </Field>
              </div>
              <div className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm">
                <span className="text-muted-foreground">New Total / Balance</span>
                <span className="font-medium tabular-nums">
                  {inr(newTotal)} / {inr(newBalance)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <Field>
                  <FieldLabel>Payment Mode</FieldLabel>
                  <Select value={paymentMode} onValueChange={(v) => setPaymentMode(v ?? '')}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      {PAYMENT_MODES.map((m) => (
                        <SelectItem key={m} value={m}>
                          {m}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel>Status</FieldLabel>
                  <Select
                    value={status}
                    onValueChange={(v) => setStatus(v as InvoiceStatus)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      {INVOICE_STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>
              <Field>
                <FieldLabel htmlFor="inv-txn">Transaction ID</FieldLabel>
                <Input
                  id="inv-txn"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="Optional reference"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="inv-remarks">Remarks</FieldLabel>
                <Textarea
                  id="inv-remarks"
                  rows={2}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Optional notes..."
                />
              </Field>
            </FieldGroup>
          )}
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
            <Button onClick={saveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={share !== null} onOpenChange={(o) => !o && setShare(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Bill — {(share?.id?.length ?? 0) > 20 ? `INV-${share?.id.substring(0, 6).toUpperCase()}` : share?.id}</DialogTitle>
            <DialogDescription>Send the invoice summary to the patient.</DialogDescription>
          </DialogHeader>
          {share && (
            <MessagePreview
              message={`Hello ${patientName}, your bill from ${CENTRE.name} for ${share.service.includes(':') ? share.service.split(':')[0] : share.service} is ready. Invoice No: ${share.id.length > 20 ? `INV-${share.id.substring(0, 6).toUpperCase()}` : share.id}. Total Amount: ${inr(share.total)}. Thank you for choosing ${CENTRE.name}. For assistance call ${CENTRE.phone}.`}
              patientPhone={patient?.phone}
              patientEmail={patient?.email}
              actions={['sms', 'whatsapp', 'download', 'call']}
              onDownload={() => {
                setView(share)
                setTimeout(() => window.print(), 100)
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  </div>
)
}
