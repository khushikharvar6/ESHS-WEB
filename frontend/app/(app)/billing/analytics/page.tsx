'use client'

import { useMemo, useState } from 'react'
import {
  DollarSign, TrendingUp, TrendingDown, Receipt, AlertTriangle,
  Users, CreditCard, FileText, Gift, BarChart3, Filter,
  Download, Calendar, Building2, Shield, Stethoscope, ChevronDown,
  ChevronUp, Percent
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PageHeader } from '@/components/page-header'
import { DataTable, type Column } from '@/components/data-table'
import { StatusBadge } from '@/components/status-badge'
import { useHealthcare } from '@/lib/store'
import { SERVICES } from '@/lib/constants'

// ────────────────────────────────────────────────
// Helper: date range checks
// ────────────────────────────────────────────────
function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null
  const d = new Date(dateStr)
  return isNaN(d.getTime()) ? null : d
}

function isToday(d: Date) {
  const t = new Date()
  return d.toDateString() === t.toDateString()
}

function isThisWeek(d: Date) {
  const now = new Date()
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay())
  startOfWeek.setHours(0, 0, 0, 0)
  return d >= startOfWeek && d <= now
}

function isThisMonth(d: Date) {
  const now = new Date()
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
}

function isThisQuarter(d: Date) {
  const now = new Date()
  const q = Math.floor(now.getMonth() / 3)
  const qStart = new Date(now.getFullYear(), q * 3, 1)
  return d >= qStart && d <= now
}

function isLast6Months(d: Date) {
  const now = new Date()
  const sixMonthsAgo = new Date(now)
  sixMonthsAgo.setMonth(now.getMonth() - 6)
  return d >= sixMonthsAgo && d <= now
}

function isThisYear(d: Date) {
  const now = new Date()
  return d.getFullYear() === now.getFullYear()
}

function isInDateRange(d: Date, start: string, end: string) {
  const s = start ? new Date(start) : null
  const e = end ? new Date(end) : null
  if (s && d < s) return false
  if (e && d > e) return false
  return true
}

// ────────────────────────────────────────────────
// KPI Card
// ────────────────────────────────────────────────
function AnalyticsKPI({ label, value, icon: Icon, color = 'text-blue-600', bgColor = 'bg-blue-50', prefix = '', suffix = '' }: {
  label: string; value: string | number; icon: any; color?: string; bgColor?: string; prefix?: string; suffix?: string
}) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</span>
          <span className="text-2xl font-bold text-slate-900">{prefix}{typeof value === 'number' ? value.toLocaleString('en-IN') : value}{suffix}</span>
        </div>
        <div className={`flex items-center justify-center size-10 rounded-lg ${bgColor} ${color}`}>
          <Icon className="size-5" />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  )
}

