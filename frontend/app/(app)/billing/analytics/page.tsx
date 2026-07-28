'use client'

import { useMemo, useState } from 'react'
import {
  DollarSign, TrendingUp, TrendingDown, Receipt, AlertTriangle,
  Users, CreditCard, FileText, Gift, BarChart3, Filter,
  Download, Calendar, Building2, Shield, Stethoscope, ChevronDown,
  ChevronUp, Percent, Search, Activity, FileSpreadsheet, Printer, X, Zap
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Protect } from '@/components/protect'
import { PageHeader } from '@/components/page-header'
import { DEPARTMENTS, OUR_SERVICES_LIST } from '@/lib/constants'
import { DataTable, type Column } from '@/components/data-table'
import { StatusBadge } from '@/components/status-badge'
import { useHealthcare, type Invoice } from '@/lib/store'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, 
  CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from 'recharts'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#14b8a6']

// ────────────────────────────────────────────────
// Date Helpers
// ────────────────────────────────────────────────
function parseDate(dateStr: string | Date | undefined | null): Date | null {
  if (!dateStr) return null
  const d = new Date(dateStr)
  return isNaN(d.getTime()) ? null : d
}

function getStartOfDay(d: Date) {
  const newD = new Date(d)
  newD.setHours(0,0,0,0)
  return newD
}

function filterByDate(d: Date, filterType: string, customStart?: Date | null, customEnd?: Date | null) {
  if (filterType === 'All') return true
  const today = getStartOfDay(new Date())
  const check = getStartOfDay(d)
  
  if (filterType === 'Today') return check.getTime() === today.getTime()
  if (filterType === 'Yesterday') {
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    return check.getTime() === yesterday.getTime()
  }
  if (filterType === 'This Week') {
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - today.getDay())
    return check >= startOfWeek
  }
  if (filterType === 'This Month') {
    return check.getMonth() === today.getMonth() && check.getFullYear() === today.getFullYear()
  }
  if (filterType === 'Quarter') {
    const currentQ = Math.floor(today.getMonth() / 3)
    const checkQ = Math.floor(check.getMonth() / 3)
    return currentQ === checkQ && check.getFullYear() === today.getFullYear()
  }
  if (filterType === 'Last 6 Months') {
    const sixMonthsAgo = new Date(today)
    sixMonthsAgo.setMonth(today.getMonth() - 6)
    return check >= sixMonthsAgo
  }
  if (filterType === 'Financial Year') {
    // April to March
    const fyStartYear = today.getMonth() >= 3 ? today.getFullYear() : today.getFullYear() - 1
    const fyStart = new Date(fyStartYear, 3, 1) // April 1st
    return check >= fyStart
  }
  if (filterType === 'Custom Range') {
    if (customStart && check < customStart) return false
    if (customEnd && check > customEnd) return false
    return true
  }
  return true
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
            <span className="text-2xl font-black text-slate-900 tracking-tight">{prefix}{typeof value === 'number' ? value.toLocaleString('en-IN') : value}{suffix}</span>
          </div>
          {detail && <span className="text-xs font-medium text-slate-500 mt-1">{detail}</span>}
        </div>
        <div className={`flex items-center justify-center size-10 rounded-xl ${bgColor} ${color}`}>
          <Icon className="size-5" />
        </div>
      </div>
    </div>
  )
}

