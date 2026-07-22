'use client'

import { useMemo, useState } from 'react'
import {
  ClipboardCheck,
  ShieldAlert,
  ShieldCheck,
  TimerReset,
  FileText,
  CheckCircle2,
} from 'lucide-react'
import Link from 'next/link'
import { PageHeader } from '@/components/page-header'
import { Field, FieldLabel, FieldGroup } from '@/components/ui/field'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { KpiCard } from '@/components/kpi-card'
import { DataTable, type Column } from '@/components/data-table'
import { Protect } from '@/components/protect'
import { FilterSelect, ALL } from '@/components/filter-select'
import { StatusBadge } from '@/components/status-badge'
import { Button } from '@/components/ui/button'
import { useHealthcare, type NonConformance } from '@/lib/store'
import { NC_SEVERITIES, NC_STATUSES } from '@/lib/constants'
import { toast } from 'sonner'

export default function QaPage() {
  const { ncs, closeNC, updateNC } = useHealthcare()
  const [severity, setSeverity] = useState(ALL)
  const [status, setStatus] = useState(ALL)
  
  // CAPA Modal State
  const [capaOpen, setCapaOpen] = useState(false)
  const [capaTarget, setCapaTarget] = useState<NonConformance | null>(null)
  
  // Form fields
  const [rootCause, setRootCause] = useState('')
  const [correctiveAction, setCorrectiveAction] = useState('')
  const [preventiveAction, setPreventiveAction] = useState('')
  const [capaStatus, setCapaStatus] = useState<'Pending' | 'Implemented' | 'Verified'>('Pending')
  const [ncStatus, setNcStatus] = useState<NonConformance['status']>('Open')

  const filtered = useMemo(
    () =>
      ncs.filter(
        (n) =>
          (severity === ALL || n.severity === severity) &&
          (status === ALL || n.status === status),
      ),
    [ncs, severity, status],
  )

  const open = ncs.filter((n) => n.status === 'Open').length
  const inProgress = ncs.filter((n) => n.status === 'In Progress').length
  const closed = ncs.filter((n) => n.status === 'Closed').length
  const critical = ncs.filter(
    (n) => n.severity === 'Critical' && n.status !== 'Closed',
  ).length

  const columns: Column<NonConformance>[] = [
    {
      key: 'id',
      header: 'NC ID',
      sortable: true,
      render: (r) => (
        <span className="font-medium text-foreground">{r.id}</span>
      ),
    },
    {
      key: 'patient',
      header: 'Patient',
      render: (r) => (
        <div>
          <Link
            href={`/patient-profile?uhid=${r.uhid}`}
            className="font-medium text-foreground hover:underline"
          >
            {r.patient}
          </Link>
          <div className="text-xs text-muted-foreground">{r.uhid}</div>
        </div>
      ),
    },
    {
      key: 'relatedDocument',
      header: 'Related Document',
      render: (r) => (
        <div>
          <div className="text-sm text-foreground">{r.relatedDocument}</div>
          {r.description && (
            <div className="max-w-[240px] truncate text-xs text-muted-foreground">
              {r.description}
            </div>
          )}
        </div>
      ),
    },
    { key: 'department', header: 'Department', sortable: true },
    {
      key: 'severity',
      header: 'Severity',
      render: (r) => <StatusBadge status={r.severity} />,
    },
    {
      key: 'status',
      header: 'Status',
      render: (r) => <StatusBadge status={r.status} />,
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (r) =>
        r.status !== 'Closed' ? (
          <Protect module="QA" action="UPDATE">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setCapaTarget(r)
                setRootCause(r.rootCause || '')
                setCorrectiveAction(r.correctiveAction || '')
                setPreventiveAction(r.preventiveAction || '')
                setCapaStatus(r.capaStatus || 'Pending')
                setNcStatus(r.status)
                setCapaOpen(true)
              }}
            >
              <FileText className="mr-2 h-4 w-4" />
              Manage CAPA
            </Button>
          </Protect>
        ) : (
          <span className="text-xs text-muted-foreground">Resolved</span>
        ),
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        breadcrumb={['Home', 'QA']}
        title="Quality Assurance"
        description="Monitor non-conformances raised across departments and drive them to closure."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Open" value={open} icon={ShieldAlert} accent="warning" />
        <KpiCard
          label="In Progress"
          value={inProgress}
          icon={TimerReset}
          accent="teal"
        />
        <KpiCard label="Closed" value={closed} icon={ShieldCheck} accent="green" />
        <KpiCard
          label="Critical Open"
          value={critical}
          icon={ClipboardCheck}
          accent="destructive"
        />
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        getRowKey={(r) => r.id}
        searchKeys={['id', 'patient', 'uhid', 'relatedDocument', 'department']}
        searchPlaceholder="Search non-conformances"
        toolbar={
          <>
            <FilterSelect
              label="Severity"
              value={severity}
              onValueChange={setSeverity}
              options={[...NC_SEVERITIES]}
            />
            <FilterSelect
              label="Status"
              value={status}
              onValueChange={setStatus}
              options={[...NC_STATUSES]}
            />
          </>
        }
      />

      <Dialog open={capaOpen} onOpenChange={setCapaOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Manage CAPA - {capaTarget?.id}</DialogTitle>
            <DialogDescription>
              Document Root Cause Analysis and Corrective/Preventive Actions for this Non-Conformance.
            </DialogDescription>
          </DialogHeader>
          {capaTarget && (
            <div className="flex flex-col gap-4 py-4">
              <div className="bg-slate-50 p-3 rounded-md border text-sm text-slate-700">
                <strong>Description:</strong> {capaTarget.description || 'No description provided'}
              </div>
              <FieldGroup>
                <Field>
                  <FieldLabel>Root Cause Analysis</FieldLabel>
                  <Textarea
                    placeholder="Describe the fundamental reason for this NC..."
                    value={rootCause}
                    onChange={(e) => setRootCause(e.target.value)}
                  />
                </Field>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel>Corrective Action (CA)</FieldLabel>
                    <Textarea
                      placeholder="Immediate action to fix the issue..."
                      value={correctiveAction}
                      onChange={(e) => setCorrectiveAction(e.target.value)}
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Preventive Action (PA)</FieldLabel>
                    <Textarea
                      placeholder="Action to prevent recurrence..."
                      value={preventiveAction}
                      onChange={(e) => setPreventiveAction(e.target.value)}
                    />
                  </Field>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel>CAPA Status</FieldLabel>
                    <Select value={capaStatus} onValueChange={(val: any) => setCapaStatus(val)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Implemented">Implemented</SelectItem>
                        <SelectItem value="Verified">Verified</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel>NC Status</FieldLabel>
                    <Select value={ncStatus} onValueChange={(val: any) => setNcStatus(val)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Open">Open</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                </div>
              </FieldGroup>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setCapaOpen(false)}>Cancel</Button>
            <Button onClick={() => {
              if (capaTarget) {
                updateNC(capaTarget.id, {
                  rootCause,
                  correctiveAction,
                  preventiveAction,
                  capaStatus,
                  status: ncStatus,
                })
                toast.success(`CAPA updated for ${capaTarget.id}`)
                setCapaOpen(false)
              }
            }}>
              Save CAPA
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
