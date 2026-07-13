import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { DiscountType } from '@/src/types/billing.types'

export function DiscountStep({
  discountType,
  discountValue,
  discountReason,
  onChange,
}: {
  discountType: DiscountType
  discountValue: number
  discountReason: string
  onChange: (field: 'discountType' | 'discountValue' | 'discountReason', value: string | number) => void
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Discount</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Discount Type</Label>
            <Select value={discountType} onValueChange={(value) => onChange('discountType', value ?? '')}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percentage">Percentage</SelectItem>
                <SelectItem value="flat">Flat Amount</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Discount Value</Label>
            <Input type="number" value={discountValue} onChange={(e) => onChange('discountValue', Number(e.target.value))} />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Discount Reason</Label>
          <Input value={discountReason} onChange={(e) => onChange('discountReason', e.target.value)} placeholder="Enter reason" />
        </div>
      </CardContent>
    </Card>
  )
}
