'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CalendarPlus, Eye, LogIn, RotateCcw, XCircle, UserPlus } from 'lucide-react'
import { toast } from 'sonner'

import { PageHeader } from '@/components/page-header'
import { DataTable, type Column } from '@/components/data-table'
import { StatusBadge } from '@/components/status-badge'
import { FilterSelect, ALL } from '@/components/filter-select'
import { BookAppointmentDialog } from '@/components/book-appointment-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Protect } from '@/components/protect'
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
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { SERVICES } from '@/lib/constants'
import { useHealthcare, DOCTORS, type Appointment } from '@/lib/store'

const columns: Column<Appointment>[] = [
  {
    key: 'id',
    header: 'Appointment No',
    sortable: true,
    render: (r) => <span className="font-medium tabular-nums">{r.id}</span>,
  },
  {
    key: 'patient',
    header: 'Patient / Inquiry Name',
    sortable: true,
    render: (r) => (
      <div className="flex flex-col">
        <span className="font-medium text-foreground">{r.firstName} {r.lastName}</span>
        {r.inquiryId && (
          <span className="text-xs text-muted-foreground">from {r.inquiryId}</span>
        )}
      </div>
    ),
  },
  { key: 'phone', header: 'Phone' },
  { key: 'service', header: 'Service', sortable: true },
  { key: 'doctor', header: 'Doctor', sortable: true },
  { key: 'date', header: 'Date', sortable: true },
  { key: 'time', header: 'Time' },
  {
    key: 'status',
    header: 'Status',
    render: (r) => <StatusBadge status={r.status} />,
  },
]

