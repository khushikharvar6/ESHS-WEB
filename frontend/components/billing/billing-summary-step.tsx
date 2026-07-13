import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
type BillingPatient = {
  id: string
  uhid: string
  name: string
  age: number
  gender: string
  phone: string
  email?: string
  servicesTaken: string[]
}

type BillingItem = {
  id: string
  serviceId: string
  serviceName: string
  department: string
  quantity: number
  unitPrice: number
  taxRate?: number
  amount: number
}

export function BillingSummaryStep({
  patient,
  items,
  onAddService,
  onRemoveItem,
  onSelectPatient,
  patients,
}: {
  patient: BillingPatient | null
  items: BillingItem[]
  onAddService: () => void
  onRemoveItem: (id: string) => void
  onSelectPatient: (patient: BillingPatient) => void
  patients: BillingPatient[]
}) {
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Patient Selection</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Field>
            <FieldLabel>Select Patient</FieldLabel>
            <Select onValueChange={(value) => {
              const selected = patients.find((p) => p.id === value)
              if (selected) onSelectPatient(selected)
            }}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Choose patient" /></SelectTrigger>
              <SelectContent>
                {patients.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.name} · {p.uhid}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          {patient ? (
            <div className="rounded-lg border border-border bg-muted/30 p-3 text-sm">
              <div className="font-semibold text-foreground">{patient.name}</div>
              <div className="text-muted-foreground">UHID: {patient.uhid} · {patient.age} yrs · {patient.gender}</div>
              <div className="text-muted-foreground">Phone: {patient.phone}</div>
              <div className="text-muted-foreground">Services: {patient.servicesTaken.join(', ')}</div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Service Items</CardTitle>
          <Button variant="outline" size="sm" onClick={onAddService}>
            <Plus className="mr-1 size-4" /> Add Service
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-lg border border-border">
            <table className="min-w-full text-sm">
              <thead className="bg-muted/40">
                <tr>
                  <th className="px-3 py-2 text-left">Service</th>
                  <th className="px-3 py-2 text-left">Qty</th>
                  <th className="px-3 py-2 text-left">Unit Price</th>
                  <th className="px-3 py-2 text-left">Amount</th>
                  <th className="px-3 py-2 text-left" />
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-3 py-6 text-center text-muted-foreground">No services added yet.</td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <tr key={item.id} className="border-t border-border">
                      <td className="px-3 py-2">{item.serviceName}</td>
                      <td className="px-3 py-2">{item.quantity}</td>
                      <td className="px-3 py-2">₹{item.unitPrice}</td>
                      <td className="px-3 py-2">₹{item.amount}</td>
                      <td className="px-3 py-2">
                        <Button variant="ghost" size="icon-sm" onClick={() => onRemoveItem(item.id)}>
                          <Trash2 className="size-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
