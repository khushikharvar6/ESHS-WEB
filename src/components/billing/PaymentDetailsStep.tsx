import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { PaymentMode } from '@/src/types/billing.types'

const paymentModes: PaymentMode[] = ['UPI', 'Card', 'Cash', 'Insurance']

export function PaymentDetailsStep({
  paymentMode,
  amountReceived,
  transactionReference,
  insurance,
  onChange,
}: {
  paymentMode: PaymentMode
  amountReceived: number
  transactionReference: string
  insurance: { provider: string; policyNumber: string; tpaReference: string; approvedAmount: number }
  onChange: (field: string, value: string | number) => void
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="rounded-lg border bg-slate-50 p-4">
          <p className="mb-3 text-sm font-semibold text-slate-700">Select Active Mode of Settlement</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {paymentModes.map((mode) => (
              <button
                key={mode}
                type="button"
                className={`rounded-lg border p-3 text-left text-sm font-medium ${paymentMode === mode ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-700'}`}
                onClick={() => onChange('paymentMode', mode)}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Amount Received</Label>
            <Input type="number" value={amountReceived} onChange={(e) => onChange('amountReceived', Number(e.target.value))} />
          </div>
          <div className="space-y-2">
            <Label>Transaction ID / Reference Number</Label>
            <Input value={transactionReference} onChange={(e) => onChange('transactionReference', e.target.value)} />
          </div>
        </div>
        {paymentMode === 'Insurance' ? (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Insurance Provider</Label>
              <Input value={insurance.provider} onChange={(e) => onChange('insurance.provider', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Policy Number</Label>
              <Input value={insurance.policyNumber} onChange={(e) => onChange('insurance.policyNumber', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>TPA Reference</Label>
              <Input value={insurance.tpaReference} onChange={(e) => onChange('insurance.tpaReference', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Approved Amount</Label>
              <Input type="number" value={insurance.approvedAmount} onChange={(e) => onChange('insurance.approvedAmount', Number(e.target.value))} />
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
