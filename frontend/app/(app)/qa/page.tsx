'use client'

import { useMemo, useState, useEffect } from 'react'
import {
  ClipboardCheck,
  ShieldAlert,
  ShieldCheck,
  TimerReset,
  FileText,
  CheckCircle2,
  AlertCircle
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
import { NC_SEVERITIES, NC_STATUSES, CURRENT_USER } from '@/lib/constants'
import { toast } from 'sonner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'

export default function QaPage() {
  const { ncs, closeNC, updateNC } = useHealthcare()
  const [severity, setSeverity] = useState(ALL)
  const [status, setStatus] = useState(ALL)
  
  // CAPA Modal State
  const [capaOpen, setCapaOpen] = useState(false)
  const [capaTarget, setCapaTarget] = useState<NonConformance | null>(null)
  
  // Feedback QA State
  const [feedbacks, setFeedbacks] = useState<any[]>([])
  const [qaFeedbackOpen, setQaFeedbackOpen] = useState(false)
  const [qaFeedbackTarget, setQaFeedbackTarget] = useState<any | null>(null)
  const [qaStatus, setQaStatus] = useState('Pending')
  const [qaReason, setQaReason] = useState('')
  const [qaRemarks, setQaRemarks] = useState('')
  
  // Form fields
  const [rootCause, setRootCause] = useState('')
  const [correctiveAction, setCorrectiveAction] = useState('')
  const [preventiveAction, setPreventiveAction] = useState('')
  const [capaStatus, setCapaStatus] = useState<'Pending' | 'Implemented' | 'Verified'>('Pending')
  const [ncStatus, setNcStatus] = useState<NonConformance['status']>('Open')

  useEffect(() => {
    fetch('/api/feedback')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setFeedbacks(data)
      })
      .catch(console.error)
  }, [])

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

  // Feedback analysis
  const blankFeedbacks = useMemo(() => feedbacks.filter(f => {
    // Blank means all ratings are 0 or overall is 0
    return (!f.overallRating || f.overallRating === 0) || 
           (f.ratings && f.ratings.every((r: any) => !r.rating || r.rating === 0))
  }), [feedbacks])
  
  const qaPending = useMemo(() => blankFeedbacks.filter(f => f.qaStatus === 'Pending' || !f.qaStatus), [blankFeedbacks])

  const handleQaSubmit = async () => {
    if (!qaFeedbackTarget) return
    try {
      // In a real app, you'd have an API route to update the feedback QA status
      // We will simulate it by updating the local state
      const updated = feedbacks.map(f => {
        if (f.id === qaFeedbackTarget.id) {
          return { ...f, qaStatus, qaReason, qaRemarks, qaVerifiedBy: CURRENT_USER.name, qaVerifiedAt: new Date().toISOString() }
        }
        return f
      })
      setFeedbacks(updated)
      setQaFeedbackOpen(false)
      toast.success('Feedback QA status updated')
    } catch (e) {
      toast.error('Failed to update QA status')
    }
  }

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

  const feedbackColumns: Column<any>[] = [
    {
      key: 'id',
      header: 'Feedback ID',
      sortable: true,
      render: (r) => <span className="font-medium text-foreground">{r.id}</span>
    },
    {
      key: 'patient',
      header: 'Patient',
      render: (r) => (
        <div>
          <Link href={`/patient-profile?uhid=${r.uhid}`} className="font-medium text-foreground hover:underline">
            {r.patientName || 'Verified Patient'}
          </Link>
          <div className="text-xs text-muted-foreground">{r.uhid}</div>
        </div>
      )
    },
    {
      key: 'service',
      header: 'Service Availed',
      render: (r) => (
        <div className="text-sm">
          {r.serviceAvailed || r.service || 'General'}
        </div>
      )
    },
    {
      key: 'date',
      header: 'Date',
      render: (r) => <span className="text-sm">{new Date(r.createdAt).toLocaleDateString()}</span>
    },
    {
      key: 'qaStatus',
      header: 'QA Status',
      render: (r) => {
        const s = r.qaStatus || 'Pending'
        return (
          <Badge className={
            s === 'Verified Positive' ? 'bg-emerald-100 text-emerald-800' :
            s === 'Declined' ? 'bg-red-100 text-red-800' :
            'bg-amber-100 text-amber-800'
          }>
            {s}
          </Badge>
        )
      }
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (r) => (
        <Button size="sm" variant="outline" onClick={() => {
          setQaFeedbackTarget(r)
          setQaStatus(r.qaStatus || 'Verified Positive')
          setQaReason(r.qaReason || '')
          setQaRemarks(r.qaRemarks || '')
          setQaFeedbackOpen(true)
        }}>
          <ClipboardCheck className="size-4 mr-2" /> Verify
        </Button>
      )
    }
  ]

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        breadcrumb={['Home', 'QA']}
        title="Quality Assurance"
        description="Monitor non-conformances, conduct CAPA, and verify blank feedbacks."
      />

      <Tabs defaultValue="nc" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="nc">Non-Conformances</TabsTrigger>
          <TabsTrigger value="feedback">
            Feedback QA 
            {qaPending.length > 0 && (
              <span className="ml-2 flex items-center justify-center rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700">
                {qaPending.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="nc" className="space-y-6 outline-none">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard label="Open NCs" value={open} icon={ShieldAlert} accent="warning" />
            <KpiCard
              label="In Progress"
              value={inProgress}
              icon={TimerReset}
              accent="teal"
            />
            <KpiCard label="Closed NCs" value={closed} icon={ShieldCheck} accent="green" />
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
        </TabsContent>

        <TabsContent value="feedback" className="space-y-6 outline-none">
          <div className="grid gap-4 sm:grid-cols-3">
            <KpiCard label="Blank Feedbacks" value={blankFeedbacks.length} icon={AlertCircle} accent="warning" />
            <KpiCard label="Pending QA" value={qaPending.length} icon={TimerReset} accent="destructive" />
            <KpiCard label="QA Verified" value={blankFeedbacks.length - qaPending.length} icon={CheckCircle2} accent="green" />
          </div>

          <DataTable
            columns={feedbackColumns}
            data={blankFeedbacks}
            getRowKey={(r) => r.id}
            searchKeys={['id', 'patientName', 'uhid', 'service']}
            searchPlaceholder="Search blank feedbacks..."
          />
        </TabsContent>
      </Tabs>

      {/* NC CAPA Dialog */}
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

      {/* Feedback QA Dialog */}
      <Dialog open={qaFeedbackOpen} onOpenChange={setQaFeedbackOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Feedback QA Verification</DialogTitle>
            <DialogDescription>
              Verify blank feedback records. This ensures analytics reflect true patient sentiment.
            </DialogDescription>
          </DialogHeader>
          {qaFeedbackTarget && (
            <div className="flex flex-col gap-4 py-4">
              <div className="bg-slate-50 p-3 rounded-md border text-sm text-slate-700">
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-slate-500">Patient:</div>
                  <div className="font-medium">{qaFeedbackTarget.patientName} ({qaFeedbackTarget.uhid})</div>
                  <div className="text-slate-500">Service:</div>
                  <div className="font-medium">{qaFeedbackTarget.serviceAvailed || qaFeedbackTarget.service || 'General'}</div>
                </div>
              </div>
              <FieldGroup>
                <Field>
                  <FieldLabel>QA Status</FieldLabel>
                  <Select value={qaStatus} onValueChange={(val) => setQaStatus(val || '')}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Verified Positive">Verified Positive</SelectItem>
                      <SelectItem value="Declined">Declined</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel>QA Reason</FieldLabel>
                  <Select value={qaReason} onValueChange={(val) => setQaReason(val || '')}>
                    <SelectTrigger><SelectValue placeholder="Select a reason" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Loyal Patient">Loyal Patient</SelectItem>
                      <SelectItem value="Patient verbally confirmed satisfaction">Patient verbally confirmed satisfaction</SelectItem>
                      <SelectItem value="Patient refused to fill">Patient refused to fill</SelectItem>
                      <SelectItem value="Elderly Patient">Elderly Patient</SelectItem>
                      <SelectItem value="Unable to complete">Unable to complete</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel>QA Remarks (Optional)</FieldLabel>
                  <Textarea
                    placeholder="Additional context from the QA caller..."
                    value={qaRemarks}
                    onChange={(e) => setQaRemarks(e.target.value)}
                  />
                </Field>
              </FieldGroup>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setQaFeedbackOpen(false)}>Cancel</Button>
            <Button onClick={handleQaSubmit}>Save Verification</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
