'use client'

import { useRef, useState } from 'react'
import {
  Stethoscope,
  Plus,
  FileUp,
  Pill,
  CalendarClock,
  Paperclip,
  Pencil,
  Trash2,
} from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Protect } from '@/components/protect'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'
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
import { AuditLine } from '@/components/patient/audit-line'
import { todayShort } from '@/lib/format'
import { useHealthcare, DOCTORS, type Consultation } from '@/lib/store'

const EMPTY = {
  doctor: '',
  svc: '',
  date: '',
  complaint: '',
  diagnosis: '',
  treatment: '',
  prescription: '',
  followUp: '',
  files: [] as string[],
}

export function ConsultationsTab({
  uhid,
  service,
}: {
  uhid: string
  service: string
}) {
  const {
    consultationsFor,
    addConsultation,
    updateConsultation,
    deleteConsultation,
    addDocument,
  } = useHealthcare()
  const consultations = consultationsFor(uhid)
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const notesRef = useRef<HTMLInputElement>(null)
  const rxRef = useRef<HTMLInputElement>(null)

  const [doctor, setDoctor] = useState('')
  const [svc, setSvc] = useState(service)
  const [date, setDate] = useState('')
  const [complaint, setComplaint] = useState('')
  const [diagnosis, setDiagnosis] = useState('')
  const [treatment, setTreatment] = useState('')
  const [prescription, setPrescription] = useState('')
  const [followUp, setFollowUp] = useState('')
  const [files, setFiles] = useState<string[]>([])

  function displayDate(d: string) {
    return d
      ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      : todayShort()
  }

  /** Convert a "12 Jun 2025" display string back to yyyy-mm-dd for the date input. */
  function toInputDate(display?: string) {
    if (!display) return ''
    const t = Date.parse(display)
    if (Number.isNaN(t)) return ''
    return new Date(t).toISOString().slice(0, 10)
  }

  function resetForm() {
    setDoctor(EMPTY.doctor)
    setSvc(service)
    setDate(EMPTY.date)
    setComplaint(EMPTY.complaint)
    setDiagnosis(EMPTY.diagnosis)
    setTreatment(EMPTY.treatment)
    setPrescription(EMPTY.prescription)
    setFollowUp(EMPTY.followUp)
    setFiles([])
  }

  function openAdd() {
    setEditingId(null)
    resetForm()
    setOpen(true)
  }

  function openEdit(c: Consultation) {
    setEditingId(c.id)
    setDoctor(c.doctor)
    setSvc(c.service)
    setDate(toInputDate(c.date))
    setComplaint(c.chiefComplaint)
    setDiagnosis(c.diagnosis)
    setTreatment(c.treatmentNotes ?? '')
    setPrescription(c.prescription ?? '')
    setFollowUp(toInputDate(c.followUp))
    setFiles(c.files)
    setOpen(true)
  }

  function save() {
    if (!doctor || !complaint) {
      toast.error('Doctor and chief complaint are required')
      return
    }
    const payload = {
      uhid,
      doctor,
      service: svc,
      date: displayDate(date),
      chiefComplaint: complaint,
      diagnosis,
      treatmentNotes: treatment,
      prescription,
      followUp: followUp ? displayDate(followUp) : undefined,
      files,
    }

    if (editingId) {
      updateConsultation(editingId, payload)
      toast.success('Consultation updated')
    } else {
      addConsultation(payload)
      files.forEach((name) =>
        addDocument({ uhid, name, type: 'Consultation Notes', uploadedBy: doctor }),
      )
      toast.success('Consultation saved')
    }
    setEditingId(null)
    resetForm()
    setOpen(false)
  }

  function confirmDelete() {
    if (!deleteId) return
    deleteConsultation(deleteId)
    toast.error('Consultation deleted')
    setDeleteId(null)
  }

  function quickUpload(list: FileList | null, type: string) {
    if (!list || list.length === 0) return
    Array.from(list).forEach((f) => addDocument({ uhid, name: f.name, type }))
    toast.success(`${list.length} ${type.toLowerCase()} uploaded`)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          {consultations.length} consultation
          {consultations.length === 1 ? '' : 's'} on record
        </p>
        <div className="flex flex-wrap gap-2">
          <Protect module="PATIENT_PROFILE" action="UPDATE">
            <Button variant="outline" size="sm" onClick={() => notesRef.current?.click()}>
              <FileUp data-icon="inline-start" />
              Upload Consultation Notes
            </Button>
            <Button variant="outline" size="sm" onClick={() => rxRef.current?.click()}>
              <Pill data-icon="inline-start" />
              Upload Prescription
            </Button>
            <Button size="sm" onClick={openAdd}>
              <Plus data-icon="inline-start" />
              Enter Consultation Details
            </Button>
          </Protect>
        </div>
      </div>

      <input ref={notesRef} type="file" multiple className="hidden" onChange={(e) => quickUpload(e.target.files, 'Consultation Notes')} />
      <input ref={rxRef} type="file" multiple className="hidden" onChange={(e) => quickUpload(e.target.files, 'Prescription')} />

      {consultations.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-10 text-center">
            <Stethoscope className="size-8 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">No consultations recorded</p>
            <p className="text-sm text-muted-foreground">Use “Enter Consultation Details” to add the first one.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {consultations.map((c) => (
            <Card key={c.id}>
              <CardHeader className="flex-row items-start justify-between gap-2 space-y-0">
                <div className="flex flex-col gap-1">
                  <CardTitle className="text-base">{c.doctor}</CardTitle>
                  <CardDescription>
                    <Badge variant="secondary" className="mr-2">{c.service}</Badge>
                    {c.date}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-1">
                  {c.followUp && (
                    <span className="mr-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <CalendarClock className="size-3.5" />
                      Follow-up {c.followUp}
                    </span>
                  )}
                  <Protect module="PATIENT_PROFILE" action="UPDATE">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Edit consultation"
                      onClick={() => openEdit(c)}
                    >
                      <Pencil className="size-4" />
                    </Button>
                  </Protect>
                  <Protect module="PATIENT_PROFILE" action="DELETE">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      aria-label="Delete consultation"
                      onClick={() => setDeleteId(c.id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </Protect>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 text-sm">
                <Detail label="Chief Complaint" value={c.chiefComplaint} />
                <Detail label="Diagnosis" value={c.diagnosis} />
                {c.treatmentNotes && <Detail label="Treatment Notes" value={c.treatmentNotes} />}
                {c.prescription && <Detail label="Prescription" value={c.prescription} />}
                {c.files.length > 0 && (
                  <>
                    <Separator />
                    <div className="flex flex-wrap gap-2">
                      {c.files.map((f) => (
                        <span key={f} className="inline-flex items-center gap-1 rounded-md border border-border bg-muted/40 px-2 py-1 text-xs">
                          <Paperclip className="size-3" />
                          {f}
                        </span>
                      ))}
                    </div>
                  </>
                )}
                <AuditLine updatedBy={c.updatedBy} updatedAt={c.updatedAt} className="pt-1" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingId ? 'Edit Consultation' : 'Enter Consultation Details'}
            </DialogTitle>
            <DialogDescription>Record the clinical encounter for this patient.</DialogDescription>
          </DialogHeader>
          <FieldGroup className="max-h-[60vh] overflow-y-auto px-0.5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field>
                <FieldLabel>Doctor</FieldLabel>
                <Select value={doctor} onValueChange={(v) => setDoctor(v ?? '')}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="Select..." /></SelectTrigger>
                  <SelectContent>
                    {DOCTORS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor="con-date">Consultation Date</FieldLabel>
                <Input id="con-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor="con-complaint">Chief Complaint</FieldLabel>
              <Textarea id="con-complaint" rows={2} value={complaint} onChange={(e) => setComplaint(e.target.value)} placeholder="Presenting symptoms..." />
            </Field>
            <Field>
              <FieldLabel htmlFor="con-diagnosis">Diagnosis</FieldLabel>
              <Textarea id="con-diagnosis" rows={2} value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} placeholder="Clinical diagnosis..." />
            </Field>
            <Field>
              <FieldLabel htmlFor="con-treatment">Treatment Notes</FieldLabel>
              <Textarea id="con-treatment" rows={2} value={treatment} onChange={(e) => setTreatment(e.target.value)} placeholder="Plan, advice..." />
            </Field>
            <Field>
              <FieldLabel htmlFor="con-rx">Prescription</FieldLabel>
              <Textarea id="con-rx" rows={2} value={prescription} onChange={(e) => setPrescription(e.target.value)} placeholder="Medications, dosage..." />
            </Field>
            <Field>
              <FieldLabel htmlFor="con-follow">Follow-up Date</FieldLabel>
              <Input id="con-follow" type="date" value={followUp} onChange={(e) => setFollowUp(e.target.value)} />
            </Field>
            <Field>
              <FieldLabel htmlFor="con-files">Attach Notes / Prescriptions</FieldLabel>
              <Input
                id="con-files"
                type="file"
                multiple
                onChange={(e) => setFiles(Array.from(e.target.files ?? []).map((f) => f.name))}
              />
              {files.length > 0 && (
                <span className="text-xs text-muted-foreground">{files.length} file(s) attached</span>
              )}
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
            <Button onClick={save}>
              {editingId ? 'Save Changes' : 'Save Consultation'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteId !== null} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this consultation?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the consultation record. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
      <span className="text-foreground text-pretty">{value}</span>
    </div>
  )
}