export default function BillingAnalyticsPage() {
  const { invoices, patients } = useHealthcare()

  // Filter states
  const [dateRange, setDateRange] = useState('all')
  const [customStart, setCustomStart] = useState('')
  const [customEnd, setCustomEnd] = useState('')
  const [searchUhid, setSearchUhid] = useState('')
  const [searchName, setSearchName] = useState('')
  const [deptFilter, setDeptFilter] = useState('All')
  const [paymentStatus, setPaymentStatus] = useState('All')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [showFilters, setShowFilters] = useState(false)

  // Apply filters
  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => {
      // Date range filter
      const d = parseDate(inv.date || inv.createdAt)
      if (d) {
        switch (dateRange) {
          case 'today': if (!isToday(d)) return false; break
          case 'week': if (!isThisWeek(d)) return false; break
          case 'month': if (!isThisMonth(d)) return false; break
          case 'quarter': if (!isThisQuarter(d)) return false; break
          case '6months': if (!isLast6Months(d)) return false; break
          case 'year': if (!isThisYear(d)) return false; break
          case 'custom': if (!isInDateRange(d, customStart, customEnd)) return false; break
        }
      }

      // UHID filter
      if (searchUhid && !(inv.uhid || '').toLowerCase().includes(searchUhid.toLowerCase())) return false

      // Name filter
      if (searchName && !(inv.patient || '').toLowerCase().includes(searchName.toLowerCase())) return false

      // Department/Service filter
      if (deptFilter !== 'All' && !(inv.service || '').includes(deptFilter)) return false

      // Payment status filter
      if (paymentStatus !== 'All' && inv.status !== paymentStatus) return false

      // Patient category filter
      if (categoryFilter !== 'All') {
        const patient = patients.find(p => p.uhid === inv.uhid)
        if (patient && patient.patientCategory !== categoryFilter) return false
        if (!patient && categoryFilter !== 'Walk-In') return false
      }

      return true
    })
  }, [invoices, dateRange, customStart, customEnd, searchUhid, searchName, deptFilter, paymentStatus, categoryFilter, patients])

  // ────── KPI Calculations ──────
  const totalRevenue = useMemo(() => filteredInvoices.reduce((sum, inv) => sum + Number(inv.total || 0), 0), [filteredInvoices])
  const totalPaid = useMemo(() => filteredInvoices.reduce((sum, inv) => sum + Number(inv.paid || 0), 0), [filteredInvoices])
  const totalDue = useMemo(() => filteredInvoices.reduce((sum, inv) => sum + Number(inv.balance || 0), 0), [filteredInvoices])
  const totalDiscount = useMemo(() => filteredInvoices.reduce((sum, inv) => sum + Number(inv.discount || 0), 0), [filteredInvoices])
  const totalTax = useMemo(() => filteredInvoices.reduce((sum, inv) => sum + Number(inv.tax || 0), 0), [filteredInvoices])
  
  const paidBills = filteredInvoices.filter(i => i.status === 'Paid').length
  const pendingBills = filteredInvoices.filter(i => i.status === 'Pending' || i.status === 'Draft').length
  const partialBills = filteredInvoices.filter(i => i.status === 'Partially Paid').length

  const avgBillValue = filteredInvoices.length > 0 ? Math.round(totalRevenue / filteredInvoices.length) : 0

  // FOC Detection: isFOC flag OR 100% discount
  const focInvoices = useMemo(() => filteredInvoices.filter(inv => {
    if (inv.isFOC) return true
    const total = Number(inv.total || 0)
    const discount = Number(inv.discount || 0)
    return total > 0 && discount >= total
  }), [filteredInvoices])
  const focAmount = focInvoices.reduce((sum, inv) => sum + Number(inv.total || 0), 0)

  // Today's specific
  const todayInvoices = invoices.filter(inv => {
    const d = parseDate(inv.date || inv.createdAt)
    return d ? isToday(d) : false
  })
  const todayRevenue = todayInvoices.reduce((sum, inv) => sum + Number(inv.paid || 0), 0)

  // Monthly Revenue
  const monthInvoices = invoices.filter(inv => {
    const d = parseDate(inv.date || inv.createdAt)
    return d ? isThisMonth(d) : false
  })
  const monthRevenue = monthInvoices.reduce((sum, inv) => sum + Number(inv.paid || 0), 0)

  // Service Revenue breakdown
  const serviceRevenue = useMemo(() => {
    const map: Record<string, { revenue: number; count: number }> = {}
    filteredInvoices.forEach(inv => {
      const svc = inv.service || 'Uncategorized'
      if (!map[svc]) map[svc] = { revenue: 0, count: 0 }
      map[svc].revenue += Number(inv.paid || 0)
      map[svc].count += 1
    })
    return Object.entries(map).sort((a, b) => b[1].revenue - a[1].revenue)
  }, [filteredInvoices])

  // Monthly trend (last 6 months)
  const monthlyTrend = useMemo(() => {
    const months: { label: string; revenue: number; count: number }[] = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date()
      d.setMonth(d.getMonth() - i)
      const monthLabel = d.toLocaleString('default', { month: 'short', year: '2-digit' })
      const m = d.getMonth()
      const y = d.getFullYear()
      const monthInvs = invoices.filter(inv => {
        const id = parseDate(inv.date || inv.createdAt)
        return id && id.getMonth() === m && id.getFullYear() === y
      })
      months.push({
        label: monthLabel,
        revenue: monthInvs.reduce((s, inv) => s + Number(inv.paid || 0), 0),
        count: monthInvs.length
      })
    }
    return months
  }, [invoices])

  // Payment mode breakdown
  const paymentModes = useMemo(() => {
    const map: Record<string, number> = {}
    filteredInvoices.forEach(inv => {
      const mode = inv.paymentMode || 'Not Specified'
      map[mode] = (map[mode] || 0) + Number(inv.paid || 0)
    })
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [filteredInvoices])

  // Category breakdown
  const categoryBreakdown = useMemo(() => {
    const map: Record<string, { count: number; revenue: number }> = {}
    filteredInvoices.forEach(inv => {
      const patient = patients.find(p => p.uhid === inv.uhid)
      const cat = patient?.patientCategory || 'Walk-In'
      if (!map[cat]) map[cat] = { count: 0, revenue: 0 }
      map[cat].count += 1
      map[cat].revenue += Number(inv.paid || 0)
    })
    return Object.entries(map).sort((a, b) => b[1].revenue - a[1].revenue)
  }, [filteredInvoices, patients])

  // Table columns
  const columns: Column<any>[] = [
    {
      key: 'id', header: 'Invoice #', sortable: true,
      render: (r) => <span className="font-semibold tabular-nums text-blue-600">{r.id}</span>
    },
    {
      key: 'patient', header: 'Patient', sortable: true,
      render: (r) => (
        <div className="flex flex-col">
          <span className="font-medium text-foreground">{r.patient}</span>
          <span className="text-xs text-muted-foreground">{r.uhid || 'N/A'}</span>
        </div>
      )
    },
    { key: 'service', header: 'Service', sortable: true },
    { key: 'date', header: 'Date', sortable: true, render: (r) => <span className="tabular-nums">{r.date}</span> },
    {
      key: 'total', header: 'Total (₹)', sortable: true,
      render: (r) => <span className="font-semibold tabular-nums">₹{Number(r.total || 0).toLocaleString('en-IN')}</span>
    },
    {
      key: 'discount', header: 'Discount (₹)', sortable: true,
      render: (r) => {
        const disc = Number(r.discount || 0)
        const isFoc = disc >= Number(r.total || 1)
        return (
          <div className="flex items-center gap-1">
            <span className="tabular-nums">₹{disc.toLocaleString('en-IN')}</span>
            {isFoc && <Badge className="bg-amber-100 text-amber-800 text-[10px]">FOC</Badge>}
          </div>
        )
      }
    },
    {
      key: 'paid', header: 'Paid (₹)', sortable: true,
      render: (r) => <span className="tabular-nums text-emerald-700 font-medium">₹{Number(r.paid || 0).toLocaleString('en-IN')}</span>
    },
    {
      key: 'balance', header: 'Balance (₹)', sortable: true,
      render: (r) => {
        const bal = Number(r.balance || 0)
        return <span className={`tabular-nums font-medium ${bal > 0 ? 'text-red-600' : 'text-slate-500'}`}>₹{bal.toLocaleString('en-IN')}</span>
      }
    },
    { key: 'paymentMode', header: 'Mode', sortable: true, render: (r) => <span>{r.paymentMode || '—'}</span> },
    {
      key: 'status', header: 'Status',
      render: (r) => <StatusBadge status={r.status} />
    },
  ]

  const maxServiceRev = serviceRevenue.length > 0 ? Math.max(...serviceRevenue.map(([, v]) => v.revenue), 1) : 1
  const maxMonthRev = monthlyTrend.length > 0 ? Math.max(...monthlyTrend.map(m => m.revenue), 1) : 1

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        breadcrumb={['Home', 'Billing', 'Analytics']}
        title="Billing Analytics"
        description="Revenue analysis, FOC tracking, and financial insights for management decision-making."
      />

      {/* ─── Quick Time KPIs ─── */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-6">
        <AnalyticsKPI label="Total Revenue" value={totalRevenue} icon={DollarSign} prefix="₹" color="text-emerald-600" bgColor="bg-emerald-50" />
        <AnalyticsKPI label="Today's Collection" value={todayRevenue} icon={TrendingUp} prefix="₹" color="text-blue-600" bgColor="bg-blue-50" />
        <AnalyticsKPI label="Monthly Revenue" value={monthRevenue} icon={Calendar} prefix="₹" color="text-indigo-600" bgColor="bg-indigo-50" />
        <AnalyticsKPI label="Outstanding Due" value={totalDue} icon={TrendingDown} prefix="₹" color="text-red-600" bgColor="bg-red-50" />
        <AnalyticsKPI label="Total Discount" value={totalDiscount} icon={Percent} prefix="₹" color="text-amber-600" bgColor="bg-amber-50" />
        <AnalyticsKPI label="Total Tax" value={totalTax} icon={Receipt} prefix="₹" color="text-slate-600" bgColor="bg-slate-100" />
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-6">
        <AnalyticsKPI label="Total Bills" value={filteredInvoices.length} icon={FileText} color="text-blue-600" bgColor="bg-blue-50" />
        <AnalyticsKPI label="Paid Bills" value={paidBills} icon={CreditCard} color="text-emerald-600" bgColor="bg-emerald-50" />
        <AnalyticsKPI label="Pending Bills" value={pendingBills} icon={AlertTriangle} color="text-amber-600" bgColor="bg-amber-50" />
        <AnalyticsKPI label="Partial Payments" value={partialBills} icon={Receipt} color="text-orange-600" bgColor="bg-orange-50" />
        <AnalyticsKPI label="FOC Patients" value={focInvoices.length} icon={Gift} prefix="" color="text-rose-600" bgColor="bg-rose-50" />
        <AnalyticsKPI label="Avg Bill Value" value={avgBillValue} icon={BarChart3} prefix="₹" color="text-violet-600" bgColor="bg-violet-50" />
      </div>

      {/* ─── Filters ─── */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2"><Filter className="size-5 text-blue-500" /> Advanced Filters</CardTitle>
              <CardDescription>Filter billing data across multiple dimensions</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
              {showFilters ? <ChevronUp className="size-4 mr-1" /> : <ChevronDown className="size-4 mr-1" />}
              {showFilters ? 'Hide' : 'Show'} Filters
            </Button>
          </div>
        </CardHeader>
        {showFilters && (
          <CardContent>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-500 uppercase">Time Period</Label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="quarter">This Quarter</SelectItem>
                    <SelectItem value="6months">Last 6 Months</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {dateRange === 'custom' && (
                <>
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-slate-500 uppercase">From</Label>
                    <Input type="date" value={customStart} onChange={e => setCustomStart(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-slate-500 uppercase">To</Label>
                    <Input type="date" value={customEnd} onChange={e => setCustomEnd(e.target.value)} />
                  </div>
                </>
              )}

              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-500 uppercase">Search UHID</Label>
                <Input placeholder="e.g. ES2026-..." value={searchUhid} onChange={e => setSearchUhid(e.target.value)} />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-500 uppercase">Patient Name</Label>
                <Input placeholder="Search name..." value={searchName} onChange={e => setSearchName(e.target.value)} />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-500 uppercase">Department</Label>
                <Select value={deptFilter} onValueChange={setDeptFilter}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Departments</SelectItem>
                    {SERVICES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-500 uppercase">Payment Status</Label>
                <Select value={paymentStatus} onValueChange={setPaymentStatus}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Statuses</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Partially Paid">Partially Paid</SelectItem>
                    <SelectItem value="Draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-500 uppercase">Patient Category</Label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Categories</SelectItem>
                    <SelectItem value="Walk-In">Walk-In</SelectItem>
                    <SelectItem value="Insurance">Insurance</SelectItem>
                    <SelectItem value="Corporate">Corporate</SelectItem>
                    <SelectItem value="Health Camp">Health Camp</SelectItem>
                    <SelectItem value="Referral">Referral</SelectItem>
                    <SelectItem value="Existing Patient">Existing Patient</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end mt-4 gap-2">
              <Button variant="outline" size="sm" onClick={() => {
                setDateRange('all'); setCustomStart(''); setCustomEnd(''); setSearchUhid('')
                setSearchName(''); setDeptFilter('All'); setPaymentStatus('All'); setCategoryFilter('All')
              }}>Reset Filters</Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* ─── Charts ─── */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Monthly Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><TrendingUp className="size-5 text-blue-500" /> Monthly Revenue Trend</CardTitle>
            <CardDescription>Revenue collection over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {monthlyTrend.map(m => {
              const pct = Math.round((m.revenue / maxMonthRev) * 100)
              return (
                <div key={m.label} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700">{m.label} <span className="text-slate-400 font-normal">({m.count} bills)</span></span>
                    <span className="text-slate-900">₹{m.revenue.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Service Revenue Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Stethoscope className="size-5 text-emerald-500" /> Service Revenue Distribution</CardTitle>
            <CardDescription>Revenue breakdown by department / service</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {serviceRevenue.length === 0 ? (
              <div className="text-center py-8 text-slate-500">No billing data available for the selected filters.</div>
            ) : serviceRevenue.slice(0, 10).map(([name, data]) => {
              const pct = Math.round((data.revenue / maxServiceRev) * 100)
              return (
                <div key={name} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700">{name} <span className="text-slate-400 font-normal">({data.count} bills)</span></span>
                    <span className="text-slate-900">₹{data.revenue.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* FOC Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Gift className="size-5 text-rose-500" /> FOC Analysis</CardTitle>
            <CardDescription>Free of Cost / 100% discount bills breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            {focInvoices.length === 0 ? (
              <div className="text-center py-8 text-slate-500">No FOC bills found in the selected period.</div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-lg bg-rose-50 border border-rose-200 p-3 text-center">
                    <div className="text-2xl font-bold text-rose-700">{focInvoices.length}</div>
                    <div className="text-xs text-rose-600 font-medium">FOC Bills</div>
                  </div>
                  <div className="rounded-lg bg-rose-50 border border-rose-200 p-3 text-center">
                    <div className="text-2xl font-bold text-rose-700">₹{focAmount.toLocaleString('en-IN')}</div>
                    <div className="text-xs text-rose-600 font-medium">Total FOC Value</div>
                  </div>
                  <div className="rounded-lg bg-rose-50 border border-rose-200 p-3 text-center">
                    <div className="text-2xl font-bold text-rose-700">{filteredInvoices.length > 0 ? ((focInvoices.length / filteredInvoices.length) * 100).toFixed(1) : 0}%</div>
                    <div className="text-xs text-rose-600 font-medium">FOC Rate</div>
                  </div>
                </div>
                <div className="space-y-2">
                  {focInvoices.slice(0, 5).map(inv => (
                    <div key={inv.id} className="flex items-center justify-between p-3 rounded-lg border border-rose-200 bg-rose-50/50">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-800 text-sm">{inv.patient}</span>
                        <span className="text-xs text-slate-500">{inv.id} • {inv.service} • {inv.date}</span>
                      </div>
                      <Badge className="bg-rose-100 text-rose-800 border-none">₹{Number(inv.total || 0).toLocaleString('en-IN')}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Mode & Category */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><CreditCard className="size-5 text-violet-500" /> Payment & Category Insights</CardTitle>
            <CardDescription>Revenue split by payment mode and patient category</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-bold text-slate-800 mb-3 text-sm">Payment Mode Distribution</h4>
              <div className="space-y-2">
                {paymentModes.map(([mode, amount]) => {
                  const maxMode = paymentModes.length > 0 ? Math.max(...paymentModes.map(([, v]) => v), 1) : 1
                  const pct = Math.round((amount / maxMode) * 100)
                  return (
                    <div key={mode} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-700">{mode}</span>
                        <span className="text-slate-900">₹{amount.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                        <div className="bg-gradient-to-r from-violet-500 to-purple-500 h-full rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="border-t pt-4">
              <h4 className="font-bold text-slate-800 mb-3 text-sm">Patient Category Revenue</h4>
              <div className="space-y-2">
                {categoryBreakdown.map(([cat, data]) => (
                  <div key={cat} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-800 text-sm">{cat}</span>
                      <span className="text-xs text-slate-500">{data.count} bills</span>
                    </div>
                    <span className="font-bold text-slate-900 text-sm">₹{data.revenue.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ─── Detailed Billing Table ─── */}
      <Card>
        <CardHeader>
          <CardTitle>Billing Records</CardTitle>
          <CardDescription>Sortable, searchable billing data — {filteredInvoices.length} records</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={filteredInvoices}
            getRowKey={(r) => r.id}
            searchKeys={['id', 'patient', 'uhid', 'service', 'paymentMode']}
            searchPlaceholder="Search invoices..."
          />
        </CardContent>
      </Card>
    </div>
  )
}
