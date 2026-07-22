'use client'

import { useEffect, useMemo, useState } from 'react'
import { Plus, Eye, Pencil, CalendarPlus, XCircle, PhoneCall, TrendingUp, ThumbsUp, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

import { PageHeader } from '@/components/page-header'
import { DataTable, type Column } from '@/components/data-table'
import { StatusBadge } from '@/components/status-badge'
import { FilterSelect, ALL } from '@/components/filter-select'
import { KpiCard } from '@/components/kpi-card'
import { BookAppointmentDialog } from '@/components/book-appointment-dialog'
import { Button } from '@/components/ui/button'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Protect } from '@/components/protect'
import {
  Dialog,
  DialogTrigger,
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
import { SERVICES, PRIORITIES, INQUIRY_SOURCES } from '@/lib/constants'
import { useHealthcare, type Inquiry } from '@/lib/store'

const columns: Column<Inquiry>[] = [
  {
    key: 'id',
    header: 'Inquiry No',
    sortable: true,
    render: (r) => <span className="font-medium tabular-nums">{r.id}</span>,
  },
  { key: 'name', header: 'Name', sortable: true, render: (r) => `${r.firstName} ${r.lastName}` },
  { key: 'phone', header: 'Phone' },
  { key: 'service', header: 'Service', sortable: true },
  { key: 'source', header: 'Source', sortable: true },
  {
    key: 'priority',
    header: 'Priority',
    render: (r) => <StatusBadge status={r.priority} />,
  },
  { key: 'followUp', header: 'Follow-up Date', sortable: true },
  {
    key: 'status',
    header: 'Status',
    render: (r) => <StatusBadge status={r.status} />,
  },
]

export default function InquiryPage() {
  const { inquiries, addInquiry, updateInquiry, markInquiryLost } = useHealthcare()
  const [open, setOpen] = useState(false)

  // Quick Actions deep-link: /inquiry?new=1 opens the New Inquiry dialog.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('new')) setOpen(true)
  }, [])

  // new inquiry form state
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [service, setService] = useState('')
  const [source, setSource] = useState('')
  const [priority, setPriority] = useState('Routine')
  const [followUp, setFollowUp] = useState('')
  const [notes, setNotes] = useState('')

  // filters
  const [fStatus, setFStatus] = useState(ALL)
  const [fService, setFService] = useState(ALL)
  const [fPriority, setFPriority] = useState(ALL)
  const [fSource, setFSource] = useState(ALL)
  const [fFollowUp, setFFollowUp] = useState('')

  // convert-to-appointment
  const [convertOpen, setConvertOpen] = useState(false)
  const [convertTarget, setConvertTarget] = useState<Inquiry | null>(null)
  const [viewTarget, setViewTarget] = useState<Inquiry | null>(null)
  const [editTarget, setEditTarget] = useState<Inquiry | null>(null)
  const [editFirstName, setEditFirstName] = useState('')
  const [editLastName, setEditLastName] = useState('')
  const [editPhone, setEditPhone] = useState('')
  const [editService, setEditService] = useState('')
  const [editPriority, setEditPriority] = useState<Inquiry['priority']>('Routine')
  const [editStatus, setEditStatus] = useState<Inquiry['status']>('New')
  const [editNotes, setEditNotes] = useState('')
  const [editFollowUp, setEditFollowUp] = useState('')
  const [lostReason, setLostReason] = useState('')
  const [lostOpen, setLostOpen] = useState(false)
  const [lostTarget, setLostTarget] = useState<Inquiry | null>(null)

  const filtered = useMemo(
    () =>
      inquiries.filter(
        (i) =>
          (fStatus === ALL || i.status === fStatus) &&
          (fService === ALL || i.service === fService) &&
          (fPriority === ALL || i.priority === fPriority) &&
          (fSource === ALL || i.source === fSource) &&
          (!fFollowUp ||
            i.followUp ===
              new Date(fFollowUp).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })),
      ),
    [inquiries, fStatus, fService, fPriority, fSource, fFollowUp],
  )

  const totalInquiries = inquiries.length
  const newInquiries = inquiries.filter(i => i.status === 'New').length
  const convertedInquiries = inquiries.filter(i => i.status === 'Converted').length
  const conversionRate = totalInquiries > 0 ? Math.round((convertedInquiries / totalInquiries) * 100) : 0

  function resetForm() {
    setFirstName('')
    setLastName('')
    setPhone('')
    setEmail('')
    setService('')
    setSource('')
    setPriority('Routine')
    setFollowUp('')
    setNotes('')
  }

  function save() {
    if (!firstName || !lastName || !phone || !service) {
      toast.error('First name, last name, phone and service are required')
      return
    }
    const created = addInquiry({
      firstName,
      lastName,
      phone,
      email,
      service,
      source: source || 'Walk-in',
      priority: priority as Inquiry['priority'],
      followUp: followUp
        ? new Date(followUp).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })
        : new Date().toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }),
      notes,
    })
    toast.success(`Inquiry ${created.id} created`)
    resetForm()
    setOpen(false)
  }

  function startConvert(inq: Inquiry) {
    setConvertTarget(inq)
    setConvertOpen(true)
  }

  function openEdit(inq: Inquiry) {
    setEditTarget(inq)
    setEditFirstName(inq.firstName)
    setEditLastName(inq.lastName)
    setEditPhone(inq.phone)
    setEditService(inq.service)
    setEditPriority(inq.priority)
    setEditStatus(inq.status)
    setEditNotes(inq.notes ?? '')
    setEditFollowUp('')
  }

  function saveEdit() {
    if (!editTarget || !editFirstName || !editLastName || !editPhone || !editService) return
    updateInquiry(editTarget.id, {
      firstName: editFirstName,
      lastName: editLastName,
      phone: editPhone,
      service: editService,
      priority: editPriority,
      status: editStatus,
      notes: editNotes,
      followUp: editFollowUp ? new Date(editFollowUp).toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric'
      }) : editTarget.followUp,
    })
    toast.success(`Inquiry ${editTarget.id} updated`)
    setEditTarget(null)
  }

  function confirmLost() {
    if (!lostTarget) return
    updateInquiry(lostTarget.id, { status: 'Lost', notes: `${lostTarget.notes ?? ''}\nLost reason: ${lostReason}`.trim() })
    setLostTarget(null)
    setLostReason('')
    setLostOpen(false)
    toast.error(`Inquiry ${lostTarget.id} marked lost`)
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Inquiry"
        description="Capture, track and convert patient inquiries from every channel."
        breadcrumb={['Home', 'Inquiry']}
        action={
          <Protect module="INQUIRY" action="CREATE">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger render={<Button />}>
                <Plus data-icon="inline-start" />
                New Inquiry
              </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>New Inquiry</DialogTitle>
                <DialogDescription>
                  Log a new patient inquiry and set a follow-up.
                </DialogDescription>
              </DialogHeader>
              <FieldGroup className="max-h-[60vh] overflow-y-auto px-0.5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="inq-first-name">First Name</FieldLabel>
                    <Input id="inq-first-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name" />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="inq-last-name">Last Name</FieldLabel>
                    <Input id="inq-last-name" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last name" />
                  </Field>
                </div>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="inq-phone">Phone</FieldLabel>
                    <Input id="inq-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 ..." />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="inq-email">Email</FieldLabel>
                    <Input id="inq-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@email.com" />
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
                    <FieldLabel>Source</FieldLabel>
                    <Select value={source} onValueChange={(value) => setSource(value ?? '')}>
                      <SelectTrigger className="w-full"><SelectValue placeholder="Select..." /></SelectTrigger>
                      <SelectContent>
                        {INQUIRY_SOURCES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </Field>
                </div>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field>
                    <FieldLabel>Priority</FieldLabel>
                    <Select value={priority} onValueChange={(value) => setPriority(value ?? '')}>
                      <SelectTrigger className="w-full"><SelectValue placeholder="Select..." /></SelectTrigger>
                      <SelectContent>
                        {PRIORITIES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="inq-followup">Follow-up Date</FieldLabel>
                    <Input id="inq-followup" type="date" value={followUp} onChange={(e) => setFollowUp(e.target.value)} />
                  </Field>
                </div>
                <Field>
                  <FieldLabel htmlFor="inq-notes">Notes</FieldLabel>
                  <Textarea id="inq-notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Additional details..." />
                </Field>
              </FieldGroup>
              <DialogFooter>
                <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
                <Button onClick={save}>Save Inquiry</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          </Protect>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Total Inquiries"
          value={totalInquiries}
          icon={PhoneCall}
          accent="primary"
        />
        <KpiCard
          label="New / Pending"
          value={newInquiries}
          icon={AlertCircle}
          accent="warning"
        />
        <KpiCard
          label="Converted"
          value={convertedInquiries}
          icon={ThumbsUp}
          accent="green"
        />
        <KpiCard
          label="Conversion Rate"
          value={`${conversionRate}%`}
          icon={TrendingUp}
          accent="teal"
        />
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        searchKeys={['id', 'firstName', 'lastName', 'phone', 'service']}
        searchPlaceholder="Search inquiries..."
        getRowKey={(r) => r.id}
        toolbar={
          <>
            <FilterSelect label="Status" value={fStatus} onValueChange={setFStatus} options={['New', 'In Progress', 'Converted', 'Lost']} />
            <FilterSelect label="Service" value={fService} onValueChange={setFService} options={SERVICES} />
            <FilterSelect label="Priority" value={fPriority} onValueChange={setFPriority} options={PRIORITIES} />
            <FilterSelect label="Source" value={fSource} onValueChange={setFSource} options={INQUIRY_SOURCES} />
            <Input type="date" aria-label="Filter by follow-up date" value={fFollowUp} onChange={(e) => setFFollowUp(e.target.value)} className="h-7 w-[9.5rem]" />
          </>
        }
        renderActions={(r) => (
          <>
            <DropdownMenuItem onClick={(e) => {
              e.preventDefault()
              setViewTarget(r)
            }}>
              <Eye />
              View
            </DropdownMenuItem>
            <Protect module="INQUIRY" action="UPDATE">
              <DropdownMenuItem onClick={(e) => {
                e.preventDefault()
                openEdit(r)
              }}>
                <Pencil />
                Edit
              </DropdownMenuItem>
            </Protect>
            <Protect module="INQUIRY" action="UPDATE">
              <DropdownMenuItem
                disabled={r.status === 'Converted' || r.status === 'Lost'}
                onClick={() => startConvert(r)}
              >
                <CalendarPlus />
                Convert to Appointment
              </DropdownMenuItem>
            </Protect>
            <Protect module="INQUIRY" action="DELETE">
              <DropdownMenuItem
                variant="destructive"
                disabled={r.status === 'Lost'}
                onClick={(e) => {
                  e.preventDefault()
                  setLostTarget(r)
                  setLostOpen(true)
                }}
              >
                <XCircle />
                Mark Lost
              </DropdownMenuItem>
            </Protect>
          </>
        )}
      />

      <Dialog open={Boolean(viewTarget)} onOpenChange={(open) => !open && setViewTarget(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{viewTarget?.id}</DialogTitle>
            <DialogDescription>Inquiry details and follow-up history.</DialogDescription>
          </DialogHeader>
          {viewTarget && (
            <div className="flex flex-col gap-3 text-sm">
              <div className="rounded-lg border border-border p-3">
                <div className="font-medium text-foreground">{viewTarget.firstName} {viewTarget.lastName}</div>
                <div className="text-muted-foreground">{viewTarget.phone} · {viewTarget.service}</div>
              </div>
              <div className="rounded-lg border border-border p-3">
                <div className="font-medium text-foreground">Follow-up history</div>
                <div className="mt-1 text-muted-foreground">Status: {viewTarget.status} · Follow-up: {viewTarget.followUp}</div>
                <div className="mt-1 text-muted-foreground">{viewTarget.notes ?? 'No notes captured yet.'}</div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(editTarget)} onOpenChange={(open) => !open && setEditTarget(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Inquiry</DialogTitle>
            <DialogDescription>Update inquiry details and follow-up status.</DialogDescription>
          </DialogHeader>
          {editTarget && (
            <FieldGroup className="gap-4">
              <div className="grid grid-cols-2 gap-4">
                <Field><FieldLabel>First Name</FieldLabel><Input value={editFirstName} onChange={(e) => setEditFirstName(e.target.value)} /></Field>
                <Field><FieldLabel>Last Name</FieldLabel><Input value={editLastName} onChange={(e) => setEditLastName(e.target.value)} /></Field>
              </div>
              <Field><FieldLabel>Phone</FieldLabel><Input value={editPhone} onChange={(e) => setEditPhone(e.target.value)} /></Field>
              <Field><FieldLabel>Service</FieldLabel><Input value={editService} onChange={(e) => setEditService(e.target.value)} /></Field>
              <Field><FieldLabel>Priority</FieldLabel><Select value={editPriority} onValueChange={(value) => setEditPriority((value as Inquiry['priority']) ?? 'Medium')}><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent>{['Low','Medium','High'].map((p)=><SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent></Select></Field>
              <Field><FieldLabel>Status</FieldLabel><Select value={editStatus} onValueChange={(value) => setEditStatus((value as Inquiry['status']) ?? 'New')}><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent>{['New','In Progress','Converted','Lost'].map((s)=><SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></Field>
              <Field><FieldLabel>Follow-up Date</FieldLabel><Input type="date" value={editFollowUp} onChange={(e) => setEditFollowUp(e.target.value)} /></Field>
              <Field><FieldLabel>Notes</FieldLabel><Textarea value={editNotes} onChange={(e) => setEditNotes(e.target.value)} rows={3} /></Field>
            </FieldGroup>
          )}
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
            <Button onClick={saveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={lostOpen} onOpenChange={(open) => !open && setLostOpen(false)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Mark inquiry as lost</DialogTitle><DialogDescription>Capture a short reason before closing this inquiry.</DialogDescription></DialogHeader>
          <Field><FieldLabel>Lost reason</FieldLabel><Textarea value={lostReason} onChange={(e) => setLostReason(e.target.value)} rows={3} /></Field>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
            <Button onClick={confirmLost}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <BookAppointmentDialog
        open={convertOpen}
        onOpenChange={setConvertOpen}
        inquiryId={convertTarget?.id}
        prefill={
          convertTarget
            ? {
                firstName: convertTarget.firstName,
                lastName: convertTarget.lastName,
                phone: convertTarget.phone,
                email: convertTarget.email,
                service: convertTarget.service,
                notes: convertTarget.notes,
              }
            : undefined
        }
      />
    </div>
  )
}
