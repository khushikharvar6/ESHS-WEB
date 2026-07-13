import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { DiscountType } from '@/src/types/billing.types'

export function DiscountStep({
  discountType,
  discountValue,
  setDiscountType,
  setDiscountValue,
}: {
  discountType: DiscountType
  discountValue: number
  setDiscountType: (value: DiscountType) => void
  setDiscountValue: (value: number) => void
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Discount</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <Field>
          <FieldLabel>Discount Type</FieldLabel>
          <Select value={discountType} onValueChange={(value) => setDiscountType(value as DiscountType)}>
            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="percentage">Percentage</SelectItem>
              <SelectItem value="flat">Flat Amount</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field>
          <FieldLabel>Discount Value</FieldLabel>
          <Input type="number" value={discountValue} onChange={(e) => setDiscountValue(Number(e.target.value) || 0)} />
        </Field>
      </CardContent>
    </Card>
  )
}
