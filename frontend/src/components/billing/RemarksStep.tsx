import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export function RemarksStep({
  remarks,
  billingNotes,
  specialInstructions,
  onChange,
}: {
  remarks: string
  billingNotes: string
  specialInstructions: string
  onChange: (field: 'remarks' | 'billingNotes' | 'specialInstructions', value: string) => void
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Remarks</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Internal Remarks</Label>
          <Textarea value={remarks} onChange={(e) => onChange('remarks', e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Billing Notes</Label>
          <Textarea value={billingNotes} onChange={(e) => onChange('billingNotes', e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Special Instructions</Label>
          <Textarea value={specialInstructions} onChange={(e) => onChange('specialInstructions', e.target.value)} />
        </div>
      </CardContent>
    </Card>
  )
}
