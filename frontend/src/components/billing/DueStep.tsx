import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { BillingInvoice } from '@/src/types/billing.types'

export function DueStep({ invoice }: { invoice: BillingInvoice }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Due Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm"><span>Subtotal</span><span>₹{invoice.subtotal}</span></div>
        <div className="flex items-center justify-between text-sm"><span>Discount</span><span>-₹{invoice.discountAmount}</span></div>
        <div className="flex items-center justify-between text-sm"><span>Tax</span><span>₹{invoice.taxAmount}</span></div>
        <div className="flex items-center justify-between text-sm"><span>Grand Total</span><span className="font-semibold">₹{invoice.grandTotal}</span></div>
        <div className="flex items-center justify-between text-sm"><span>Deposit</span><span>₹{invoice.depositAmount}</span></div>
        <div className="flex items-center justify-between text-sm"><span>Amount Received</span><span>₹{invoice.amountReceived}</span></div>
        <div className="flex items-center justify-between text-sm"><span>Due Amount</span><span className="font-semibold text-red-600">₹{invoice.dueAmount}</span></div>
        <div className="flex items-center justify-between text-sm"><span>Payment Status</span><span>{invoice.paymentStatus}</span></div>
      </CardContent>
    </Card>
  )
}
