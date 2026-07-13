'use client'

import { useMemo, useState } from 'react'
import {
  AlertTriangle,
  CheckCircle2,
  FolderOpen,
  ShieldCheck,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { PageHeader } from '@/components/page-header'
import { KpiCard } from '@/components/kpi-card'
import { DataTable, type Column } from '@/components/data-table'
import { Protect } from '@/components/protect'
import { FilterSelect, ALL } from '@/components/filter-select'
import { StatusBadge } from '@/components/status-badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  useHealthcare,
  expectedDocsForService,
  departmentForDoc,
} from '@/lib/store'
import { toast } from 'sonner'

type FileRow = {
  uhid: string
  patient: string
  service: string
  expected: string[]
  present: string[]
  missing: string[]
  unverified: string[]
  completeness: number
  status: 'Complete' | 'Incomplete' | 'Pending Verification'
}

export default function MrdPage() {
  const router = useRouter()
  const { patients, documentsFor, ncs, generateNC, verifyDocument } = useHealthcare()
  const [status, setStatus] = useState(ALL)

  const rows = useMemo<FileRow[]>(() => {
    return patients.map((p) => {
      const expected = expectedDocsForService(p.service)
      const docs = documentsFor(p.uhid)
      const presentTypes = new Set(docs.map((d) => String(d.type)))
      const verifiedTypes = new Set(
        docs.filter((d) => d.verified).map((d) => String(d.type)),
      )
      const present = expected.filter((e) => presentTypes.has(e))
      const missing = expected.filter((e) => !presentTypes.has(e))
      const unverified = expected.filter(
        (e) => presentTypes.has(e) && !verifiedTypes.has(e),
      )
      const completeness = Math.round(
        (expected.filter((e) => verifiedTypes.has(e)).length /
          expected.length) *
          100,
      )
      const rowStatus: FileRow['status'] =
        missing.length > 0
          ? 'Incomplete'
          : unverified.length > 0
            ? 'Pending Verification'
            : 'Complete'
      return {
        uhid: p.uhid,
        patient: p.name,
        service: p.service,
        expected,
        present,
        missing,
        unverified,
        completeness,
        status: rowStatus,
      }
    })
  }, [patients, documentsFor])

  const filtered = useMemo(
    () => rows.filter((r) => status === ALL || r.status === status),
    [rows, status],
  )

  const complete = rows.filter((r) => r.status === 'Complete').length
  const incomplete = rows.filter((r) => r.status === 'Incomplete').length
  const openNcs = ncs.filter((n) => n.status !== 'Closed').length

  function raiseNcsForFile(row: FileRow) {
    const existing = new Set(ncs.map((n) => `${n.uhid}::${n.relatedDocument}`))
    const targets = [...row.missing, ...row.unverified]
    let created = 0
    for (const doc of targets) {
      if (existing.has(`${row.uhid}::${doc}`)) continue
      const isMissing = row.missing.includes(doc)
      generateNC({
        uhid: row.uhid,
        patient: row.patient,
        relatedDocument: doc,
        department: departmentForDoc(doc),
        severity: isMissing ? 'Major' : 'Minor',
        dueDate: '',
        assignedTo: departmentForDoc(doc),
        description: isMissing
          ? `${doc} missing from patient record.`
          : `${doc} uploaded but not yet verified.`,
      })
      created++
    }
    if (created > 0) {
      toast.success(
        `${created} non-conformance${created > 1 ? 's' : ''} raised`,
        { description: `Routed to responsible departments for ${row.patient}.` },
      )
    } else {
      toast.info('No new NCs needed', {
        description: 'All gaps for this file already have open NCs.',
      })
    }
  }

  function verifyPendingDocs(row: FileRow) {
    const docs = documentsFor(row.uhid)
    let verifiedCount = 0
    for (const doc of docs) {
      if (!doc.verified && row.unverified.includes(String(doc.type))) {
        verifyDocument(doc.id)
        verifiedCount++
      }
    }
    toast.success(`Verified ${verifiedCount} document(s) for ${row.patient}`)
  }

  const columns: Column<FileRow>[] = [
    {
      key: 'patient',
      header: 'Patient File',
      sortable: true,
      render: (r) => (
        <div>
          <Link
            href={`/patient-profile?uhid=${r.uhid}`}
            className="font-medium text-foreground hover:underline"
          >
            {r.patient}
          </Link>
          <div className="text-xs text-muted-foreground">
            {r.uhid} · {r.service}
          </div>
        </div>
      ),
    },
    {
      key: 'completeness',
      header: 'Completeness',
      render: (r) => (
        <div className="flex min-w-[140px] items-center gap-2">
          <Progress value={r.completeness} className="h-2" />
          <span className="w-9 text-right text-xs tabular-nums text-muted-foreground">
            {r.completeness}%
          </span>
        </div>
      ),
    },
    {
      key: 'present',
      header: 'Documents',
      render: (r) => (
        <span className="text-sm text-muted-foreground">
          {r.present.length}/{r.expected.length} present
        </span>
      ),
    },
    {
      key: 'gaps',
      header: 'Gaps',
      render: (r) =>
        r.missing.length === 0 && r.unverified.length === 0 ? (
          <span className="text-sm text-muted-foreground">None</span>
        ) : (
          <div className="flex max-w-[240px] flex-wrap gap-1">
            {r.missing.map((m) => (
              <span
                key={m}
                className="rounded bg-destructive/10 px-1.5 py-0.5 text-[11px] font-medium text-destructive"
              >
                {m}
              </span>
            ))}
            {r.unverified.map((u) => (
              <span
                key={u}
                className="rounded bg-amber-500/15 px-1.5 py-0.5 text-[11px] font-medium text-amber-600 dark:text-amber-400"
              >
                {u} · unverified
              </span>
            ))}
          </div>
        ),
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
      render: (r) => (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => router.push(`/patient-profile?uhid=${r.uhid}`)}>
            Open
          </Button>
          {r.status !== 'Complete' && (
            <Protect module="MRD" action="CREATE">
              <Button variant="outline" size="sm" onClick={() => raiseNcsForFile(r)}>
                Raise NC
              </Button>
            </Protect>
          )}
          {r.unverified.length > 0 && (
            <Protect module="MRD" action="UPDATE">
              <Button variant="default" size="sm" onClick={() => verifyPendingDocs(r)}>
                Verify
              </Button>
            </Protect>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        breadcrumb={['Home', 'MRD']}
        title="Medical Records (MRD)"
        description="Track document completeness across every patient file and raise non-conformances for gaps."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Patient Files"
          value={rows.length}
          icon={FolderOpen}
          accent="primary"
        />
        <KpiCard label="Complete" value={complete} icon={CheckCircle2} accent="green" />
        <KpiCard
          label="Incomplete"
          value={incomplete}
          icon={AlertTriangle}
          accent="warning"
        />
        <KpiCard label="Open NCs" value={openNcs} icon={ShieldCheck} accent="teal" />
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        getRowKey={(r) => r.uhid}
        searchKeys={['patient', 'uhid', 'service']}
        searchPlaceholder="Search files by patient, UHID or service"
        toolbar={
          <FilterSelect
            label="Status"
            value={status}
            onValueChange={setStatus}
            options={['Complete', 'Incomplete', 'Pending Verification']}
            className="w-[12rem]"
          />
        }
      />
    </div>
  )
}
