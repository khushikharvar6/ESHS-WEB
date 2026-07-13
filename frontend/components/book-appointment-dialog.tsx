'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
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
import { SERVICES, APPOINTMENT_TYPES } from '@/lib/constants'
import { useHealthcare, DOCTORS } from '@/lib/store'

export type AppointmentPrefill = {
  firstName?: string
  lastName?: string
  phone?: string
  email?: string
  service?: string
  notes?: string
}

export function BookAppointmentDialog({
  open,
  onOpenChange,
  prefill,
  inquiryId,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  prefill?: AppointmentPrefill
  inquiryId?: string
}) {
  const { convertInquiryToAppointment, addAppointment } = useHealthcare()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [service, setService] = useState('')
  const [doctor, setDoctor] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [type, setType] = useState<string>('New Visit')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (open) {
      setFirstName(prefill?.firstName ?? '')
      setLastName(prefill?.lastName ?? '')
      setPhone(prefill?.phone ?? '')
      setEmail(prefill?.email ?? '')
      setService(prefill?.service ?? '')
      setNotes(prefill?.notes ?? '')
      setDoctor('')
      setDate('')
      setTime('')
      setType('New Visit')
    }
  }, [open, prefill])

  function displayDate(d: string) {
    if (!d) return new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  function save() {
    if (!firstName || !lastName || !service || !doctor) {
      toast.error('Please fill first name, last name, service and doctor')
      return
    }
    const base = {
      firstName,
      lastName,
      phone,
      email,
      service,
      doctor,
      date: displayDate(date),
      time: time || '10:00 AM',
      type,
      notes,
    }
    if (inquiryId) {
      const appt = convertInquiryToAppointment(inquiryId, base)
      toast.success(`Inquiry converted → ${appt.id}`)
    } else {
      const appt = addAppointment(base)
      toast.success(`Appointment booked → ${appt.id}`)
    }

    // Open WhatsApp Web Link
    if (phone) {
      import('@/lib/sms').then(({ generateWhatsAppLink, NotificationTemplates }) => {
        const msg = NotificationTemplates.appointmentCreated(firstName, displayDate(date), time || '10:00 AM', doctor)
        const waUrl = generateWhatsAppLink(phone, msg)
        window.open(waUrl, 'whatsapp_web')
      })
    }

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Book Appointment</DialogTitle>
          <DialogDescription>
            {inquiryId
              ? 'Converting inquiry — details are pre-filled.'
              : 'Schedule a new appointment for a patient.'}
          </DialogDescription>
        </DialogHeader>
        <FieldGroup className="max-h-[60vh] overflow-y-auto px-0.5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="apt-first-name">First Name</FieldLabel>
              <Input id="apt-first-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name" />
            </Field>
            <Field>
              <FieldLabel htmlFor="apt-last-name">Last Name</FieldLabel>
              <Input id="apt-last-name" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last name" />
            </Field>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="apt-phone">Phone</FieldLabel>
              <Input id="apt-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 ..." />
            </Field>
            <Field>
              <FieldLabel htmlFor="apt-email">Email</FieldLabel>
              <Input id="apt-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@email.com" />
            </Field>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field>
              <FieldLabel>Service</FieldLabel>
              <Select value={service} onValueChange={(value) => setService(value ?? '')}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Select..." /></SelectTrigger>
                <SelectContent>
                  {SERVICES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel>Doctor</FieldLabel>
              <Select value={doctor} onValueChange={(value) => setDoctor(value ?? '')}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Select..." /></SelectTrigger>
                <SelectContent>
                  {DOCTORS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="apt-date">Date</FieldLabel>
              <Input id="apt-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </Field>
            <Field>
              <FieldLabel htmlFor="apt-time">Time</FieldLabel>
              <Input id="apt-time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            </Field>
          </div>
          <Field>
            <FieldLabel>Appointment Type</FieldLabel>
            <Select value={type} onValueChange={(value) => setType(value ?? 'New Visit')}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Select..." /></SelectTrigger>
              <SelectContent>
                {APPOINTMENT_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="apt-notes">Notes</FieldLabel>
            <Textarea id="apt-notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Reason for visit, special instructions..." />
          </Field>
        </FieldGroup>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
          <Button onClick={save}>Confirm Booking</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
