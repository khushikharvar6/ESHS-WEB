import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function DepositStep({
  depositAmount,
  depositMode,
  depositReference,
  depositDate,
  onChange,
}: {
  depositAmount: number
  depositMode: string
  depositReference: string
  depositDate: string
  onChange: (field: 'depositAmount' | 'depositMode' | 'depositReference' | 'depositDate', value: string | number) => void
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Deposit</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Deposit Amount</Label>
            <Input type="number" value={depositAmount} onChange={(e) => onChange('depositAmount', Number(e.target.value))} />
          </div>
          <div className="space-y-2">
            <Label>Deposit Mode</Label>
            <Select value={depositMode} onValueChange={(value) => onChange('depositMode', value ?? '')}>
              <SelectTrigger>
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UPI">UPI</SelectItem>
                <SelectItem value="Card">Card</SelectItem>
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="Insurance">Insurance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Deposit Reference</Label>
            <Input value={depositReference} onChange={(e) => onChange('depositReference', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Deposit Date</Label>
            <Input type="date" value={depositDate} onChange={(e) => onChange('depositDate', e.target.value)} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