export default function BillingAnalyticsPage() {
  const { invoices = [] } = useHealthcare()

  // Advanced Filter State
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    dateRange: 'This Month',
    customStart: '',
    customEnd: '',
    patientName: '',
    uhid: '',
    department: 'All',
    doctor: 'All',
    gender: 'All',
    ageGroup: 'All', 
    corporate: 'All',
    insurance: 'All',
    referralType: 'All',
    patientCategory: 'All',
    billStatus: 'All',
    paymentStatus: 'All',
    foc: 'All',
    discount: 'All',
    refund: 'All',
  })

  // Apply filters
  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => {
      const d = parseDate(inv.date || inv.createdAt || '')
      if (!d) return false

      if (!filterByDate(d, filters.dateRange, parseDate(filters.customStart), parseDate(filters.customEnd))) return false

      if (filters.uhid && !(inv.uhid || '').toLowerCase().includes(filters.uhid.toLowerCase())) return false
      
      const patName = inv.patient || ''
      if (filters.patientName && !patName.toLowerCase().includes(filters.patientName.toLowerCase())) return false

      if (filters.department !== 'All' && inv.department !== filters.department) return false
      if (filters.doctor !== 'All' && inv.doctorName !== filters.doctor) return false
      if (filters.corporate !== 'All' && inv.corporateName !== filters.corporate) return false
      if (filters.insurance !== 'All' && inv.insuranceProvider !== filters.insurance) return false
      if (filters.referralType !== 'All' && inv.referralType !== filters.referralType) return false
      if (filters.billStatus !== 'All' && inv.status !== filters.billStatus) return false
      
      if (filters.paymentStatus !== 'All') {
        const bal = Number(inv.balance || 0)
        const paid = Number(inv.paid || 0)
        const isPaid = bal <= 0 && paid > 0
        if (filters.paymentStatus === 'Paid' && !isPaid) return false
        if (filters.paymentStatus === 'Due' && bal <= 0) return false
        if (filters.paymentStatus === 'Partial' && (paid === 0 || bal === 0)) return false
      }

      if (filters.foc !== 'All') {
        if (filters.foc === 'Yes' && !inv.isFOC) return false
        if (filters.foc === 'No' && inv.isFOC) return false
      }

      if (filters.discount !== 'All') {
        const hasDiscount = Number(inv.discount || 0) > 0
        if (filters.discount === 'Yes' && !hasDiscount) return false
        if (filters.discount === 'No' && hasDiscount) return false
      }

      if (filters.refund !== 'All') {
        const hasRefund = Number(inv.refundAmount || 0) > 0
        if (filters.refund === 'Yes' && !hasRefund) return false
        if (filters.refund === 'No' && hasRefund) return false
      }

      // Demographics from patientRef (if available)
      const pGender = inv.patientRef?.gender || 'Unknown'
      const pAge = inv.patientRef?.age || 0
      
      if (filters.gender !== 'All' && pGender !== filters.gender) return false
      
      if (filters.ageGroup !== 'All') {
        if (filters.ageGroup === '0-12' && (pAge > 12)) return false
        if (filters.ageGroup === '13-18' && (pAge < 13 || pAge > 18)) return false
        if (filters.ageGroup === '19-35' && (pAge < 19 || pAge > 35)) return false
        if (filters.ageGroup === '36-50' && (pAge < 36 || pAge > 50)) return false
        if (filters.ageGroup === '51-65' && (pAge < 51 || pAge > 65)) return false
        if (filters.ageGroup === '65+' && (pAge < 66)) return false
      }

      return true
    })
  }, [invoices, filters])

  // Compute Metrics
  const metrics = useMemo(() => {
    let totalGross = 0
    let totalNet = 0
    let totalPaid = 0
    let totalDue = 0
    let totalDiscount = 0
    let totalRefund = 0
    let focCount = 0

    filteredInvoices.forEach(inv => {
      totalGross += Number(inv.subtotal || 0)
      totalNet += Number(inv.total || 0)
      totalPaid += Number(inv.paid || 0)
      totalDue += Number(inv.balance || 0)
      totalDiscount += Number(inv.discount || 0)
      totalRefund += Number(inv.refundAmount || 0)
      if (inv.isFOC) focCount++
    })

    const billsCount = filteredInvoices.length
    const avgBill = billsCount > 0 ? Math.round(totalNet / billsCount) : 0
    
    // Unique patients count
    const uniqueUhids = new Set(filteredInvoices.map(i => i.uhid).filter(Boolean))
    const patientCount = uniqueUhids.size
    const avgPerPatient = patientCount > 0 ? Math.round(totalNet / patientCount) : 0
    const collectionEfficiency = totalNet > 0 ? ((totalPaid / totalNet) * 100).toFixed(1) : '0.0'

    return { totalGross, totalNet, totalPaid, totalDue, totalDiscount, totalRefund, focCount, billsCount, avgBill, avgPerPatient, collectionEfficiency, patientCount }
  }, [filteredInvoices])

  // Chart Data Generators
  const trendData = useMemo(() => {
    const map = new Map<string, number>()
    filteredInvoices.forEach(inv => {
      const d = parseDate(inv.date || inv.createdAt || '')
      if (d) {
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        map.set(key, (map.get(key) || 0) + Number(inv.total || 0))
      }
    })
    return Array.from(map.entries()).sort((a,b) => a[0].localeCompare(b[0])).map(([name, Revenue]) => ({ name, Revenue }))
  }, [filteredInvoices])

  const deptData = useMemo(() => {
    const map = new Map<string, number>()
    filteredInvoices.forEach(inv => {
      const d = inv.department || 'General'
      map.set(d, (map.get(d) || 0) + Number(inv.total || 0))
    })
    return Array.from(map.entries()).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value).slice(0,10)
  }, [filteredInvoices])
  
  const sourceData = useMemo(() => {
    const map = new Map<string, { rev: number, count: number }>()
    filteredInvoices.forEach(inv => {
      const s = inv.referralType || 'Walk-in'
      const cur = map.get(s) || { rev: 0, count: 0 }
      map.set(s, { rev: cur.rev + Number(inv.total || 0), count: cur.count + 1 })
    })
    return Array.from(map.entries()).map(([name, val]) => ({ name, Revenue: val.rev, Patients: val.count }))
  }, [filteredInvoices])

  const handleExportCSV = () => {
    const headers = ['Invoice No', 'Date', 'Patient Name', 'UHID', 'Department', 'Source', 'Total Amount', 'Paid', 'Due', 'Status']
    const csvContent = [
      headers.join(','),
      ...filteredInvoices.map(inv => {
        return [
          inv.id,
          parseDate(inv.date || inv.createdAt || '')?.toLocaleDateString() || '',
          `"${(inv.patient || '').replace(/"/g, '""')}"`,
          inv.uhid || '',
          inv.department || 'General',
          inv.referralType || 'Walk-in',
          inv.total || 0,
          inv.paid || 0,
          inv.balance || 0,
          inv.status || 'Pending'
        ].join(',')
      })
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `billing_analytics_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  const demoGenderData = useMemo(() => {
    const map = new Map<string, number>()
    filteredInvoices.forEach(inv => {
      const g = inv.patientRef?.gender || 'Unknown'
      map.set(g, (map.get(g) || 0) + Number(inv.total || 0))
    })
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }))
  }, [filteredInvoices])

  // Management Insights
  const insights = useMemo(() => {
    if (filteredInvoices.length === 0) return []
    const alerts = []
    
    // Highest Dept
    if (deptData.length > 0) {
      alerts.push(`Top Revenue Department: ${deptData[0].name} (₹${deptData[0].value.toLocaleString('en-IN')})`)
    }
    
    // FOC Warning
    if (metrics.focCount > 0) {
      alerts.push(`${metrics.focCount} Free of Cost (FOC) bills generated in this period.`)
    }
    
    // Outstanding Warning
    if (metrics.totalDue > 0) {
      alerts.push(`₹${metrics.totalDue.toLocaleString('en-IN')} outstanding collections require follow-up.`)
    }

    return alerts
  }, [filteredInvoices, deptData, metrics])

  const columns: Column<Invoice>[] = [
    { key: 'id', header: 'Invoice No.', render: (r) => <span className="font-mono text-xs">{r.id.substring(0,8)}</span> },
    { key: 'date', header: 'Date', render: (r) => <span className="text-xs">{parseDate(r.date || r.createdAt)?.toLocaleDateString()}</span> },
    { key: 'patient', header: 'Patient', render: (r) => (
      <div>
        <div className="font-semibold text-sm">{r.patient || ''}</div>
        <div className="text-xs text-muted-foreground">{r.uhid}</div>
      </div>
    )},
    { key: 'department', header: 'Department', render: (r) => <span className="text-xs">{r.department || 'General'}</span> },
    { key: 'total', header: 'Net Payable', render: (r) => <span className="font-medium text-sm">₹{Number(r.total || 0).toLocaleString()}</span> },
    { key: 'paid', header: 'Paid', render: (r) => <span className="text-sm text-green-600">₹{Number(r.paid || 0).toLocaleString()}</span> },
    { key: 'balance', header: 'Due', render: (r) => <span className="text-sm text-red-600">₹{Number(r.balance || 0).toLocaleString()}</span> },
    { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status || 'Pending'} /> }
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <PageHeader title="Billing Analytics" description="Executive dashboard & financial performance insights." breadcrumb={['Billing', 'Analytics']} />
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className={showFilters ? 'bg-slate-100' : ''}>
            <Filter className="mr-2 h-4 w-4" /> Filters
          </Button>
          <Button variant="outline" onClick={() => window.print()}><Printer className="mr-2 h-4 w-4" /> Print</Button>
          <Button onClick={handleExportCSV}><Download className="mr-2 h-4 w-4" /> Export CSV</Button>
        </div>
      </div>

      {showFilters && (
        <Card className="border-indigo-100 shadow-sm bg-indigo-50/30">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Period</Label>
                <Select value={filters.dateRange} onValueChange={(v) => setFilters({...filters, dateRange: v || ''})}>
                  <SelectTrigger className="bg-white h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['All', 'Today', 'Yesterday', 'This Week', 'This Month', 'Quarter', 'Last 6 Months', 'Financial Year', 'Custom Range'].map(o => (
                      <SelectItem key={o} value={o}>{o}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-1">
                <Label className="text-xs font-semibold">UHID</Label>
                <Input className="h-8 text-xs bg-white" placeholder="Search UHID" value={filters.uhid} onChange={(e) => setFilters({...filters, uhid: e.target.value})} />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Department</Label>
                <Select value={filters.department} onValueChange={(v) => setFilters({...filters, department: v || ''})}>
                  <SelectTrigger className="bg-white h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Departments</SelectItem>
                    {OUR_SERVICES_LIST.map(d => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Source / Referral</Label>
                <Select value={filters.referralType} onValueChange={(v) => setFilters({...filters, referralType: v || ''})}>
                  <SelectTrigger className="bg-white h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Sources</SelectItem>
                    <SelectItem value="Walk-in">Walk-in</SelectItem>
                    <SelectItem value="Doctor Referral">Doctor Referral</SelectItem>
                    <SelectItem value="Corporate Tie-up">Corporate Tie-up</SelectItem>
                    <SelectItem value="Camp / Outreach">Camp / Outreach</SelectItem>
                    <SelectItem value="Insurance">Insurance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Payment Status</Label>
                <Select value={filters.paymentStatus} onValueChange={(v) => setFilters({...filters, paymentStatus: v || ''})}>
                  <SelectTrigger className="bg-white h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Statuses</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Partial">Partial</SelectItem>
                    <SelectItem value="Due">Due</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Age Group</Label>
                <Select value={filters.ageGroup} onValueChange={(v) => setFilters({...filters, ageGroup: v || ''})}>
                  <SelectTrigger className="bg-white h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Ages</SelectItem>
                    <SelectItem value="0-12">0-12 Years</SelectItem>
                    <SelectItem value="13-18">13-18 Years</SelectItem>
                    <SelectItem value="19-35">19-35 Years</SelectItem>
                    <SelectItem value="36-50">36-50 Years</SelectItem>
                    <SelectItem value="51-65">51-65 Years</SelectItem>
                    <SelectItem value="65+">65+ Years</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Discount</Label>
                <Select value={filters.discount} onValueChange={(v) => setFilters({...filters, discount: v || ''})}>
                  <SelectTrigger className="bg-white h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <Button variant="ghost" size="sm" onClick={() => setFilters({ ...filters, uhid: '', patientName: '', department: 'All', paymentStatus: 'All', foc: 'All', dateRange: 'All' })}>
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {insights.length > 0 && (
        <div className="bg-blue-50/80 border border-blue-100 rounded-lg p-3 flex gap-3 items-start">
          <Zap className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900 space-y-1">
            <p className="font-bold">Management Insights</p>
            <ul className="list-disc pl-4 space-y-0.5 opacity-90">
              {insights.map((msg, i) => <li key={i}>{msg}</li>)}
            </ul>
          </div>
        </div>
      )}

      {/* SECTION 1: Executive KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <AnalyticsKPI label="Total Revenue" value={metrics.totalGross} icon={DollarSign} color="text-indigo-600" bgColor="bg-indigo-50" prefix="₹" />
        <AnalyticsKPI label="Net Collected" value={metrics.totalPaid} icon={TrendingUp} color="text-emerald-600" bgColor="bg-emerald-50" prefix="₹" />
        <AnalyticsKPI label="Outstanding Due" value={metrics.totalDue} icon={AlertTriangle} color="text-amber-600" bgColor="bg-amber-50" prefix="₹" />
        <AnalyticsKPI label="Total Bills" value={metrics.billsCount} icon={Receipt} color="text-blue-600" bgColor="bg-blue-50" />
        <AnalyticsKPI label="Avg Bill Value" value={metrics.avgBill} icon={CreditCard} color="text-violet-600" bgColor="bg-violet-50" prefix="₹" />
        
        <AnalyticsKPI label="Avg Rev/Patient" value={metrics.avgPerPatient} icon={Users} color="text-pink-600" bgColor="bg-pink-50" prefix="₹" />
        <AnalyticsKPI label="Total Discount" value={metrics.totalDiscount} icon={Gift} color="text-fuchsia-600" bgColor="bg-fuchsia-50" prefix="₹" />
        <AnalyticsKPI label="Refunds" value={metrics.totalRefund} icon={TrendingDown} color="text-rose-600" bgColor="bg-rose-50" prefix="₹" />
        <AnalyticsKPI label="FOC Patients" value={metrics.focCount} icon={Shield} color="text-cyan-600" bgColor="bg-cyan-50" />
        <AnalyticsKPI label="Collection Efficiency" value={metrics.collectionEfficiency} icon={Percent} color="text-teal-600" bgColor="bg-teal-50" suffix="%" />
      </div>

      {/* SECTION 2: Revenue Analysis */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-md">Monthly Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(val) => `₹${val}`} />
                  <RechartsTooltip formatter={(value: any) => `₹${value.toLocaleString()}`} />
                  <Area type="monotone" dataKey="Revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-md">Department-wise Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptData} layout="vertical" margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} tickFormatter={(v: any) => `₹${v}`} />
                  <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} width={100} />
                  <RechartsTooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(val: any) => [`₹${val}`, 'Revenue']}
                  />
                  <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SECTION 3 & 4: Demographics and Sources */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-md">Revenue by Gender</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={demoGenderData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {demoGenderData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <RechartsTooltip formatter={(v: any) => `₹${v.toLocaleString()}`} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-md">Revenue Source Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sourceData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} tickFormatter={(v: any) => `₹${v}`} />
                  <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <RechartsTooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(val: any) => [`₹${val}`, 'Revenue']}
                  />
                  <Bar yAxisId="left" dataKey="Revenue" fill="#10b981" radius={[4, 4, 0, 0]} barSize={30} />
                  <Line yAxisId="right" type="monotone" dataKey="Patients" stroke="#f59e0b" strokeWidth={3} dot={{r: 4}} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SECTION 9: Detailed Register */}
      <Card className="shadow-sm border-slate-200">
        <CardHeader className="bg-slate-50/50 border-b pb-4 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-md">Detailed Billing Register</CardTitle>
            <CardDescription>Comprehensive analytical data table of all transactions.</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleExportCSV}><Download className="mr-2 h-4 w-4" /> Export All Data</Button>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable columns={columns} data={filteredInvoices} searchKeys={['patient']} getRowKey={(row: Invoice) => row.id} />
        </CardContent>
      </Card>
    </div>
  )
}
