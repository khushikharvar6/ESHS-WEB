'use client'

import { useMemo, useState } from 'react'
import {
  DollarSign, TrendingUp, TrendingDown, Receipt, AlertTriangle,
  Users, CreditCard, FileText, Gift, BarChart3, Filter,
  Download, Calendar, Building2, Shield, Stethoscope, ChevronDown,
  ChevronUp, Percent, Search
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

// ────────────────────────────────────────────────
// KPI Card
// ────────────────────────────────────────────────
function AnalyticsKPI({ label, value, icon: Icon, color = 'text-blue-600', bgColor = 'bg-blue-50', prefix = '', suffix = '', detail = '' }: {
  label: string; value: string | number; icon: any; color?: string; bgColor?: string; prefix?: string; suffix?: string; detail?: string
}) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{label}</span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-slate-900 tracking-tight">{prefix}{typeof value === 'number' ? value.toLocaleString('en-IN') : value}{suffix}</span>
          </div>
          {detail && <span className="text-xs font-medium text-slate-500 mt-1">{detail}</span>}
        </div>
        <div className={`flex items-center justify-center size-12 rounded-xl ${bgColor} ${color}`}>
          <Icon className="size-6" />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-20 transition-opacity" style={{ color: 'inherit' }} />
    </div>
  )
}

