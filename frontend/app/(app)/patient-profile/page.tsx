'use client'

import { Suspense, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { useSearchParams, useRouter } from 'next/navigation'
import {
  Phone,
  Mail,
  MapPin,
  Droplet,
  Calendar,
  ShieldCheck,
  ShieldAlert,
  FileWarning,
  Pencil,
  Star,
  RefreshCw,
  BadgeCheck,
  Users,
} from 'lucide-react'

import { Protect } from '@/components/protect'

import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { KpiCard } from '@/components/kpi-card'
import { AuditLine } from '@/components/patient/audit-line'
import { EditPatientDialog } from '@/components/patient/edit-patient-dialog'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { DataTable, type Column } from '@/components/data-table'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { ArrowRight } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useHealthcare, expectedDocsForService, type Patient } from '@/lib/store'
import { CURRENT_USER, SERVICES, PATIENT_CATEGORIES } from '@/lib/constants'
import { ConsultationsTab } from '@/components/patient/consultations-tab'
import { BillingTab } from '@/components/patient/billing-tab'
import { DocumentsTab } from '@/components/patient/documents-tab'
import { ComplianceTab } from '@/components/patient/compliance-tab'

function StatCard({
  label,
  value,
  tone = 'neutral',
}: {
  label: string
  value: string | number
  tone?: 'neutral' | 'ok' | 'warn'
}) {
  const toneClass =
    tone === 'warn'
      ? 'text-amber-600'
      : tone === 'ok'
        ? 'text-emerald-600'
        : 'text-foreground'
  return (
    <Card>
      <CardContent className="p-4">
        <span className="text-sm text-muted-foreground">{label}</span>
        <p
          className={`mt-1 font-heading text-2xl font-semibold tabular-nums ${toneClass}`}
        >
          {value}
        </p>
      </CardContent>
    </Card>
  )
}

