'use client'

import { useMemo, useState } from 'react'
import {
  ClipboardCheck,
  ShieldAlert,
  ShieldCheck,
  TimerReset,
} from 'lucide-react'
import Link from 'next/link'
import { PageHeader } from '@/components/page-header'
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
  const { ncs, closeNC } = useHealthcare()
  const [severity, setSeverity] = useState(ALL)
  const [status, setStatus] = useState(ALL)

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
                closeNC(r.id)
                toast.success(`${r.id} closed`, {
                  description: `${r.relatedDocument} resolved for ${r.patient}.`,
                })
              }}
            >
              Close NC
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
    </div>
  )
}
