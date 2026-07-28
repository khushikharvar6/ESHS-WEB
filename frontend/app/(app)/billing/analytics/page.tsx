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
  const [periodFilter, setPeriodFilter] = useState('All') // All, Today, This Month, Last 6 Months, This Year
  const [trendFilter, setTrendFilter] = useState('All') // 'All', '0' (Jan) - '11' (Dec)
  const [paymentCategoryFilter, setPaymentCategoryFilter] = useState('All')

  // Secondary Filter states
  const [deptFilter, setDeptFilter] = useState('All')
  const [paymentStatus, setPaymentStatus] = useState('All')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [showFilters, setShowFilters] = useState(false)

  // Apply filters
  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => {
      const d = parseDate(inv.date || inv.createdAt)
      
      // Relative Period filter
      if (periodFilter !== 'All' && d) {
        const today = new Date()
        if (periodFilter === 'Today') {
          if (d.toDateString() !== today.toDateString()) return false
        } else if (periodFilter === 'This Month') {
          if (d.getMonth() !== today.getMonth() || d.getFullYear() !== today.getFullYear()) return false
        } else if (periodFilter === 'This Year') {
          if (d.getFullYear() !== today.getFullYear()) return false
        } else if (periodFilter === 'Last 6 Months') {
          const sixMonthsAgo = new Date()
          sixMonthsAgo.setMonth(today.getMonth() - 6)
          if (d < sixMonthsAgo) return false
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
  }, [invoices, periodFilter, searchUhid, searchName, deptFilter, paymentStatus, categoryFilter, patients])

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

  // Dynamic Trend Data (Yearly or Daily based on filter)
  const chartData = useMemo(() => {
    const data: { label: string; revenue: number; count: number }[] = []
    
    if (trendFilter === 'All') {
      const currentYear = new Date().getFullYear()
      for (let i = 0; i < 12; i++) {
        data.push({ label: new Date(currentYear, i, 1).toLocaleString('default', { month: 'short' }), revenue: 0, count: 0 })
      }
      filteredInvoices.forEach(inv => {
        const d = parseDate(inv.date || inv.createdAt)
        if (d && d.getFullYear() === currentYear) {
          const m = d.getMonth()
          data[m].revenue += Number(inv.paid || 0)
          data[m].count += 1
        }
      })
    } else {
      const month = parseInt(trendFilter)
      const currentYear = new Date().getFullYear()
      const daysInMonth = new Date(currentYear, month + 1, 0).getDate()
      for (let i = 1; i <= daysInMonth; i++) {
        data.push({ label: `${i}`, revenue: 0, count: 0 })
      }
      filteredInvoices.forEach(inv => {
        const d = parseDate(inv.date || inv.createdAt)
        if (d && d.getFullYear() === currentYear && d.getMonth() === month) {
          const day = d.getDate()
          data[day - 1].revenue += Number(inv.paid || 0)
          data[day - 1].count += 1
        }
      })
    }
    
    return data
  }, [filteredInvoices, trendFilter])

  // Payment mode breakdown (affected by local category filter)
  const paymentModes = useMemo(() => {
    const map: Record<string, number> = {}
    const localFiltered = paymentCategoryFilter === 'All' 
      ? filteredInvoices 
      : filteredInvoices.filter(inv => {
          const patient = patients.find(p => p.uhid === inv.uhid)
          const cat = patient?.patientCategory || 'Walk-In'
          return cat === paymentCategoryFilter
        })

    localFiltered.forEach(inv => {
      const mode = inv.paymentMode || 'Not Specified'
      map[mode] = (map[mode] || 0) + Number(inv.paid || 0)
    })
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [filteredInvoices, paymentCategoryFilter, patients])

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

  const maxChartRev = chartData.length > 0 ? Math.max(...chartData.map(m => m.revenue), 1) : 1

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
            <Select value={periodFilter} onValueChange={setPeriodFilter}>
              <SelectTrigger className="border-none shadow-none p-0 h-auto text-lg font-bold text-indigo-900 focus:ring-0 bg-transparent">
                <SelectValue placeholder="Select Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Time</SelectItem>
                <SelectItem value="Today">Today</SelectItem>
                <SelectItem value="This Month">This Month</SelectItem>
                <SelectItem value="Last 6 Months">Last 6 Months</SelectItem>
                <SelectItem value="This Year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="w-full md:w-1/3 flex items-center gap-3 border-l pl-4 border-slate-200">
          <Shield className="h-6 w-6 text-emerald-500" />
          <div className="flex-1">
            <Label className="text-[10px] font-bold text-slate-400 uppercase">Patient Category</Label>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="border-none shadow-none p-0 h-auto text-lg font-bold text-emerald-900 focus:ring-0 bg-transparent">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
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
      </div>

      {/* ─── CORE FINANCIAL KPIs ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnalyticsKPI label="Total Revenue" value={totalRevenue} icon={DollarSign} prefix="₹" color="text-indigo-600" bgColor="bg-indigo-50" />
        <AnalyticsKPI label="Collected Amount" value={totalPaid} icon={TrendingUp} prefix="₹" color="text-emerald-600" bgColor="bg-emerald-50" />
        <AnalyticsKPI label="Due Payment" value={totalDue} icon={TrendingDown} prefix="₹" color="text-red-600" bgColor="bg-red-50" />
        <AnalyticsKPI label="Total Discounts" value={totalDiscount} icon={Percent} prefix="₹" color="text-amber-600" bgColor="bg-amber-50" />
        <AnalyticsKPI label="FOC Bills" value={focInvoices.length} icon={Gift} color="text-rose-600" bgColor="bg-rose-50" />
        <AnalyticsKPI label="Total Bills" value={filteredInvoices.length} icon={Receipt} color="text-blue-600" bgColor="bg-blue-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ─── MONTHLY TREND CHART (LINE CHART) ─── */}
        <Card className="lg:col-span-2 border-slate-200 shadow-sm flex flex-col">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg">
                <BarChart3 className="size-5 text-indigo-500" />
                Revenue Trend
              </CardTitle>
              <CardDescription>Visual tracker of historical collection performance.</CardDescription>
            </div>
            <Select value={trendFilter} onValueChange={setTrendFilter}>
              <SelectTrigger className="w-[160px] bg-white h-9 shadow-sm border-slate-200 text-sm font-semibold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Months</SelectItem>
                <SelectItem value="0">January</SelectItem>
                <SelectItem value="1">February</SelectItem>
                <SelectItem value="2">March</SelectItem>
                <SelectItem value="3">April</SelectItem>
                <SelectItem value="4">May</SelectItem>
                <SelectItem value="5">June</SelectItem>
                <SelectItem value="6">July</SelectItem>
                <SelectItem value="7">August</SelectItem>
                <SelectItem value="8">September</SelectItem>
                <SelectItem value="9">October</SelectItem>
                <SelectItem value="10">November</SelectItem>
                <SelectItem value="11">December</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent className="pt-6 flex-1 flex flex-col justify-end pb-8">
            <div className="h-64 relative w-full pt-4">
              {/* Line Chart SVG */}
              <svg className="absolute inset-0 h-full w-full overflow-visible" preserveAspectRatio="none">
                <polyline 
                  fill="none" 
                  stroke="#6366f1" 
                  strokeWidth="3" 
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={chartData.map((m, i) => {
                    const x = (i / Math.max(chartData.length - 1, 1)) * 100
                    const y = 100 - (m.revenue / maxChartRev) * 100
                    return `${x}%,${y}%`
                  }).join(' ')} 
                />
              </svg>
              {/* Nodes and Labels */}
              <div className="absolute inset-0 flex justify-between items-end h-full">
                {chartData.map((m, i) => {
                  const yPct = 100 - (m.revenue / maxChartRev) * 100
                  // Show fewer labels on X-axis if it's daily mode (too crowded otherwise)
                  const showLabel = trendFilter === 'All' || i % 3 === 0 || i === chartData.length - 1
                  
                  return (
                    <div key={i} className="flex flex-col items-center flex-1 relative group h-full justify-end">
                      {/* Data Point Dot */}
                      <div 
                        className="absolute w-2.5 h-2.5 bg-white border-2 border-indigo-600 rounded-full z-10 transition-transform group-hover:scale-150 group-hover:bg-indigo-600"
                        style={{ top: `calc(${yPct}% - 5px)` }}
                      />
                      {/* Tooltip */}
                      <div 
                        className="absolute opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-20 pointer-events-none"
                        style={{ top: `calc(${yPct}% - 35px)` }}
                      >
                        ₹{m.revenue.toLocaleString('en-IN')} ({m.count} bills)
                      </div>
                      
                      {/* X-axis Label */}
                      {showLabel && (
                        <span className="text-[10px] font-semibold text-slate-500 absolute bottom-[-24px] whitespace-nowrap">
                          {m.label}
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ─── PAYMENT INSIGHTS ─── */}
        <div className="flex flex-col gap-6">
          <Card className="border-slate-200 shadow-sm flex-1 flex flex-col">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-3 flex flex-row justify-between items-center">
              <CardTitle className="text-md">Payment Mode Split</CardTitle>
              <Select value={paymentCategoryFilter} onValueChange={setPaymentCategoryFilter}>
                <SelectTrigger className="w-[130px] h-8 text-xs bg-white shadow-sm">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
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

            </div>

            <div className="flex justify-end mt-4 gap-2">
              <Button variant="outline" size="sm" onClick={() => {
                setPeriodFilter('All'); setSearchUhid('')
                setSearchName(''); setDeptFilter('All'); setPaymentStatus('All'); setCategoryFilter('All')
              }}>Reset Filters</Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* ─── Charts ─── */}
      <div className="grid gap-6 lg:grid-cols-2">
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
                    <div className="text-2xl font-bold text-rose-700">₹{focInvoices.reduce((sum, inv) => sum + Number(inv.total || 0), 0).toLocaleString('en-IN')}</div>
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