function PatientProfileContent() {
  const params = useSearchParams()
  const router = useRouter()
  const { patients, documentsFor, ncsFor, consultationsFor, invoicesFor } =
    useHealthcare()

  const [editOpen, setEditOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<{
    type: 'consultation' | 'invoice' | 'document'
    data: any
  } | null>(null)
  const queryUhid = params.get('uhid') ?? ''

  const [filterDept, setFilterDept] = useState<string>('Department')
  const [filterCategory, setFilterCategory] = useState<string>('Category')
  const [filterStatus, setFilterStatus] = useState<string>('Status')

  const uniqueDepts = SERVICES
  const uniqueCategories = PATIENT_CATEGORIES
  const uniqueStatuses = ['Active', 'Inactive', 'Closed']

  const filteredPatientsList = useMemo(() => {
    return patients.filter((p) => {
      if (filterDept !== 'Department' && p.service !== filterDept) return false
      const cat = p.patientCategory || 'General'
      if (filterCategory !== 'Category' && cat !== filterCategory) return false
      const stat = p.status || 'Active'
      if (filterStatus !== 'Status' && stat !== filterStatus) return false
      return true
    })
  }, [patients, filterDept, filterCategory, filterStatus])

  // Analytics for Patients List view
  const repeatCount = useMemo(() => {
    return patients.filter(p => {
      const fromConsults = consultationsFor(p.uhid).length
      const fromInvoices = invoicesFor(p.uhid).length
      return (fromConsults + fromInvoices) > 1
    }).length
  }, [patients, consultationsFor, invoicesFor])

  const vipCount = useMemo(() => {
    return patients.filter(p => p.vip).length
  }, [patients])

  const activeCount = useMemo(() => {
    return patients.filter(p => p.status === 'Active').length
  }, [patients])

  // Resolve current patient early so hooks below can reference it safely
  const patient = queryUhid ? (patients.find((p) => p.uhid === queryUhid) ?? null) : null

  const docs = patient ? documentsFor(patient.uhid) : []
  const ncs = patient ? ncsFor(patient.uhid) : []
  const openNcs = ncs.filter((n) => n.status !== 'Closed')
  const consultations = patient ? consultationsFor(patient.uhid) : []
  const invoices = patient ? invoicesFor(patient.uhid) : []
  const balance = invoices.reduce((s, i) => s + i.balance, 0)

  const expected = patient ? expectedDocsForService(patient.service) : []
  const present = new Set(docs.map((d) => d.type))
  const missing = expected.filter((e) => !present.has(e))
  const complete = missing.length === 0

  const allServicesTaken = useMemo(() => {
    if (!patient) return []
    const fromConsults = consultations.map(c => c.service)
    const fromInvoices = invoices.map(inv => inv.service)
    const list = Array.from(new Set([patient.service, ...fromConsults, ...fromInvoices])).filter(Boolean)
    return list
  }, [patient, consultations, invoices])

  const timelineHistory = useMemo(() => {
    if (!patient) return []
    const dates: Record<string, { date: string; consultations: any[]; invoices: any[]; documents: any[] }> = {}
    const getGroup = (dStr: string) => {
      const clean = dStr?.trim() || 'No Date'
      if (!dates[clean]) dates[clean] = { date: clean, consultations: [], invoices: [], documents: [] }
      return dates[clean]
    }
    consultations.forEach(c => getGroup(c.date).consultations.push(c))
    invoices.forEach(i => getGroup(i.date).invoices.push(i))
    docs.forEach(d => {
      const dStamp = d.updatedAt ? d.updatedAt.split(',')[0].trim() : patient.registeredOn
      getGroup(dStamp).documents.push(d)
    })
    return Object.values(dates).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [patient, consultations, invoices, docs])

  const associatedDoctorName = useMemo(() => {
    if (!selectedItem || selectedItem.type !== 'invoice') return ''
    const match = consultations.find(c => c.date === selectedItem.data.date)
    return match ? `Dr. ${match.doctor}` : 'N/A'
  }, [selectedItem, consultations])

  const patientColumns: Column<Patient>[] = [
    {
      key: 'uhid',
      header: 'UHID',
      sortable: true,
      render: (r) => <span className="font-semibold text-blue-600">{r.uhid}</span>,
    },
    {
      key: 'name',
      header: 'Patient Name',
      sortable: true,
      render: (r) => {
        const isRepeat = (consultationsFor(r.uhid).length + invoicesFor(r.uhid).length) > 1
        return (
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-medium text-foreground">{r.name}</span>
              {r.vip && (
                <Badge className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-[9px] px-1 py-0 h-4">
                  ★ VIP
                </Badge>
              )}
              {isRepeat && (
                <Badge className="bg-blue-100 text-blue-800 font-semibold text-[9px] px-1 py-0 h-4">
                  Repeat
                </Badge>
              )}
            </div>
            <span className="text-xs text-muted-foreground">
              {r.age} Y / {r.gender}
            </span>
          </div>
        )
      },
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

  // Render full Patients List if no specific patient is selected
  if (!queryUhid) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Patients List"
          description="Directory of all registered patients."
          breadcrumb={['Home', 'Patients']}
          action={
            <Protect module="REGISTRATION" action="CREATE">
              <Button onClick={() => router.push('/registration')}>
                Register Patient
              </Button>
            </Protect>
          }
        />

        {/* ─── Summary / Repeat Patients KPI Row ─── */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            label="Total Registered Patients"
            value={patients.length}
            icon={Users}
            accent="primary"
          />
          <KpiCard
            label="Loyal / Repeat Patients"
            value={repeatCount}
            icon={RefreshCw}
            accent="teal"
            trend={`${Math.round((repeatCount / Math.max(patients.length, 1)) * 100)}% returning rate`}
            trendPositive
          />
          <KpiCard
            label="VIP Class Patients"
            value={vipCount}
            icon={Star}
            accent="warning"
          />
          <KpiCard
            label="Active Clinical Profiles"
            value={activeCount}
            icon={BadgeCheck}
            accent="green"
          />
        </div>

        <Card>
          <CardContent className="pt-6">
            <DataTable
              columns={patientColumns}
              data={filteredPatientsList}
              toolbar={
                <div className="flex flex-wrap items-center gap-2">
                  <Select value={filterDept} onValueChange={setFilterDept}>
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Department">Department</SelectItem>
                      {uniqueDepts.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Category">Category</SelectItem>
                      {uniqueCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Status">Status</SelectItem>
                      {uniqueStatuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              }
              searchKeys={['name', 'uhid', 'phone', 'service']}
              searchPlaceholder="Search patients by name, UHID, phone..."
              getRowKey={(r) => r.uhid}
              renderActions={(r) => (
                <>
                  <DropdownMenuItem onClick={() => router.push(`/patient-profile?uhid=${r.uhid}`)}>
                    <ArrowRight data-icon="inline-start" />
                    Open Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push(`/billing?uhid=${r.uhid}`)}>
                    Create Bill
                  </DropdownMenuItem>
                </>
              )}
            />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!patient) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Patient Profile"
          description="A 360° view of the patient across the centre."
          breadcrumb={['Home', 'Patient Profile']}
        />
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            No patients registered yet. Complete a registration to view a
            profile here.
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Patient Profile"
        description="A 360° view of the patient across the centre."
        breadcrumb={['Home', 'Patient Profile']}
        action={
          <Button variant="outline" onClick={() => router.push('/patient-profile')}>
            ← Back to Patients List
          </Button>
        }
      />

      <Card>
        <CardContent className="flex flex-col gap-6 p-5 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-4 w-full">
            <Avatar className="size-16">
              <AvatarFallback className="bg-primary text-lg font-semibold text-primary-foreground">
                {patient.initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1.5 w-full">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-heading text-xl font-semibold text-foreground text-balance">
                  {patient.salutation} {patient.name}
                </h2>
                {patient.vip && (
                  <Badge className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-[9px] px-1.5 py-0.5">
                    ★ VIP
                  </Badge>
                )}
                <Badge variant="secondary" className="font-mono text-xs">
                  {patient.uhid}
                </Badge>
                <Badge variant={patient.status === 'Active' ? 'default' : 'outline'}>
                  {patient.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {patient.age} yrs · {patient.gender}
                {patient.bloodGroup ? ` · ${patient.bloodGroup}` : ''}
              </p>
              <div className="flex flex-col gap-1 pt-1 text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:gap-x-4">
                <span className="inline-flex items-center gap-1.5">
                  <Phone className="size-3.5" aria-hidden="true" /> {patient.phone}
                </span>
                {patient.email ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Mail className="size-3.5" aria-hidden="true" /> {patient.email}
                  </span>
                ) : null}
                {patient.bloodGroup ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Droplet className="size-3.5 text-destructive" aria-hidden="true" />{' '}
                    {patient.bloodGroup}
                  </span>
                ) : null}
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="size-3.5" aria-hidden="true" /> Registered{' '}
                  {patient.registeredOn}
                </span>
              </div>
              {patient.address ? (
                <p className="flex items-start gap-1.5 pt-1 text-sm text-muted-foreground">
                  <MapPin className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
                  {patient.address}
                </p>
              ) : null}

              {/* Dynamic Emergency Contact & Visit summary */}
              <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:justify-between text-sm text-muted-foreground gap-1.5">
                <div>
                  <span className="font-semibold text-slate-800">Emergency Contact:</span>{' '}
                  {patient.emergencyName ? (
                    <span>
                      {patient.emergencyName} ({patient.emergencyRelationship}) · {patient.emergencyPhone}
                    </span>
                  ) : (
                    <span>Not provided</span>
                  )}
                </div>
                <div>
                  <span className="font-semibold text-slate-800">Last Visit:</span>{' '}
                  <span>{patient.lastVisit}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 flex-col items-stretch gap-3 sm:items-end">
            <Protect module="PATIENT_PROFILE" action="CREATE">
              <Button
                variant="outline"
                size="sm"
                className="w-full sm:w-auto"
                onClick={() => setEditOpen(true)}
              >
                <Pencil data-icon="inline-start" />
                Edit Patient
              </Button>
            </Protect>
            <div className="flex items-center gap-2 rounded-lg border border-border p-3">
              {complete ? (
                <ShieldCheck className="size-5 text-emerald-600" aria-hidden="true" />
              ) : (
                <ShieldAlert className="size-5 text-amber-600" aria-hidden="true" />
              )}
              <div className="text-sm">
                <p className="font-medium text-foreground">
                  {complete ? 'File Complete' : `${missing.length} Doc(s) Missing`}
                </p>
                <p className="text-xs text-muted-foreground">
                  {openNcs.length} open NC{openNcs.length === 1 ? '' : 's'}
                </p>
              </div>
            </div>
            <AuditLine
              updatedBy={patient.updatedBy}
              updatedAt={patient.updatedAt}
            />
          </div>
        </CardContent>
      </Card>

      <EditPatientDialog
        patient={patient}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Consultations" value={consultations.length} />
        <StatCard label="Documents on File" value={docs.length} />
        <StatCard
          label="Outstanding Balance"
          value={`₹${balance.toLocaleString('en-IN')}`}
          tone={balance > 0 ? 'warn' : 'ok'}
        />
        <StatCard
          label="Open NCs"
          value={openNcs.length}
          tone={openNcs.length > 0 ? 'warn' : 'ok'}
        />
      </div>

      {missing.length > 0 ? (
        <Card className="border-amber-300 bg-amber-50/60 dark:bg-amber-950/20">
          <CardHeader className="flex flex-row items-center gap-2 space-y-0">
            <FileWarning className="size-4 text-amber-600" aria-hidden="true" />
            <CardTitle className="text-sm">
              Missing documents for a compliant file
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2 pb-4">
            {missing.map((m) => (
              <Badge
                key={m}
                variant="outline"
                className="border-amber-400 text-amber-700 dark:text-amber-400"
              >
                {m}
              </Badge>
            ))}
          </CardContent>
        </Card>
      ) : null}

      <div className="w-full">
        <Tabs defaultValue={CURRENT_USER.roleKey === 'concerned-dept' ? 'compliance' : 'history'}>
          <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1">
            {CURRENT_USER.roleKey !== 'concerned-dept' && (
              <TabsTrigger value="history">Visits History Timeline</TabsTrigger>
            )}
            {CURRENT_USER.roleKey !== 'concerned-dept' && (
              <TabsTrigger value="consultations">Consultations ({consultations.length})</TabsTrigger>
            )}
            {(CURRENT_USER.roleKey === 'FRONT_DESK' || CURRENT_USER.roleKey === 'ADMIN') && (
              <TabsTrigger value="billing">Billing ({invoices.length})</TabsTrigger>
            )}
            {CURRENT_USER.roleKey !== 'concerned-dept' && (
              <TabsTrigger value="documents">Documents ({docs.length})</TabsTrigger>
            )}

            {CURRENT_USER.roleKey !== 'front-office' && (
              <TabsTrigger value="compliance">
                Compliance / NCs
                {openNcs.length > 0 ? (
                  <Badge
                    variant="destructive"
                    className="ml-2 h-5 min-w-5 px-1 text-[10px]"
                  >
                    {openNcs.length}
                  </Badge>
                ) : null}
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="history" className="mt-4">
            <div className="space-y-6 relative border-l-2 border-slate-200 pl-6 ml-3">
              {timelineHistory.length === 0 ? (
                <p className="text-sm text-muted-foreground italic pl-2">No visits recorded yet.</p>
              ) : (
                timelineHistory.map((day) => (
                  <div key={day.date} className="relative group">
                    {/* Circle dot marker */}
                    <div className="absolute -left-[31px] top-1.5 size-4 rounded-full border-2 border-blue-600 bg-white group-hover:bg-blue-600 transition-colors" />
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-800 bg-slate-100 rounded px-2.5 py-1">{day.date}</span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-2">
                        {/* Consultations */}
                        {day.consultations.map((c: any) => (
                          <div
                            key={c.id}
                            onClick={() => setSelectedItem({ type: 'consultation', data: c })}
                            className="border border-slate-200 rounded-lg p-3 bg-white hover:shadow-sm hover:border-blue-400 transition-all cursor-pointer"
                          >
                            <span className="text-[10px] font-bold text-blue-600 uppercase block tracking-wider mb-1">Consultation</span>
                            <h4 className="font-semibold text-slate-800 text-sm">Dr. {c.doctor}</h4>
                            <p className="text-xs text-slate-600 mt-1">Department: <strong className="text-slate-700">{c.service}</strong></p>
                            {c.diagnosis && <p className="text-xs text-slate-500 mt-1 italic">Diagnosis: {c.diagnosis}</p>}
                          </div>
                        ))}

                        {/* Invoices */}
                        {day.invoices.map((i: any) => (
                          <div
                            key={i.id}
                            onClick={() => setSelectedItem({ type: 'invoice', data: i })}
                            className="border border-slate-200 rounded-lg p-3 bg-white hover:shadow-sm hover:border-emerald-400 transition-all cursor-pointer"
                          >
                            <span className="text-[10px] font-bold text-emerald-600 uppercase block tracking-wider mb-1">Billing / Invoice</span>
                            <h4 className="font-semibold text-slate-800 text-sm">Invoice {i.id.length > 20 ? `INV-${i.id.substring(0, 6).toUpperCase()}` : i.id}</h4>
                            <div className="grid grid-cols-2 gap-x-2 text-xs text-slate-600 mt-1">
                              <span>Total: <strong>₹{i.total}</strong></span>
                              <span>Status: <strong className={i.status === 'Paid' ? 'text-emerald-600' : 'text-amber-600'}>{i.status}</strong></span>
                            </div>
                          </div>
                        ))}


                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          {CURRENT_USER.roleKey !== 'concerned-dept' && (
            <TabsContent value="consultations" className="mt-4">
              <ConsultationsTab uhid={patient.uhid} service={patient.service} />
            </TabsContent>
          )}
          {(CURRENT_USER.roleKey === 'FRONT_DESK' || CURRENT_USER.roleKey === 'ADMIN') && (
            <TabsContent value="billing" className="mt-4">
              <BillingTab uhid={patient.uhid} patientName={patient.name} />
            </TabsContent>
          )}
          {CURRENT_USER.roleKey !== 'concerned-dept' && (
            <TabsContent value="documents" className="mt-4">
              <DocumentsTab uhid={patient.uhid} service={patient.service} />
            </TabsContent>
          )}

          {CURRENT_USER.roleKey !== 'front-office' && (
            <TabsContent value="compliance" className="mt-4">
              <ComplianceTab patient={patient} />
            </TabsContent>
          )}
        </Tabs>
      </div>

      {/* ─── Visits History Timeline Details Dialog ─── */}
      <Dialog open={selectedItem !== null} onOpenChange={(open) => !open && setSelectedItem(null)}>
        <DialogContent className="sm:max-w-xl max-h-[85vh] overflow-y-auto">
          {selectedItem && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-lg">
                  {selectedItem.type === 'consultation' && 'Clinical Record & Consultation Detail'}
                  {selectedItem.type === 'invoice' && 'Invoice Billing Details'}
                  {selectedItem.type === 'document' && 'Diagnostic Report Detail'}
                </DialogTitle>
                <DialogDescription>
                  Full records for activity on {selectedItem.data.date || selectedItem.data.updatedAt?.split(',')[0]}
                </DialogDescription>
              </DialogHeader>

              {/* Consultation Details */}
              {selectedItem.type === 'consultation' && (
                <div className="space-y-4 pt-3">
                  <div className="bg-slate-50 rounded-lg p-3 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-500 font-semibold block uppercase">Consultant Doctor</span>
                      <strong className="text-slate-800 text-sm">Dr. {selectedItem.data.doctor}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 font-semibold block uppercase">Service / Department</span>
                      <strong className="text-slate-800 text-sm">{selectedItem.data.service}</strong>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Chief Complaint</h4>
                    <p className="text-sm bg-white border rounded p-2 text-slate-700 italic">
                      {selectedItem.data.chiefComplaint || 'No complaints recorded.'}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Diagnosis</h4>
                    <p className="text-sm bg-white border rounded p-2 text-slate-700">
                      {selectedItem.data.diagnosis || 'No diagnosis recorded.'}
                    </p>
                  </div>

                  {selectedItem.data.treatmentNotes && (
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Treatment Notes</h4>
                      <p className="text-sm bg-white border rounded p-2 text-slate-700 whitespace-pre-line">
                        {selectedItem.data.treatmentNotes}
                      </p>
                    </div>
                  )}

                  {/* Prescription Section (Rx Layout) */}
                  <div className="border border-blue-200 bg-blue-50/30 rounded-lg p-4 space-y-2 mt-4 relative overflow-hidden">
                    <div className="absolute right-3 top-2 text-blue-200/50 font-serif font-black text-6xl select-none">Rx</div>
                    <h4 className="text-xs font-bold text-blue-800 uppercase tracking-wider flex items-center gap-1">
                      <span>Prescribed Medication</span>
                    </h4>
                    <div className="text-sm text-slate-700 whitespace-pre-line font-mono border-t border-blue-100 pt-2">
                      {selectedItem.data.prescription || 'No medicines prescribed.'}
                    </div>
                  </div>

                  {selectedItem.data.files && selectedItem.data.files.length > 0 && (
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Attached File Records</h4>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {selectedItem.data.files.map((f: string) => (
                          <Badge key={f} variant="outline" className="bg-slate-100 text-slate-700">
                            {f}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Invoice Details */}
              {selectedItem.type === 'invoice' && (
                <div className="space-y-4 pt-3">
                  <div className="bg-slate-50 rounded-lg p-3 grid grid-cols-2 gap-y-3 gap-x-4 text-xs">
                    <div>
                      <span className="text-slate-500 font-semibold block uppercase">Visit Date</span>
                      <strong className="text-slate-800 text-sm">{selectedItem.data.date}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 font-semibold block uppercase">Invoice Number</span>
                      <strong className="text-slate-800 text-sm">{selectedItem.data.id && selectedItem.data.id.length > 20 ? `INV-${selectedItem.data.id.substring(0, 6).toUpperCase()}` : selectedItem.data.id}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 font-semibold block uppercase">Service / Department</span>
                      <strong className="text-slate-800 text-sm">{selectedItem.data.service}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 font-semibold block uppercase">Consultant Doctor</span>
                      <strong className="text-slate-800 text-sm">{associatedDoctorName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 font-semibold block uppercase">Total Billed</span>
                      <strong className="text-slate-800 text-sm">₹{selectedItem.data.total}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 font-semibold block uppercase">Payment Status</span>
                      <Badge className={selectedItem.data.status === 'Paid' ? 'bg-green-100 text-green-800 hover:bg-green-100' : 'bg-amber-100 text-amber-800 hover:bg-amber-100'}>
                        {selectedItem.data.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Charges Summary</h4>
                    <div className="border rounded-lg overflow-hidden bg-white text-sm">
                      <div className="grid grid-cols-2 p-2 border-b bg-slate-50 font-medium">
                        <span>Description</span>
                        <span className="text-right">Amount</span>
                      </div>
                      <div className="grid grid-cols-2 p-2 border-b">
                        <span>{selectedItem.data.service} Charges</span>
                        <span className="text-right">₹{selectedItem.data.subtotal.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="grid grid-cols-2 p-2 border-b text-xs text-slate-500">
                        <span>Tax / GST</span>
                        <span className="text-right">₹{selectedItem.data.tax.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="grid grid-cols-2 p-2 border-b text-xs text-slate-500">
                        <span>Discount Authorised</span>
                        <span className="text-right">-₹{selectedItem.data.discount.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="grid grid-cols-2 p-2 bg-slate-50 font-bold text-slate-900">
                        <span>Total Due</span>
                        <span className="text-right">₹{selectedItem.data.total.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="grid grid-cols-2 p-2 text-xs text-emerald-600 font-semibold border-t">
                        <span>Paid Amount</span>
                        <span className="text-right">₹{selectedItem.data.paid.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="grid grid-cols-2 p-2 text-xs text-amber-600 font-semibold border-t bg-amber-50/20">
                        <span>Outstanding Balance</span>
                        <span className="text-right">₹{selectedItem.data.balance.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Document Details */}
              {selectedItem.type === 'document' && (
                <div className="space-y-4 pt-3">
                  <div className="bg-slate-50 rounded-lg p-3 space-y-2 text-xs">
                    <div>
                      <span className="text-slate-500 font-semibold block uppercase">Report Category / Type</span>
                      <strong className="text-slate-800 text-sm">{selectedItem.data.type}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 font-semibold block uppercase">Attached File Name</span>
                      <code className="text-slate-800 text-xs font-mono">{selectedItem.data.name}</code>
                    </div>
                    {selectedItem.data.updatedAt && (
                      <div>
                        <span className="text-slate-500 font-semibold block uppercase">Uploaded Timestamp</span>
                        <span className="text-slate-800">{selectedItem.data.updatedAt}</span>
                      </div>
                    )}
                  </div>
                  <div className="pt-2">
                    <Button className="w-full flex items-center justify-center gap-1.5" onClick={() => { window.open('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf-test.pdf', '_blank'); toast.success('Opening report PDF file...') }}>
                      Open Diagnostic Document / PDF
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4 border-t">
                <DialogClose render={<Button variant="secondary" />}>Close</DialogClose>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}


export default function PatientProfilePage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Loading patient profile…</div>}>
      <PatientProfileContent />
    </Suspense>
  )
}