export default function BillingAnalyticsPage() {
  const { invoices, patients } = useHealthcare()

  // Primary Search States
  const [searchUhid, setSearchUhid] = useState('')
  const [searchName, setSearchName] = useState('')
  const [monthFilter, setMonthFilter] = useState('All')

  // Secondary Filter states
  const [deptFilter, setDeptFilter] = useState('All')
  const [paymentStatus, setPaymentStatus] = useState('All')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [showFilters, setShowFilters] = useState(false)

  // Generate available months for filtering based on existing invoice data
  const availableMonths = useMemo(() => {
    const months = new Set<string>()
    invoices.forEach(inv => {
      const d = parseDate(inv.date || inv.createdAt)
      if (d) {
        months.add(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`)
      }
    })
    return Array.from(months).sort().reverse()
  }, [invoices])

  const formatMonth = (yyyyMm: string) => {
    if (yyyyMm === 'All') return 'All Time'
    const [y, m] = yyyMm.split('-')
    const d = new Date(parseInt(y), parseInt(m) - 1, 1)
    return d.toLocaleString('default', { month: 'long', year: 'numeric' })
  }

  // Apply filters
  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => {
      const d = parseDate(inv.date || inv.createdAt)
      
      // Monthly filter
      if (monthFilter !== 'All' && d) {
        const invMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        if (invMonth !== monthFilter) return false
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
  }, [invoices, monthFilter, searchUhid, searchName, deptFilter, paymentStatus, categoryFilter, patients])

  // ────── KPI Calculations ──────
  const totalRevenue = useMemo(() => filteredInvoices.reduce((sum, inv) => sum + Number(inv.total || 0), 0), [filteredInvoices])
  const totalPaid = useMemo(() => filteredInvoices.reduce((sum, inv) => sum + Number(inv.paid || 0), 0), [filteredInvoices])
  const totalDue = useMemo(() => filteredInvoices.reduce((sum, inv) => sum + Number(inv.balance || 0), 0), [filteredInvoices])
  const totalDiscount = useMemo(() => filteredInvoices.reduce((sum, inv) => sum + Number(inv.discount || 0), 0), [filteredInvoices])
  
  // FOC Detection: isFOC flag OR 100% discount
  const focInvoices = useMemo(() => filteredInvoices.filter(inv => {
    if (inv.isFOC) return true
    const total = Number(inv.total || 0)
    const discount = Number(inv.discount || 0)
    return total > 0 && discount >= total
  }), [filteredInvoices])

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
      const monthLabel = d.toLocaleString('default', { month: 'short' })
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
      key: 'paid', header: 'Paid (₹)', sortable: true,
      render: (r) => <span className="tabular-nums text-emerald-700 font-medium">₹{Number(r.paid || 0).toLocaleString('en-IN')}</span>
    },
    {
      key: 'balance', header: 'Balance (₹)', sortable: true,
      render: (r) => {
        const bal = Number(r.balance || 0)
        return <span className={`tabular-nums font-bold ${bal > 0 ? 'text-red-600' : 'text-slate-500'}`}>₹{bal.toLocaleString('en-IN')}</span>
      }
    },
    {
      key: 'status', header: 'Status',
      render: (r) => <StatusBadge status={r.status} />
    },
  ]

  const maxServiceRev = serviceRevenue.length > 0 ? Math.max(...serviceRevenue.map(([, v]) => v.revenue), 1) : 1
  const maxMonthRev = monthlyTrend.length > 0 ? Math.max(...monthlyTrend.map(m => m.revenue), 1) : 1

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto w-full pb-10">
      <PageHeader
        breadcrumb={['Home', 'Billing', 'Management Analytics']}
        title="Revenue & Analytics Engine"
        description="Deep dive into financial performance, operational metrics, and revenue bottlenecks."
      />

      {/* ─── GLOBAL ANALYST SEARCH & FILTER BAR ─── */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border border-slate-200 p-4 rounded-2xl shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex w-full md:w-2/3 gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
            <Input 
              placeholder="Search by UHID..." 
              className="pl-10 h-12 text-lg rounded-xl border-slate-300 shadow-sm"
              value={searchUhid}
              onChange={e => setSearchUhid(e.target.value)}
            />
          </div>
          <div className="relative flex-1">
            <Users className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
            <Input 
              placeholder="Search by Patient Name..." 
              className="pl-10 h-12 text-lg rounded-xl border-slate-300 shadow-sm"
              value={searchName}
              onChange={e => setSearchName(e.target.value)}
            />
          </div>
        </div>
        
        <div className="w-full md:w-1/3 flex items-center gap-3 border-l pl-4 border-slate-200">
          <Calendar className="h-6 w-6 text-indigo-500" />
          <div className="flex-1">
            <Label className="text-[10px] font-bold text-slate-400 uppercase">Analysis Period</Label>
            <Select value={monthFilter} onValueChange={setMonthFilter}>
              <SelectTrigger className="border-none shadow-none p-0 h-auto text-lg font-bold text-indigo-900 focus:ring-0 bg-transparent">
                <SelectValue placeholder="Select Month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Time</SelectItem>
                {availableMonths.map(m => (
                  <SelectItem key={m} value={m}>{formatMonth(m)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* ─── CORE FINANCIAL KPIs ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnalyticsKPI label="Total Accrued Revenue" value={totalRevenue} icon={DollarSign} prefix="₹" color="text-indigo-600" bgColor="bg-indigo-50" detail={`${filteredInvoices.length} Total Bills Generated`} />
        <AnalyticsKPI label="Realized Collection" value={totalPaid} icon={TrendingUp} prefix="₹" color="text-emerald-600" bgColor="bg-emerald-50" detail={`₹${totalRevenue - totalPaid} left to collect`} />
        <AnalyticsKPI label="Outstanding AR (Balances)" value={totalDue} icon={TrendingDown} prefix="₹" color="text-red-600" bgColor="bg-red-50" detail={`${filteredInvoices.filter(i => Number(i.balance)>0).length} Pending Invoices`} />
        <AnalyticsKPI label="Total Discounts & FOC Loss" value={totalDiscount} icon={Gift} prefix="₹" color="text-amber-600" bgColor="bg-amber-50" detail={`${focInvoices.length} FOC Services Given`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ─── MONTHLY TREND CHART (6 MONTHS) ─── */}
        <Card className="lg:col-span-2 border-slate-200 shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="size-5 text-indigo-500" />
              6-Month Revenue Trend
            </CardTitle>
            <CardDescription>Visual tracker of historical collection performance.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-64 flex items-end justify-between gap-2 px-2">
              {monthlyTrend.map((m, i) => {
                const pct = Math.max((m.revenue / maxMonthRev) * 100, 5) // min 5% for visibility
                return (
                  <div key={i} className="flex flex-col items-center gap-2 flex-1 group">
                    <div className="w-full flex justify-center h-48 items-end relative">
                      {/* Tooltip */}
                      <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none z-10">
                        ₹{m.revenue.toLocaleString('en-IN')} ({m.count} bills)
                      </div>
                      <div 
                        className="w-16 bg-gradient-to-t from-indigo-600 to-blue-400 rounded-t-md transition-all duration-700 ease-out group-hover:from-indigo-500 group-hover:to-blue-300" 
                        style={{ height: `${pct}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-slate-600">{m.label}</span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* ─── CATEGORY & PAYMENT INSIGHTS ─── */}
        <div className="flex flex-col gap-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-3">
              <CardTitle className="text-md">Revenue by Patient Category</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              {categoryBreakdown.map(([cat, data]) => (
                <div key={cat} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-100">
                      {cat === 'Walk-In' ? <Users className="size-4 text-slate-600"/> : 
                       cat === 'Corporate' ? <Building2 className="size-4 text-indigo-600"/> : 
                       <Shield className="size-4 text-emerald-600"/>}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-700">{cat}</div>
                      <div className="text-[11px] text-slate-500">{data.count} Patients</div>
                    </div>
                  </div>
                  <div className="font-bold text-slate-900">₹{data.revenue.toLocaleString('en-IN')}</div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm flex-1">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-3">
              <CardTitle className="text-md">Payment Mode Split</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              {paymentModes.map(([mode, amt]) => {
                const total = totalPaid || 1
                const pct = Math.round((amt / total) * 100)
                return (
                  <div key={mode} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-700">{mode}</span>
                      <span className="text-slate-900">{pct}% (₹{amt.toLocaleString('en-IN')})</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ─── DEPARTMENT SERVICE REVENUE DISTRIBUTION ─── */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Stethoscope className="size-5 text-blue-500" />
            Department / Service Revenue Distribution
          </CardTitle>
          <CardDescription>Horizontal tracking of service performance</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          {serviceRevenue.map(([name, val]) => {
            const pct = Math.round((val.revenue / maxServiceRev) * 100)
            return (
              <div key={name} className="space-y-2 group">
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-sm font-bold text-slate-700">{name}</div>
                    <div className="text-[11px] text-slate-500">{val.count} procedures billed</div>
                  </div>
                  <span className="text-sm font-black text-slate-900">₹{val.revenue.toLocaleString('en-IN')}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full transition-all duration-700 group-hover:opacity-80" 
                    style={{ width: `${pct}%` }} 
                  />
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* ─── SECONDARY FILTERS & DETAILED DATA TABLE ─── */}
      <Card className="border-slate-200 shadow-sm mt-4">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Detailed Invoice Register</CardTitle>
              <CardDescription>Showing {filteredInvoices.length} matching invoices</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="size-4 mr-2" />
              {showFilters ? 'Hide Advanced Filters' : 'More Filters'}
            </Button>
          </div>
        </CardHeader>
        
        {showFilters && (
          <CardContent className="pt-4 border-b border-slate-100 bg-slate-50/30">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-500 uppercase">Department</Label>
                <Select value={deptFilter} onValueChange={setDeptFilter}>
                  <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Departments</SelectItem>
                    {SERVICES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-500 uppercase">Payment Status</Label>
                <Select value={paymentStatus} onValueChange={setPaymentStatus}>
                  <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
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
                  <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
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
