"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import type { BillingInvoice } from '@/src/types/billing.types'

export function ShareBillDialog({
  open,
  invoice,
  onOpenChange,
  onFeedback,
}: {
  open: boolean
  invoice: BillingInvoice | null
  onOpenChange: (open: boolean) => void
  onFeedback: () => void
}) {
  if (!invoice) return null

  const message = `Hello ${invoice.patient.name}, your bill from ES Healthcare Centre for ${invoice.items.map((item) => item.itemName).join(', ')} is ready.\nInvoice No: ${invoice.invoiceNumber}\nTotal Amount: ₹${invoice.grandTotal}\nThank you for choosing ES Healthcare Centre.\nFor assistance call +917961616161.`

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Share Bill</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="rounded-lg border bg-slate-50 p-4 text-sm text-slate-700 whitespace-pre-line">{message}</div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm">Send SMS</Button>
            <Button size="sm" variant="outline">Send WhatsApp</Button>
            <Button size="sm" variant="outline">Download Invoice</Button>
            <Button size="sm" variant="outline">Call Patient</Button>
            <Button size="sm" onClick={onFeedback}>Proceed to Feedback</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