export default function AppointmentPage() {
  const router = useRouter()
  const { appointments, updateAppointment, updateAppointmentStatus } = useHealthcare()
  const [open, setOpen] = useState(false)

  // Quick Actions deep-link: /appointment?new=1 opens Book Appointment.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('new')) setOpen(true)
  }, [])

  const [fDoctor, setFDoctor] = useState(ALL)
  const [fService, setFService] = useState(ALL)
  const [fStatus, setFStatus] = useState(ALL)
  const [fDate, setFDate] = useState('')
  const [viewTarget, setViewTarget] = useState<Appointment | null>(null)
  const [editTarget, setEditTarget] = useState<Appointment | null>(null)
  const [editFirstName, setEditFirstName] = useState('')
  const [editLastName, setEditLastName] = useState('')
  const [editPhone, setEditPhone] = useState('')
  const [editDoctor, setEditDoctor] = useState('')
  const [editService, setEditService] = useState('')
  const [editDate, setEditDate] = useState('')
  const [editTime, setEditTime] = useState('')
  const [editNotes, setEditNotes] = useState('')
  const [editStatus, setEditStatus] = useState<Appointment['status']>('Scheduled')

  const filtered = useMemo(
    () =>
      appointments.filter(
        (a) =>
          (fDoctor === ALL || a.doctor === fDoctor) &&
          (fService === ALL || a.service === fService) &&
          (fStatus === ALL || a.status === fStatus) &&
          (!fDate ||
            a.date ===
              new Date(fDate).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })),
      ),
    [appointments, fDoctor, fService, fStatus, fDate],
  )

  function openEdit(a: Appointment) {
    setEditTarget(a)
    setEditFirstName(a.firstName)
    setEditLastName(a.lastName)
    setEditPhone(a.phone)
    setEditDoctor(a.doctor)
    setEditService(a.service)
    setEditDate(a.date)
    setEditTime(a.time)
    setEditNotes(a.notes ?? '')
    setEditStatus(a.status)
  }

  function saveEdit() {
    if (!editTarget) return
    updateAppointment(editTarget.id, {
      firstName: editFirstName,
      lastName: editLastName,
      phone: editPhone,
      doctor: editDoctor,
      service: editService,
      date: editDate,
      time: editTime,
      notes: editNotes,
      status: editStatus,
    })
    toast.success(`Appointment ${editTarget.id} updated`)
    setEditTarget(null)
  }

  function registerPatient(a: Appointment) {
    const params = new URLSearchParams({
      appt: a.id,
      firstName: a.firstName,
      lastName: a.lastName,
      phone: a.phone,
      service: a.service,
    })
    if (a.email) params.set('email', a.email)
    if (a.inquiryId) params.set('inquiry', a.inquiryId)
    router.push(`/registration?${params.toString()}`)
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Appointment"
        description="Schedule and manage doctor and diagnostic appointments."
        breadcrumb={['Home', 'Appointment']}
        action={
          <Protect module="APPOINTMENT" action="CREATE">
            <Button onClick={() => setOpen(true)}>
              <CalendarPlus data-icon="inline-start" />
              Book Appointment
            </Button>
          </Protect>
        }
      />

      <DataTable
        columns={columns}
        data={filtered}
        searchKeys={['id', 'firstName', 'lastName', 'doctor', 'service']}
        searchPlaceholder="Search appointments..."
        getRowKey={(r) => r.id}
        toolbar={
          <>
            <Input type="date" aria-label="Filter by date" value={fDate} onChange={(e) => setFDate(e.target.value)} className="h-7 w-[9.5rem]" />
            <FilterSelect label="Doctor" value={fDoctor} onValueChange={setFDoctor} options={DOCTORS} className="w-[11rem]" />
            <FilterSelect label="Service" value={fService} onValueChange={setFService} options={SERVICES} />
            <FilterSelect label="Status" value={fStatus} onValueChange={setFStatus} options={['Scheduled', 'Confirmed', 'Checked In', 'Registered', 'Completed', 'Cancelled', 'No Show']} className="w-[11rem]" />
          </>
        }
        renderActions={(r) => (
          <>
            <DropdownMenuItem onClick={() => setViewTarget(r)}>
              <Eye />
              View
            </DropdownMenuItem>
            <Protect module="APPOINTMENT" action="CREATE">
              <DropdownMenuItem onClick={() => openEdit(r)}>
                <CalendarPlus />
                Edit
              </DropdownMenuItem>
            </Protect>
            <Protect module="APPOINTMENT" action="UPDATE">
              <DropdownMenuItem
                disabled={r.status === 'Cancelled'}
                onClick={() => {
                  updateAppointmentStatus(r.id, 'Checked In')
                  toast.success(`${r.patient} checked in`)
                }}
              >
                <LogIn />
                Check In
              </DropdownMenuItem>
            </Protect>
            <Protect module="APPOINTMENT" action="CREATE">
              <DropdownMenuItem onClick={() => {
                updateAppointment(r.id, { status: 'Confirmed' })
                toast.success(`${r.id} rescheduled`)
              }}>
                <RotateCcw />
                Reschedule
              </DropdownMenuItem>
            </Protect>
            <Protect module="APPOINTMENT" action="CREATE">
              <DropdownMenuItem
                disabled={!!r.uhid}
                onClick={() => registerPatient(r)}
              >
                <UserPlus />
                {r.uhid ? 'Registered' : 'Register Patient'}
              </DropdownMenuItem>
            </Protect>
            <Protect module="APPOINTMENT" action="DELETE">
              <DropdownMenuItem
                variant="destructive"
                disabled={r.status === 'Cancelled'}
                onClick={() => {
                  updateAppointmentStatus(r.id, 'Cancelled')
                  toast.error(`${r.id} cancelled`)
                }}
              >
                <XCircle />
                Cancel
              </DropdownMenuItem>
            </Protect>
          </>
        )}
      />

      <Dialog open={Boolean(viewTarget)} onOpenChange={(open) => !open && setViewTarget(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{viewTarget?.id}</DialogTitle>
            <DialogDescription>Appointment details and notes.</DialogDescription>
          </DialogHeader>
          {viewTarget && (
            <div className="flex flex-col gap-3 text-sm">
              <div className="rounded-lg border border-border p-3">
                <div className="font-medium text-foreground">{viewTarget.firstName} {viewTarget.lastName}</div>
                <div className="text-muted-foreground">{viewTarget.phone} · {viewTarget.service}</div>
              </div>
              <div className="rounded-lg border border-border p-3">
                <div className="text-muted-foreground">Doctor: {viewTarget.doctor}</div>
                <div className="text-muted-foreground">Slot: {viewTarget.date} · {viewTarget.time}</div>
                <div className="text-muted-foreground">Notes: {viewTarget.notes ?? '—'}</div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(editTarget)} onOpenChange={(open) => !open && setEditTarget(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Appointment</DialogTitle>
            <DialogDescription>Update booking details and status.</DialogDescription>
          </DialogHeader>
          {editTarget && (
            <FieldGroup className="gap-4">
              <div className="grid grid-cols-2 gap-4">
                <Field><FieldLabel>First Name</FieldLabel><Input value={editFirstName} onChange={(e) => setEditFirstName(e.target.value)} /></Field>
                <Field><FieldLabel>Last Name</FieldLabel><Input value={editLastName} onChange={(e) => setEditLastName(e.target.value)} /></Field>
              </div>
              <Field><FieldLabel>Phone</FieldLabel><Input value={editPhone} onChange={(e) => setEditPhone(e.target.value)} /></Field>
              <Field><FieldLabel>Doctor</FieldLabel><Select value={editDoctor} onValueChange={(value) => setEditDoctor(value ?? '')}><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent>{DOCTORS.map((d)=><SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent></Select></Field>
              <Field><FieldLabel>Service</FieldLabel><Select value={editService} onValueChange={(value) => setEditService(value ?? '')}><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent>{SERVICES.map((s)=><SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></Field>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field><FieldLabel>Date</FieldLabel><Input type="date" value={editDate} onChange={(e) => setEditDate(e.target.value)} /></Field>
                <Field><FieldLabel>Time</FieldLabel><Input type="time" value={editTime} onChange={(e) => setEditTime(e.target.value)} /></Field>
              </div>
              <Field><FieldLabel>Status</FieldLabel><Select value={editStatus} onValueChange={(value) => setEditStatus((value as Appointment['status']) ?? 'Scheduled')}><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent>{['Scheduled','Confirmed','Checked In','Registered','Completed','Cancelled','No Show'].map((s)=><SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></Field>
              <Field><FieldLabel>Notes</FieldLabel><Textarea value={editNotes} onChange={(e) => setEditNotes(e.target.value)} rows={3} /></Field>
            </FieldGroup>
          )}
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
            <Button onClick={saveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <BookAppointmentDialog open={open} onOpenChange={setOpen} />
    </div>
  )
}
