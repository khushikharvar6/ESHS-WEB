'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Field, FieldLabel, FieldGroup } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import {
  SALUTATIONS,
  GENDERS,
  BLOOD_GROUPS,
} from '@/lib/constants'
import { useHealthcare, type Patient } from '@/lib/store'

/** Pre-filled edit form for a patient's registration details (Save / Cancel). */
export function EditPatientDialog({
  patient,
  open,
  onOpenChange,
}: {
  patient: Patient
  open: boolean
  onOpenChange: (v: boolean) => void
}) {
  const { updatePatient } = useHealthcare()
  const [form, setForm] = useState<Patient>(patient)

  // Re-sync when a different patient is opened.
  useEffect(() => {
    if (open) setForm(patient)
  }, [open, patient])

  function set<K extends keyof Patient>(key: K, value: Patient[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function save() {
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error('Name and phone are required')
      return
    }
    updatePatient(patient.uhid, {
      salutation: form.salutation,
      name: form.name,
      age: Number(form.age) || 0,
      gender: form.gender,
      bloodGroup: form.bloodGroup,
      phone: form.phone,
      email: form.email,
      address: form.address,
      city: form.city,
      state: form.state,
      pincode: form.pincode,
      emergencyContact: form.emergencyContact,
      vip: form.vip,
    })
    toast.success('Patient details updated')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Patient — {patient.uhid}</DialogTitle>
          <DialogDescription>
            Update registration details. UHID cannot be changed.
          </DialogDescription>
        </DialogHeader>
        <FieldGroup className="max-h-[62vh] overflow-y-auto px-0.5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <Field>
              <FieldLabel>Salutation</FieldLabel>
              <Select
                value={form.salutation ?? ''}
                onValueChange={(v) => set('salutation', v ?? '')}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="—" />
                </SelectTrigger>
                <SelectContent>
                  {SALUTATIONS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field className="sm:col-span-2">
              <FieldLabel htmlFor="ep-name">Full Name</FieldLabel>
              <Input
                id="ep-name"
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <Field>
              <FieldLabel htmlFor="ep-age">Age</FieldLabel>
              <Input
                id="ep-age"
                type="number"
                value={String(form.age)}
                onChange={(e) => set('age', Number(e.target.value) as Patient['age'])}
              />
            </Field>
            <Field>
              <FieldLabel>Gender</FieldLabel>
              <Select value={form.gender ?? ''} onValueChange={(v) => set('gender', v ?? '')}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  {GENDERS.map((g) => (
                    <SelectItem key={g} value={g}>
                      {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel>Blood Group</FieldLabel>
              <Select
                value={form.bloodGroup ?? ''}
                onValueChange={(v) => set('bloodGroup', v ?? '')}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  {BLOOD_GROUPS.map((b) => (
                    <SelectItem key={b} value={b}>
                      {b}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="ep-phone">Phone</FieldLabel>
              <Input
                id="ep-phone"
                value={form.phone}
                onChange={(e) => set('phone', e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="ep-email">Email</FieldLabel>
              <Input
                id="ep-email"
                type="email"
                value={form.email ?? ''}
                onChange={(e) => set('email', e.target.value)}
              />
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor="ep-address">Address</FieldLabel>
            <Textarea
              id="ep-address"
              rows={2}
              value={form.address ?? ''}
              onChange={(e) => set('address', e.target.value)}
            />
          </Field>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <Field>
              <FieldLabel htmlFor="ep-city">City</FieldLabel>
              <Input
                id="ep-city"
                value={form.city ?? ''}
                onChange={(e) => set('city', e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="ep-state">State</FieldLabel>
              <Input
                id="ep-state"
                value={form.state ?? ''}
                onChange={(e) => set('state', e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="ep-pin">Pincode</FieldLabel>
              <Input
                id="ep-pin"
                value={form.pincode ?? ''}
                onChange={(e) => set('pincode', e.target.value)}
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="ep-emergency">Emergency Contact</FieldLabel>
              <Input
                id="ep-emergency"
                value={form.emergencyContact ?? ''}
                onChange={(e) => set('emergencyContact', e.target.value)}
              />
            </Field>
            <div className="flex items-center gap-2 pt-8">
              <input
                id="ep-vip"
                type="checkbox"
                checked={form.vip ?? false}
                onChange={(e) => set('vip', e.target.checked)}
                className="size-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 accent-blue-600 cursor-pointer animate-none"
              />
              <label htmlFor="ep-vip" className="text-sm font-medium text-slate-700 cursor-pointer select-none">
                VIP Patient
              </label>
            </div>
          </div>
        </FieldGroup>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
          <Button onClick={save}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
