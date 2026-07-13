'use client'

import { useMemo, useState } from 'react'
import { ShieldAlert, Plus, CheckCircle2, TriangleAlert } from 'lucide-react'
import { toast } from 'sonner'

import { StatusBadge } from '@/components/status-badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table'
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
  DEPARTMENTS,
  NC_SEVERITIES,
  CURRENT_USER,
} from '@/lib/constants'
import {
  useHealthcare,
  expectedDocsForService,
  departmentForDoc,
  type Patient,
} from '@/lib/store'

export function ComplianceTab({ patient }: { patient: Patient }) {
  const { ncsFor, documentsFor, generateNC, closeNC } = useHealthcare()
  const ncs = ncsFor(patient.uhid)
  const docs = documentsFor(patient.uhid)
  const [open, setOpen] = useState(false)

  const missing = useMemo(() => {
    const expected = expectedDocsForService(patient.service)
    return expected.filter((type) => {
      // ID Proof aliasing
      if (type === 'ID Proof') {
        return !docs.some((d) => ['ID Proof', 'Aadhaar Card', 'PAN Card', 'Passport'].includes(d.type))
      }
      
      // All medical reports aliasing (Investigation / Previous Reports count for any report requirement)
      const reportTypes = ['Pathology Report', 'Radiology Report', 'Dental Report', 'Ophthalmology Report']
      if (reportTypes.includes(type)) {
        return !docs.some((d) => [type, 'Investigation Reports', 'Previous Reports'].includes(d.type))
      }
      
      return !docs.some((d) => d.type === type)
    })
  }, [docs, patient.service])

  const verifiedTypes = useMemo(
    () => new Set(docs.filter((d) => d.verified).map((d) => d.type)),
    [docs],
  )

  const [relatedDoc, setRelatedDoc] = useState('')
  const [severity, setSeverity] = useState('Major')
  const [department, setDepartment] = useState('')
  const [assignedTo, setAssignedTo] = useState(CURRENT_USER.name)
  const [dueDate, setDueDate] = useState('')
  const [description, setDescription] = useState('')
  const [rootCause, setRootCause] = useState('')

  function displayDate(d: string) {
    return d
      ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      : new Date(Date.now() + 7 * 864e5).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  function openFor(doc?: string) {
    setRelatedDoc(doc ?? '')
    setDepartment(doc ? departmentForDoc(doc) : '')
    setDescription(doc ? `${doc} missing for registered patient.` : '')
    setSeverity('Major')
    setAssignedTo(CURRENT_USER.name)
    setDueDate('')
    setRootCause('')
    setOpen(true)
  }

  function save() {
    if (!relatedDoc || !department) {
      toast.error('Related document and department are required')
      return
    }
    generateNC({
      uhid: patient.uhid,
      patient: patient.name,
      relatedDocument: relatedDoc,
      department,
      severity: severity as 'Minor' | 'Major' | 'Critical',
      dueDate: displayDate(dueDate),
      assignedTo,
      description,
      rootCause,
    })
    toast.success('Non-conformance generated')
    setOpen(false)
  }

  return (
    <div className="flex flex-col gap-4">
      {missing.length > 0 && (
        <Alert variant="destructive">
          <TriangleAlert />
          <AlertTitle>{missing.length} required document(s) missing</AlertTitle>
          <AlertDescription>
            <span className="mb-2 block">
              {missing.join(', ')} not uploaded. Raise a non-conformance to track
              resolution.
            </span>
            <div className="flex flex-wrap gap-2">
              {missing.map((m) => (
                <Button key={m} size="sm" variant="outline" onClick={() => openFor(m)}>
                  <Plus data-icon="inline-start" />
                  {`Generate NC · ${m}`}
                </Button>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader className="flex-row items-center justify-between gap-2 space-y-0">
          <div className="flex flex-col gap-1">
            <CardTitle>Compliance Non-Conformances</CardTitle>
            <CardDescription>Issues tracked against this patient file.</CardDescription>
          </div>
          <Button size="sm" onClick={() => openFor()}>
            <Plus data-icon="inline-start" />
            Generate NC
          </Button>
        </CardHeader>
        <CardContent>
          {ncs.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
              <ShieldAlert className="size-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">No non-conformances raised.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableHead>NC Number</TableHead>
                    <TableHead>Related Document</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ncs.map((n) => {
                    const resolvable = verifiedTypes.has(n.relatedDocument)
                    return (
                      <TableRow key={n.id}>
                        <TableCell className="font-medium tabular-nums">{n.id}</TableCell>
                        <TableCell>{n.relatedDocument}</TableCell>
                        <TableCell>{n.department}</TableCell>
                        <TableCell><StatusBadge status={n.severity} /></TableCell>
                        <TableCell><StatusBadge status={n.status} /></TableCell>
                        <TableCell>{n.dueDate}</TableCell>
                        <TableCell>{n.assignedTo}</TableCell>
                        <TableCell className="text-right">
                          {n.status !== 'Closed' ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={!resolvable}
                              title={resolvable ? 'Close NC' : 'Upload & verify document to close'}
                              onClick={() => { closeNC(n.id); toast.success(`${n.id} closed`) }}
                            >
                              <CheckCircle2 data-icon="inline-start" />
                              Close NC
                            </Button>
                          ) : (
                            <span className="text-xs text-muted-foreground">Resolved</span>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Generate Non-Conformance</DialogTitle>
            <DialogDescription>Raise a compliance issue for this patient file.</DialogDescription>
          </DialogHeader>
          <FieldGroup className="max-h-[60vh] overflow-y-auto px-0.5">
            <Field>
              <FieldLabel>Related Document</FieldLabel>
              <Select value={relatedDoc} onValueChange={(value) => { const next = value ?? ''; setRelatedDoc(next); setDepartment(departmentForDoc(next)) }}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Select document" /></SelectTrigger>
                <SelectContent>
                  {expectedDocsForService(patient.service).map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="nc-desc">Description</FieldLabel>
              <Textarea id="nc-desc" rows={2} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the issue..." />
            </Field>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field>
                <FieldLabel>Severity</FieldLabel>
                <Select value={severity} onValueChange={(value) => setSeverity(value ?? '')}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="Select..." /></SelectTrigger>
                  <SelectContent>
                    {NC_SEVERITIES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel>Department</FieldLabel>
                <Select value={department} onValueChange={(value) => setDepartment(value ?? '')}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="Select..." /></SelectTrigger>
                  <SelectContent>
                    {DEPARTMENTS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="nc-assigned">Assigned To</FieldLabel>
                <Input id="nc-assigned" value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} />
              </Field>
              <Field>
                <FieldLabel htmlFor="nc-due">Target Closure Date</FieldLabel>
                <Input id="nc-due" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor="nc-root">Root Cause / Notes</FieldLabel>
              <Textarea id="nc-root" rows={2} value={rootCause} onChange={(e) => setRootCause(e.target.value)} placeholder="Optional analysis..." />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
            <Button onClick={save}>Generate NC</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
