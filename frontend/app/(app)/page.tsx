'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Users,
  Receipt,
  FileWarning,
  ShieldAlert,
  ArrowRight,
  CalendarDays,
  UserPlus,
  MessageSquare,
  BadgeCheck,
  CircleDollarSign,
  Activity,
  AlertTriangle,
  Filter,
} from 'lucide-react'
import { toast } from 'sonner'

import { PageHeader } from '@/components/page-header'
import { KpiCard } from '@/components/kpi-card'
import { PatientJourneyStepper } from '@/components/patient-journey-stepper'
import { DataTable, type Column } from '@/components/data-table'
import { StatusBadge } from '@/components/status-badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import {
  useHealthcare,
  expectedDocsForService,
  type Appointment,
  type Patient,
} from '@/lib/store'
import { getHealthStatus, type HealthSummary } from '@/lib/api'
import { buildOperationalAlerts } from '@/lib/operational-alerts'
import { getLoggedInUser } from '@/lib/constants'

function todayLabel() {
  return new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function matchesWindow(dateValue: string, mode: 'today' | 'week' | 'all') {
  if (mode === 'all') return true
  const parsed = new Date(dateValue)
  if (Number.isNaN(parsed.getTime())) return mode === 'today' ? dateValue === todayLabel() : true

  const now = new Date()
  const start = new Date(now)
  start.setHours(0, 0, 0, 0)
  if (mode === 'today') {
    return parsed.toDateString() === now.toDateString()
  }

  start.setDate(now.getDate() - 6)
  return parsed >= start && parsed <= now
}

export default function DashboardPage() {
  const router = useRouter()
  const [backendSummary, setBackendSummary] = useState<HealthSummary | null>(null)
  const [viewMode, setViewMode] = useState<'today' | 'week' | 'all'>('today')
  const [patientTypeFilter, setPatientTypeFilter] = useState('All')
  const [queueStatusFilter, setQueueStatusFilter] = useState('All')
  const [departmentFilter, setDepartmentFilter] = useState('All')
  const [currentUser, setCurrentUser] = useState(getLoggedInUser)
  useEffect(() => { setCurrentUser(getLoggedInUser()) }, [])
  const {
    appointments,
    patients,
    invoices,
    documents,
    ncs,
    inquiries,
    updateAppointmentStatus,
  } = useHealthcare()

  const pendingBilling = invoices.filter((i) => i.status !== 'Paid').length
  const departmentOptions = [
    'All',
    'Doctor Consultation',
    'Cardiology',
    'Pulmonology',
    'Radiology',
    'Pathology',
    'Sample Collection',
    'Dental',
    'Ophthalmology',
    'Home Healthcare',
    'Day Care',
    'Vaccination',
    'Physiotherapy'
  ]

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      const matchesStatus = queueStatusFilter === 'All' || appointment.status === queueStatusFilter
      const matchesDepartment = departmentFilter === 'All' || 
        (Array.isArray(appointment.services) ? appointment.services.includes(departmentFilter) : 
         (typeof appointment.service === 'string' ? appointment.service.includes(departmentFilter) : false))
      return matchesStatus && matchesDepartment && matchesWindow(appointment.date, viewMode)
    })
  }, [appointments, departmentFilter, queueStatusFilter, viewMode])

  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      const matchesType = patientTypeFilter === 'All' || patient.patientCategory === patientTypeFilter
      const matchesDepartment = departmentFilter === 'All' || 
        patient.assignedDepartment === departmentFilter || 
        (Array.isArray(patient.services) ? patient.services.includes(departmentFilter) : 
         (typeof patient.service === 'string' ? patient.service.includes(departmentFilter) : false))
      return matchesType && matchesDepartment
    })
  }, [departmentFilter, patients, patientTypeFilter])

  const todaysAppointments = filteredAppointments.filter((a) => a.date === todayLabel()).length
  const walkins = filteredPatients.filter((p) => p.patientCategory === 'Walk-In').length
  const pendingInquiries = filteredAppointments.filter((a) => a.status === 'Scheduled').length
  const checkedIn = filteredAppointments.filter((a) => a.status === 'Checked In').length
  const todaysCollection = invoices
    .filter((inv) => matchesWindow(inv.date || '', 'today'))
    .reduce((sum, inv) => sum + Number(inv.paid || 0), 0)
  const criticalAlerts = ncs.filter((n) => n.status !== 'Closed').length
  const recentActivity = useMemo(() => {
    const latestPatient = [...patients].sort((a, b) => (b.registeredOn || '').localeCompare(a.registeredOn || ''))[0]
    const latestInvoice = [...invoices].sort((a, b) => (b.date || '').localeCompare(a.date || ''))[0]
    const latestIssue = [...ncs].filter((n) => n.status !== 'Closed').sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))[0]
    const items: Array<{ title: string; detail: string; time: string }> = []
    if (latestPatient) {
      items.push({
        title: 'New registration captured',
        detail: `${latestPatient.name} • ${latestPatient.service}`,
        time: latestPatient.registeredOn,
      })
    }
    if (latestInvoice) {
      items.push({
        title: 'Billing update pending',
        detail: `Invoice ${latestInvoice.id} • ₹${latestInvoice.total.toLocaleString('en-IN')}`,
        time: latestInvoice.date,
      })
    }
    if (latestIssue) {
      items.push({
        title: 'Open quality concern',
        detail: latestIssue.title || 'Quality review pending',
        time: latestIssue.createdAt || 'Pending',
      })
    }

    return items.slice(0, 4)
  }, [invoices, ncs, patients])

  // Funnel Analytics
  const totalInquiries = inquiries.length
  const totalAppointments = appointments.length
  const totalRegisteredPatients = patients.length
  const billedPatientsCount = new Set(invoices.map(i => i.uhid)).size
  
  const funnelData = [
    { label: 'Inquiries', value: totalInquiries, color: 'bg-blue-500' },
    { label: 'Appointments', value: totalAppointments, color: 'bg-indigo-500' },
    { label: 'Registered', value: totalRegisteredPatients, color: 'bg-purple-500' },
    { label: 'Billed', value: billedPatientsCount, color: 'bg-emerald-500' }
  ]
  const maxFunnelValue = Math.max(totalInquiries, 1) // prevent div by zero

  // Missing documents across all registered patients.
  const missingDocs = useMemo(() => {
    let count = 0
    for (const p of patients) {
      const present = new Set(
        documents.filter((d) => d.uhid === p.uhid).map((d) => d.type),
      )
      count += expectedDocsForService(p.service).filter(
        (e) => !present.has(e),
      ).length
    }
    return count
  }, [patients, documents])

  const openNcs = ncs.filter((n) => n.status !== 'Closed').length

  const dueFollowUps = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return inquiries.filter(i => {
      if (!i.followUp || i.status === 'Converted' || i.status === 'Lost') return false
      const fDate = new Date(i.followUp)
      if (Number.isNaN(fDate.getTime())) return false
      fDate.setHours(0, 0, 0, 0)
      return fDate.getTime() <= today.getTime()
    })
  }, [inquiries])

  const operationalAlerts = useMemo(
    () => buildOperationalAlerts({
      pendingBilling,
      missingDocuments: missingDocs,
      openNcs,
      inquiriesFollowUpCount: dueFollowUps.length,
      backendHealthy: backendSummary?.status === 'ok',
      patientsCount: patients.length,
    }),
    [backendSummary, pendingBilling, missingDocs, openNcs, dueFollowUps.length, patients.length],
  )

  const queue = filteredAppointments.filter(
    (a) => !['Cancelled', 'No Show', 'Completed'].includes(a.status),
  )

  useEffect(() => {
    getHealthStatus().then(setBackendSummary).catch(() => undefined)
  }, [])

  const serviceRevenue = useMemo(() => {
    const totals = patients.reduce<Record<string, number>>((acc, patient) => {
      const invs = invoices.filter((item) => item.uhid === patient.uhid && matchesWindow(item.date || '', 'today'))
      invs.forEach(inv => {
        acc[patient.service] = (acc[patient.service] ?? 0) + Number(inv.total || 0)
      })
      return acc
    }, {})
    return Object.entries(totals).slice(0, 4)
  }, [patients, invoices])

  const columns: Column<Appointment>[] = [
    {
      key: 'id',
      header: 'Ref',
      sortable: true,
      render: (r) => <span className="font-medium tabular-nums">{r.id}</span>,
    },
    {
      key: 'firstName',
      header: 'Patient',
      sortable: true,
      render: (r) => (
        <div className="flex flex-col">
          <span className="font-medium text-foreground">{r.firstName} {r.lastName}</span>
          <span className="text-xs text-muted-foreground">
            {r.uhid ?? 'Not registered'}
          </span>
        </div>
      ),
    },
    { key: 'service', header: 'Service', sortable: true },
    { key: 'doctor', header: 'Doctor', sortable: true },
    {
      key: 'time',
      header: 'Time',
      align: 'right',
      render: (r) => <span className="tabular-nums">{r.time}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (r) => <StatusBadge status={r.status} />,
    },
  ]

  const patientColumns: Column<Patient>[] = [
    {
      key: 'uhid',
      header: 'UHID',
      sortable: true,
      render: (r) => <span className="font-semibold tabular-nums text-blue-600">{r.uhid}</span>,
    },
    {
      key: 'name',
      header: 'Patient Name',
      sortable: true,
      render: (r) => (
        <div className="flex flex-col">
          <span className="font-medium text-foreground">{r.name}</span>
          <span className="text-xs text-muted-foreground">
            {r.age} Y / {r.gender}
          </span>
        </div>
      ),
    },
    { key: 'phone', header: 'Contact No.', sortable: true },
    { key: 'service', header: 'Initial Service/Dept', sortable: true },
    {
      key: 'registeredOn',
      header: 'Registered Date',
      sortable: true,
      render: (r) => <span className="tabular-nums">{r.registeredOn}</span>,
    },
    {
      key: 'patientCategory',
      header: 'Category',
      sortable: true,
      render: (r) => <Badge variant="secondary">{r.patientCategory || 'General'}</Badge>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (r) => (
        <Badge className={r.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}>
          {r.status}
        </Badge>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl border border-primary/20 bg-gradient-to-r from-blue-50 via-white to-indigo-50 p-5 shadow-sm">
        <div className="flex flex-col gap-2">
          <p className="text-lg font-bold uppercase tracking-[0.2em] text-primary">Dashboard</p>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl" suppressHydrationWarning>
            Hello {currentUser.name}
          </h1>
        </div>
      </div>

      <Card className="border-primary/20 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <CardContent className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Centre operations</p>
          </div>
          <div className="flex flex-wrap items-end gap-3">
            <label className="flex flex-col gap-1 text-sm text-muted-foreground">
              <span>Time window</span>
              <select value={viewMode} onChange={(event) => setViewMode(event.target.value as 'today' | 'week' | 'all')} className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground">
                <option value="today">Today</option>
                <option value="week">This week</option>
                <option value="all">All time</option>
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm text-muted-foreground">
              <span>Patient type</span>
              <select value={patientTypeFilter} onChange={(event) => setPatientTypeFilter(event.target.value)} className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground">
                <option value="All">All types</option>
                <option value="Walk-In">Walk-In</option>
                <option value="Insurance">Insurance</option>
                <option value="Corporate">Corporate</option>
                <option value="Health Camp">Health Camp</option>
                <option value="Referral">Referral</option>
                <option value="Existing Patient">Existing Patient</option>
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm text-muted-foreground">
              <span>Services</span>
              <select value={departmentFilter} onChange={(event) => setDepartmentFilter(event.target.value)} className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground">
                {departmentOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm text-muted-foreground">
              <span>Queue status</span>
              <select value={queueStatusFilter} onChange={(event) => setQueueStatusFilter(event.target.value)} className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground">
                <option value="All">All statuses</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Checked In">Checked In</option>
                <option value="Registered">Registered</option>
              </select>
            </label>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Registered Patients"
          value={patients.length}
          icon={Users}
          trend="Live count"
          accent="primary"
        />
        <KpiCard
          label="Pending Billing"
          value={pendingBilling}
          icon={Receipt}
          trend="Invoices with balance"
          trendDirection="down"
          trendPositive
          accent="teal"
        />
        <KpiCard
          label="Missing Documents"
          value={missingDocs}
          icon={FileWarning}
          trend="Across all patient files"
          trendDirection="up"
          trendPositive={false}
          accent="warning"
        />
        <KpiCard
          label="Open NCs"
          value={openNcs}
          icon={ShieldAlert}
          trend="Non-conformances to close"
          trendDirection="down"
          trendPositive
          accent="destructive"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Today&apos;s Centre Pulse</CardTitle>
            <CardDescription>Operational status across the centre.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground"><CalendarDays className="size-4 text-primary" /> Today&apos;s Appointments</div>
              <div className="mt-2 text-2xl font-semibold text-foreground">{todaysAppointments}</div>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground"><UserPlus className="size-4 text-primary" /> Walk-in Patients</div>
              <div className="mt-2 text-2xl font-semibold text-foreground">{walkins}</div>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground"><MessageSquare className="size-4 text-primary" /> Pending Inquiries</div>
              <div className="mt-2 text-2xl font-semibold text-foreground">{pendingInquiries}</div>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground"><BadgeCheck className="size-4 text-primary" /> Checked-in Patients</div>
              <div className="mt-2 text-2xl font-semibold text-foreground">{checkedIn}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Priority Actions & Revenue</CardTitle>
            <CardDescription>Finance and compliance focus areas.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground"><CircleDollarSign className="size-4 text-primary" /> Today&apos;s Collection</div>
              <div className="mt-2 text-2xl font-semibold text-foreground">₹{todaysCollection.toLocaleString('en-IN')}</div>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground"><AlertTriangle className="size-4 text-primary" /> Critical Alerts</div>
              <div className="mt-2 text-2xl font-semibold text-foreground">{criticalAlerts}</div>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground"><Activity className="size-4 text-primary" /> Operational Alerts</div>
              <div className="mt-2 flex flex-col gap-2">
                {operationalAlerts.map((alert) => (
                  <button
                    key={alert.id}
                    type="button"
                    onClick={() => router.push(alert.href)}
                    className="rounded-md border border-border/70 bg-background/80 px-3 py-2 text-left text-sm transition hover:border-primary/40 hover:bg-primary/5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-foreground">{alert.title}</span>
                      <span className="text-[11px] uppercase tracking-wide text-muted-foreground">{alert.meta}</span>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">{alert.message}</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground"><Activity className="size-4 text-primary" /> Service-wise Revenue</div>
              <div className="mt-2 flex flex-col gap-1 text-sm text-muted-foreground">
                {serviceRevenue.map(([name, value]) => <span key={name}>{name}: ₹{value.toLocaleString('en-IN')}</span>)}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest operational movement.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {recentActivity.map((item) => (
              <div key={item.title} className="rounded-lg border border-border bg-muted/30 p-3">
                <div className="text-sm font-medium text-foreground">{item.title}</div>
                <div className="text-xs text-muted-foreground">{item.detail}</div>
                <div className="text-[11px] text-muted-foreground/70">{item.time}</div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Follow-ups Due</CardTitle>
            <CardDescription>Inquiries requiring action today.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 h-full">
            {dueFollowUps.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-muted-foreground text-sm">
                No follow-ups due today.
              </div>
            ) : (
              dueFollowUps.slice(0, 5).map((inq) => (
                <div key={inq.id} className="rounded-lg border border-warning/50 bg-warning/5 p-3 flex flex-col cursor-pointer transition hover:bg-warning/10" onClick={() => router.push('/inquiry')}>
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-foreground text-sm">{inq.firstName} {inq.lastName}</span>
                    <Badge variant="outline" className="text-[10px]">{inq.status}</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{inq.phone} • {inq.service}</div>
                  <div className="text-[11px] text-muted-foreground mt-1 line-clamp-1">{inq.notes ?? 'No notes'}</div>
                </div>
              ))
            )}
            {dueFollowUps.length > 5 && (
              <Button variant="ghost" className="w-full text-xs mt-2" onClick={() => router.push('/inquiry')}>View All ({dueFollowUps.length})</Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ─── Analytics & Charts Section ─── */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Service-wise Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Department Revenue Distribution</CardTitle>
            <CardDescription>Visual breakdown of cumulative billing collections by service</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {serviceRevenue.map(([name, val]) => {
              const maxVal = Math.max(...serviceRevenue.map(([, v]) => v), 1)
              const pct = Math.round((val / maxVal) * 100)
              return (
                <div key={name} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700">{name}</span>
                    <span className="text-slate-900">₹{val.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Patient Volume Analytics */}
        <Card>
          <CardHeader>
            <CardTitle>Patient Category Allocation</CardTitle>
            <CardDescription>Breakdown of patient volumes across different clinical paths</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: 'Walk-In Patients', count: walkins, color: 'from-emerald-500 to-teal-500' },
              { label: 'Today\'s Scheduled Appointments', count: todaysAppointments, color: 'from-amber-500 to-orange-500' },
              { label: 'Total Registered Patients', count: patients.length, color: 'from-indigo-500 to-purple-500' },
              { label: 'Critical Open Issues / NCs', count: criticalAlerts, color: 'from-rose-500 to-red-500' }
            ].map((item) => {
              const maxCount = Math.max(patients.length, 1)
              const pct = Math.round((item.count / maxCount) * 100)
              return (
                <div key={item.label} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700">{item.label}</span>
                    <span className="text-slate-900">{item.count} patients</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden">
                    <div className={`bg-gradient-to-r ${item.color} h-full rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="size-5 text-indigo-500" />
              Patient Lifecycle Funnel
            </CardTitle>
            <CardDescription>Conversion metrics from inquiry to billed services.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 py-2">
              {funnelData.map((step, idx) => {
                const widthPct = Math.max((step.value / maxFunnelValue) * 100, 5)
                const conversionPct = idx > 0 && funnelData[idx - 1].value > 0 
                  ? Math.round((step.value / funnelData[idx - 1].value) * 100) 
                  : 100

                return (
                  <div key={step.label} className="flex items-center gap-4 group">
                    <div className="w-32 text-right text-sm font-medium text-slate-700">
                      {step.label}
                    </div>
                    <div className="flex-1 flex items-center gap-3">
                      <div className="h-10 rounded-r-lg rounded-l-sm transition-all duration-500 ease-out flex items-center px-3 shadow-sm"
                           style={{ width: `${widthPct}%`, backgroundColor: 'var(--tw-gradient-from)', backgroundImage: `linear-gradient(to right, rgb(248, 250, 252), var(--tw-color-${step.color.split('-')[1]}-500))` }}
                      >
                        <span className="font-bold text-slate-800 tabular-nums bg-white/60 px-1.5 py-0.5 rounded text-xs">{step.value}</span>
                      </div>
                      {idx > 0 && (
                        <div className="text-xs font-semibold text-slate-400 bg-slate-50 px-2 py-1 rounded-full border border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity">
                          {conversionPct}% of prev
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Today&apos;s Queue</CardTitle>
          <CardDescription>
            Active appointments moving through the centre.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={queue}
            searchKeys={['firstName', 'lastName', 'service', 'id', 'doctor']}
            searchPlaceholder="Search queue..."
            getRowKey={(r) => r.id}
            renderActions={(r) => (
              <>
                <DropdownMenuItem
                  onClick={() =>
                    r.uhid
                      ? router.push(`/patient-profile?uhid=${r.uhid}`)
                      : toast('Patient not registered yet.')
                  }
                >
                  <ArrowRight data-icon="inline-start" />
                  Open profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    updateAppointmentStatus(r.id, 'Checked In')
                    toast.success(`${r.firstName} ${r.lastName} checked in`)
                  }}
                >
                  Check in
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    updateAppointmentStatus(r.id, 'Completed')
                    toast.success(`${r.firstName} ${r.lastName} marked complete`)
                  }}
                >
                  Mark complete
                </DropdownMenuItem>
              </>
            )}
          />
        </CardContent>
      </Card>
    </div>
  )
}
