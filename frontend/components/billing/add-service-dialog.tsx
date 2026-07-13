import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SERVICE_MASTER } from '@/src/config/serviceMaster'
type BillingItem = {
  id: string
  serviceId: string
  serviceName: string
  department: string
  quantity: number
  unitPrice: number
  taxRate: number
  amount: number
}

export function AddServiceDialog({
  open,
  onOpenChange,
  onAdd,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (item: BillingItem) => void
}) {
  const [serviceId, setServiceId] = useState(SERVICE_MASTER[0].id)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    if (!open) return
    setServiceId(SERVICE_MASTER[0].id)
    setQuantity(1)
  }, [open])

  const selected = useMemo(
    () => SERVICE_MASTER.find((service) => service.id === serviceId) ?? SERVICE_MASTER[0],
    [serviceId],
  )

  const amount = selected.price * quantity

  function handleAdd() {
    onAdd({
      id: `${selected.id}-${Date.now()}`,
      serviceId: selected.id,
      serviceName: selected.name,
      department: selected.department,
      quantity,
      unitPrice: selected.price,
      taxRate: selected.taxRate,
      amount,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Service</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Field>
            <FieldLabel>Service</FieldLabel>
            <Select
              value={serviceId}
              onValueChange={(value) => setServiceId(value ?? SERVICE_MASTER[0].id)}
            >
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {SERVICE_MASTER.map((service) => (
                  <SelectItem key={service.id} value={service.id}>{service.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel>Quantity</FieldLabel>
            <Input type="number" min="1" value={quantity} onChange={(e) => setQuantity(Number(e.target.value) || 1)} />
          </Field>
          <Field>
            <FieldLabel>Unit Price</FieldLabel>
            <Input value={`₹${selected.price}`} readOnly />
          </Field>
          <Field>
            <FieldLabel>Amount</FieldLabel>
            <Input value={`₹${amount}`} readOnly />
          </Field>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleAdd}>Add Service</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
