"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { BillingInvoice } from '@/src/types/billing.types'

export function InvoicePreview({ invoice }: { invoice: BillingInvoice | null }) {
  if (!invoice) return null

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between border-b pb-4">
        <div>
          <p className="text-lg font-semibold">ES Healthcare Centre</p>
          <p className="text-sm text-slate-500">Invoice No: {invoice.invoiceNumber}</p>
          <p className="text-sm text-slate-500">Date: {new Date(invoice.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="text-right text-sm text-slate-500">
          <p>{invoice.patient.name}</p>
          <p>UHID: {invoice.patient.uhid}</p>
          <p>{invoice.patient.phone}</p>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        {invoice.items.map((item) => (
          <div key={item.id} className="flex items-center justify-between text-sm">
            <span>{item.itemName}</span>
            <span>₹{item.amount}</span>
          </div>
        ))}
      </div>
      <div className="mt-6 space-y-2 border-t pt-4 text-sm">
        <div className="flex justify-between"><span>Subtotal</span><span>₹{invoice.subtotal}</span></div>
        <div className="flex justify-between"><span>Discount</span><span>-₹{invoice.discountAmount}</span></div>
        <div className="flex justify-between"><span>Tax</span><span>₹{invoice.taxAmount}</span></div>
        <div className="flex justify-between font-semibold"><span>Grand Total</span><span>₹{invoice.grandTotal}</span></div>
        <div className="flex justify-between"><span>Deposit</span><span>₹{invoice.depositAmount}</span></div>
        <div className="flex justify-between"><span>Paid</span><span>₹{invoice.amountReceived}</span></div>
        <div className="flex justify-between"><span>Due</span><span>₹{invoice.dueAmount}</span></div>
      </div>
      <div className="mt-8 flex items-end justify-between border-t pt-4 text-sm text-slate-500">
        <div>Payment Mode: {invoice.paymentMode}</div>
        <div>Authorized Signature</div>
      </div>
    </div>
  )
}
