'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  MessageSquare,
  Star,
  ThumbsUp,
  TrendingUp,
  Printer,
  Search,
  UserRound,
  X,
  Upload,
  Download,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
} from 'lucide-react'

import { PageHeader } from '@/components/page-header'
import { Protect } from '@/components/protect'
import { KpiCard } from '@/components/kpi-card'
import { StarRating } from '@/components/star-rating'
import { FeedbackPrintForm } from '@/components/feedback/feedback-print-form'
import { FeedbackReportPrint } from '@/components/feedback/feedback-report-print'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { feedbacks } from '@/lib/mock-data'
import { useHealthcare, type Patient } from '@/lib/store'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const FEEDBACK_SECTIONS = [
  'Home Healthcare Services',
  'Doctor Consultation',
  'Pathology',
  'Radiology',
  'Cardiology',
  'Pulmonology',
  'Ophthalmology Services',
  'Physiotherapy Services',
  'Pharmacy Services',
  'Health Check-up Package',
  'Day Care Services',
  'IPD (Inpatient)'
]

export default function FeedbackPage() {
  const { patients, consultationsFor } = useHealthcare()
  const [dbFeedbacks, setDbFeedbacks] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/feedback')
      .then(res => res.json())
      .then(data => setDbFeedbacks(data))
      .catch(console.error)
  }, [])

  // Print-form builder state
  const [pickerOpen, setPickerOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [patient, setPatient] = useState<Patient | null>(null)
  const [selectedServices, setSelectedServices] = useState<string[]>([])

  // CSV Import state
  const [imported, setImported] = useState<any[]>([])
  const [showReportPrint, setShowReportPrint] = useState(false)

  // Detailed Feedback Modal state
  const [selectedFeedback, setSelectedFeedback] = useState<any | null>(null)

  // Filter & Pagination state
  const [serviceFilter, setServiceFilter] = useState<string>('All Services')
  const [timeFilter, setTimeFilter] = useState<string>('All Time')
  const [ratingFilter, setRatingFilter] = useState<string>('All Ratings')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const ITEMS_PER_PAGE = 10

  // Combine default mock feedbacks with imported ones and DB feedbacks
  const allFeedbacks = useMemo(() => {
    return [
      ...dbFeedbacks.map((f) => ({
        id: f.id,
        uhid: f.uhid || '',
        patient: f.patientName || 'Unknown',
        service: f.service || 'General',
        rating: Number(f.overallRating || 5),
        comments: (f.positiveComments || '') + ' ' + (f.negativeComments || ''),
        date: new Date(f.createdAt).toLocaleDateString('en-GB'),
        rawDate: f.createdAt ? new Date(f.createdAt) : new Date(),
        ratings: f.ratings || [],
        heardAbout: f.heardAbout || '',
        referenceBy: f.referenceBy || '',
        serviceAvailed: f.serviceAvailed || '',
        staffAppreciated: f.staffAppreciated || '',
        positiveComments: f.positiveComments || '',
        negativeComments: f.negativeComments || '',
      })),
      ...feedbacks.map((f, idx) => ({ 
        ...f, 
        id: `mock-${idx}`,
        uhid: '',
        rawDate: new Date(),
        ratings: [],
        heardAbout: '',
        referenceBy: '',
        serviceAvailed: '',
        staffAppreciated: '',
        positiveComments: '',
        negativeComments: ''
      })),
      ...imported.map((f, idx) => ({
        id: `import-${idx}`,
        uhid: '',
        patient: f.patient || 'Imported Patient',
        service: f.service || 'General',
        rating: Number(f.rating ?? 5),
        comments: f.comments || '',
        date: f.date || new Date().toLocaleDateString('en-GB'),
        rawDate: new Date(),
        ratings: [],
        heardAbout: '',
        referenceBy: '',
        serviceAvailed: '',
        staffAppreciated: '',
        positiveComments: '',
        negativeComments: ''
      })),
    ]
  }, [imported, dbFeedbacks])

  const filteredFeedbacks = useMemo(() => {
    let result = allFeedbacks

    if (timeFilter !== 'All Time') {
      const now = new Date()
      result = result.filter(f => {
        const d = f.rawDate
        const diffMs = now.getTime() - d.getTime()
        const diffDays = diffMs / (1000 * 60 * 60 * 24)
        if (timeFilter === 'Today') return diffDays < 1
        if (timeFilter === 'This Week') return diffDays < 7
        if (timeFilter === 'This Month') return diffDays < 30
        return true
      })
    }

    if (serviceFilter !== 'All Services') {
      result = result.filter(f => {
        const s = f.service || 'General'
        return s.includes(serviceFilter)
      })
    }

    if (ratingFilter !== 'All Ratings') {
      result = result.filter(f => {
        if (ratingFilter === '5 Stars Only') return f.rating === 5
        if (ratingFilter === '4 Stars Only') return f.rating === 4
        if (ratingFilter === 'Negative (1-3 Stars)') return f.rating <= 3
        return true
      })
    }

    if (searchQuery.trim() !== '') {
      result = result.filter(f => 
        f.patient.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return result
  }, [allFeedbacks, serviceFilter, timeFilter, ratingFilter, searchQuery])

  // Recalculate KPIs based on filtered list so dashboard reflects filters
  const total = filteredFeedbacks.length
  const avg = total ? filteredFeedbacks.reduce((s, f) => s + f.rating, 0) / total : 0
  const promoters = filteredFeedbacks.filter((f) => f.rating >= 4).length
  const satisfaction = total ? Math.round((promoters / total) * 100) : 0

  const distribution = [5, 4, 3, 2, 1].map((star) => {
    const count = filteredFeedbacks.filter((f) => f.rating === star).length
    return { star, count, pct: total ? Math.round((count / total) * 100) : 0 }
  })

  // Group by department/service and calculate satisfaction level (rating >= 4)
  const departmentSatisfaction = useMemo(() => {
    const groups: Record<string, { total: number; positive: number }> = {}
    filteredFeedbacks.forEach(f => {
      const dept = f.service || 'General'
      if (!groups[dept]) groups[dept] = { total: 0, positive: 0 }
      groups[dept].total += 1
      if (f.rating >= 4) groups[dept].positive += 1
    })
    return Object.entries(groups).map(([dept, data]) => {
      const sat = Math.round((data.positive / data.total) * 100)
      return { dept, count: data.total, sat }
    }).sort((a, b) => b.count - a.count)
  }, [filteredFeedbacks])

  // New Analytics: Marketing Source
  const heardAboutStats = useMemo(() => {
    const counts: Record<string, number> = {}
    filteredFeedbacks.forEach(f => {
      if (f.heardAbout) {
        counts[f.heardAbout] = (counts[f.heardAbout] || 0) + 1
      }
    })
    return Object.entries(counts)
      .map(([source, count]) => ({ source, count, pct: total ? Math.round((count / total) * 100) : 0 }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5) // Top 5
  }, [filteredFeedbacks, total])

  // New Analytics: Top Staff
  const topStaffStats = useMemo(() => {
    const counts: Record<string, number> = {}
    filteredFeedbacks.forEach(f => {
      if (f.staffAppreciated) {
        // Staff names might be comma separated
        const staffList = f.staffAppreciated.split(',').map((s: string) => s.trim()).filter(Boolean)
        staffList.forEach((s: string) => {
          counts[s] = (counts[s] || 0) + 1
        })
      }
    })
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5) // Top 5
  }, [filteredFeedbacks])

  // Good vs Bad Remarks counts
  const sentimentStats = useMemo(() => {
    let goodCount = 0
    let badCount = 0
    const goodWords = ['good', 'great', 'excellent', 'satisfied', 'nice', 'happy', 'best', 'wonderful', 'awesome', 'courteous', 'clean', 'professional', 'helpful']
    const badWords = ['bad', 'slow', 'poor', 'waiting', 'wait', 'rude', 'dirty', 'expensive', 'unsatisfied', 'delayed', 'noise', 'unhelpful']
    
    allFeedbacks.forEach(f => {
      const comment = (f.comments || '').toLowerCase()
      const hasGood = goodWords.some(w => comment.includes(w))
      const hasBad = badWords.some(w => comment.includes(w))
      
      if (hasGood || f.rating >= 4) goodCount++
      if (hasBad || f.rating <= 2) badCount++
    })
    return { goodCount, badCount }
  }, [allFeedbacks])

  // CSV Importer
  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      if (!text) return
      
      try {
        const lines = text.split('\n')
        const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''))
        const parsed: any[] = []
        
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim()
          if (!line) continue
          const values = line.split(',').map(v => v.trim().replace(/^["']|["']$/g, ''))
          const row: any = {}
          headers.forEach((header, index) => {
            row[header] = values[index]
          })
          
          const mapped = {
            patient: row.patient || row.Name || row['Patient Name'] || 'Patient',
            service: row.service || row.Service || row['Service Availed'] || 'General',
            rating: Number(row.rating || row.Rating || row['Overall Rating'] || 5),
            comments: row.comments || row.Comments || row.Remarks || row['Suggestions'] || '',
            date: row.date || row.Date || new Date().toLocaleDateString('en-GB')
          }
          parsed.push(mapped)
        }
        
        setImported(prev => [...prev, ...parsed])
        toast.success(`Successfully imported ${parsed.length} feedback records!`)
      } catch (err) {
        toast.error('Failed to parse CSV file. Please check column formats.')
      }
    }
    reader.readAsText(file)
  }

  // Analytics Report Downloader
  const handleDownloadReport = () => {
    const reportHeaders = ['Feedback Summary Report', 'Date: ' + new Date().toLocaleDateString('en-GB')]
    const reportData = [
      '',
      '--- OVERALL STATS ---',
      `Total Responses: ${total}`,
      `Average Rating: ${avg.toFixed(2)} Stars`,
      `Overall Satisfaction Level: ${satisfaction}%`,
      `Promoters: ${promoters}`,
      '',
      '--- REMARKS SENTIMENT ANALYSIS ---',
      `Positive/Good Remarks Count: ${sentimentStats.goodCount}`,
      `Negative/Bad Remarks Count: ${sentimentStats.badCount}`,
      '',
      '--- DEPARTMENT/SERVICE WISE SATISFACTION ---',
      ...departmentSatisfaction.map(d => `- ${d.dept}: ${d.sat}% satisfaction (${d.count} responses)`),
      '',
      '--- DETAILED RESPONSES ---',
      'Patient Name,Department/Service,Rating,Comments,Date',
      ...allFeedbacks.map(f => `"${f.patient}","${f.service}",${f.rating},"${f.comments.replace(/"/g, '""')}","${f.date}"`)
    ]
    
    const blob = new Blob([reportData.join('\n')], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `feedback_analytics_report_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('Analytics Report downloaded successfully!')
  }

  // Deep-links from Quick Actions / Billing share modal.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const uhid = params.get('uhid')
    if (uhid) {
      const p = patients.find((x) => x.uhid === uhid)
      if (p) selectPatient(p)
    } else if (params.get('pick')) {
      setPickerOpen(true)
    }
  }, [patients])

  /** Pre-select the services the patient actually availed (registration + consultations). */
  function selectPatient(p: Patient) {
    const fromConsults = consultationsFor(p.uhid).map((c) => c.service)
    const rawServices = Array.from(new Set([p.service, ...fromConsults])).filter(Boolean) as string[]
    
    const mappedServices = rawServices.map(s => {
      if (s.includes('Home')) return 'Home Healthcare Services'
      if (s.includes('Ophthalmology')) return 'Ophthalmology Services'
      if (s.includes('Physiotherapy')) return 'Physiotherapy Services'
      if (s.includes('Pharmacy')) return 'Pharmacy Services'
      if (s.includes('Package') || s.includes('Health Check')) return 'Health Check-up Package'
      if (s.includes('Day Care')) return 'Day Care Services'
      if (s.includes('IPD')) return 'IPD (Inpatient)'
      return s
    }).filter(s => FEEDBACK_SECTIONS.includes(s))

    setPatient(p)
    setSelectedServices(mappedServices)
    setPickerOpen(false)
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return patients
    return patients.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.uhid.toLowerCase().includes(q) ||
        p.phone.includes(q),
    )
  }, [patients, query])

  function toggleService(s: string) {
    setSelectedServices((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    )
  }

  // ---- Print report view ----
  if (showReportPrint) {
    return (
      <div className="flex flex-col gap-6">
        <div className="print:hidden">
          <PageHeader
            breadcrumb={['Home', 'Feedback', 'Analytics Report']}
            title="Feedback Analytics Report"
            description="Preview and print the patient feedback experience report as PDF."
            action={
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowReportPrint(false)}>
                  <X data-icon="inline-start" />
                  Close Preview
                </Button>
                <Protect module="FEEDBACK" action="CREATE">
                  <Button onClick={() => window.print()}>
                    <Printer data-icon="inline-start" />
                    Print / Save PDF
                  </Button>
                </Protect>
              </div>
            }
          />
        </div>

        <div className="rounded-lg bg-muted/40 p-4 print:bg-transparent print:p-0">
          <FeedbackReportPrint
            total={total}
            avg={avg}
            satisfaction={satisfaction}
            promoters={promoters}
            sentimentStats={sentimentStats}
            departmentSatisfaction={departmentSatisfaction}
            allFeedbacks={allFeedbacks}
          />
        </div>
      </div>
    )
  }

  // ---- Print form builder view ----
  if (patient) {
    return (
      <div className="flex flex-col gap-6">
        {/* Controls (hidden while printing) */}
        <div className="print:hidden">
          <PageHeader
            breadcrumb={['Home', 'Feedback', 'Print Form']}
            title="Feedback Form"
            description="Auto-filled patient details with blank questions for the availed services."
            action={
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={() => setPatient(null)}>
                  <X data-icon="inline-start" />
                  Close
                </Button>
                <Button variant="outline" onClick={() => setPickerOpen(true)}>
                  <UserRound data-icon="inline-start" />
                  Change Patient
                </Button>
                <Protect module="FEEDBACK" action="CREATE">
                  <Button onClick={() => window.print()}>
                    <Printer data-icon="inline-start" />
                    Print Form
                  </Button>
                  <Button variant="secondary" onClick={() => {
                    const servicesQuery = selectedServices.length > 0 ? `?services=${encodeURIComponent(selectedServices.join(','))}` : ''
                    const link = `https://eshs-web.vercel.app/f/${patient.uhid}${servicesQuery}`
                    navigator.clipboard.writeText(link)
                    toast.success('Feedback link copied!')
                  }}>
                    Copy Link
                  </Button>
                  <Button 
                    className="bg-[#25D366] hover:bg-[#1da851] text-white flex items-center gap-2"
                    onClick={() => {
                      const servicesQuery = selectedServices.length > 0 ? `?services=${encodeURIComponent(selectedServices.join(','))}` : ''
                      const link = `https://eshs-web.vercel.app/f/${patient.uhid}${servicesQuery}`
                      const text = encodeURIComponent(`Dear ${patient.name || 'Patient'}, thank you for visiting ES Healthcare Centre. We hope you had a great experience! Please take 1 minute to fill out your feedback form here: ${link}`)
                      window.open(`https://wa.me/?text=${text}`, 'whatsapp_web')
                    }}
                  >
                    <MessageCircle className="w-4 h-4" />
                    Share on WhatsApp
                  </Button>
                </Protect>
              </div>
            }
          />

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Sections to include</CardTitle>
              <CardDescription>
                Common sections are always printed. Toggle the services this
                patient availed to include their sections.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {FEEDBACK_SECTIONS.map((s) => {
                const active = selectedServices.includes(s)
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleService(s)}
                    className={cn(
                      'rounded-full border px-3 py-1.5 text-sm transition-colors',
                      active
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-card text-muted-foreground hover:bg-accent',
                    )}
                    aria-pressed={active}
                  >
                    {s}
                  </button>
                )
              })}
            </CardContent>
          </Card>
        </div>

        {/* A4 preview / print target */}
        <div className="rounded-lg bg-muted/40 p-4 print:bg-transparent print:p-0">
          <FeedbackPrintForm patient={patient} services={selectedServices} />
        </div>

        <PatientPicker
          open={pickerOpen}
          onOpenChange={setPickerOpen}
          query={query}
          onQuery={setQuery}
          patients={filtered}
          onPick={selectPatient}
        />
      </div>
    )
  }

  // ---- Analytics dashboard view ----
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        breadcrumb={['Home', 'Feedback']}
        title="Patient Feedback"
        description="Monitor patient satisfaction across services and print feedback forms."
        action={
          <Protect module="FEEDBACK" action="CREATE">
            <Button onClick={() => setPickerOpen(true)}>
              <Printer data-icon="inline-start" />
              Print / Share Form
            </Button>
          </Protect>
        }
      />

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Average Rating"
          value={avg.toFixed(1)}
          icon={Star}
          accent="warning"
        />
        <KpiCard
          label="Responses"
          value={total}
          icon={MessageSquare}
          accent="primary"
        />
        <KpiCard
          label="Satisfaction"
          value={`${satisfaction}%`}
          icon={ThumbsUp}
          accent="green"
          trend="+4.2%"
          trendDirection="up"
        />
        <KpiCard
          label="Positive Reviews"
          value={promoters}
          icon={TrendingUp}
          accent="teal"
        />
      </div>

      {/* New Analytics Charts Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Rating Distribution */}
        <Card className="lg:col-span-1 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border-slate-200/60">
          <CardHeader>
            <CardTitle>Rating Distribution</CardTitle>
            <CardDescription>Breakdown of all responses</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {distribution.map((d) => (
              <div key={d.star} className="flex items-center gap-3">
                <span className="flex w-10 items-center gap-1 text-sm font-medium tabular-nums text-foreground">
                  {d.star}
                  <Star className="size-3.5 fill-warning text-warning" />
                </span>
                <Progress value={d.pct} className="h-2 flex-1" />
                <span className="w-8 text-right text-sm tabular-nums text-muted-foreground">
                  {d.count}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Marketing Source (Heard About) */}
        <Card className="lg:col-span-1 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border-slate-200/60">
          <CardHeader>
            <CardTitle>Marketing Source</CardTitle>
            <CardDescription>How patients heard about us</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {heardAboutStats.length === 0 ? (
              <div className="text-sm text-slate-500 py-4 text-center">No data available</div>
            ) : (
              heardAboutStats.map((s, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-700 truncate max-w-[150px] capitalize">{s.source}</span>
                    <span className="text-slate-500">{s.pct}% ({s.count})</span>
                  </div>
                  <Progress value={s.pct} className="h-1.5 [&>div]:bg-blue-500" />
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Top Appreciated Staff */}
        <Card className="lg:col-span-1 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border-slate-200/60">
          <CardHeader>
            <CardTitle>Top Appreciated Staff</CardTitle>
            <CardDescription>Most mentioned by patients</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {topStaffStats.length === 0 ? (
              <div className="text-sm text-slate-500 py-4 text-center">No data available</div>
            ) : (
              topStaffStats.map((s, i) => (
                <div key={i} className="flex items-center gap-3 bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-teal-100 text-teal-700 text-xs font-bold">
                    #{i + 1}
                  </div>
                  <div className="flex-1 font-medium text-sm text-slate-800 capitalize truncate">
                    {s.name}
                  </div>
                  <div className="text-xs font-semibold bg-white border border-slate-200 px-2 py-0.5 rounded-full text-slate-600">
                    {s.count} mentions
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Report Integration & Department Satisfaction Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Protect module="FEEDBACK" action="FULL">
          <Card className="lg:col-span-1 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border-slate-200/60">
            <CardHeader>
              <CardTitle>Excel / CSV Feedback</CardTitle>
              <CardDescription>Import feedback file to process results and download report</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-500 uppercase">1. Import csv feed</label>
                <div className="relative border-2 border-dashed border-slate-200 rounded p-4 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    accept=".csv,.txt"
                    onChange={handleImportCSV}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Upload className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                  <span className="text-xs text-slate-600 block font-medium">Click to select CSV File</span>
                </div>
              </div>
              
              <div className="border-t border-slate-100 pt-3">
                <span className="text-xs font-semibold text-slate-500 uppercase block mb-2">2. Sentiment remarks</span>
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl p-3 border border-green-200/50 shadow-sm transition-transform hover:scale-105">
                    <span className="text-xs text-green-700 font-medium block">Good Remarks</span>
                    <span className="text-xl font-bold text-green-800">{sentimentStats.goodCount}</span>
                  </div>
                  <div className="bg-gradient-to-br from-red-50 to-red-100/50 rounded-xl p-3 border border-red-200/50 shadow-sm transition-transform hover:scale-105">
                    <span className="text-xs text-red-700 font-medium block">Bad Remarks</span>
                    <span className="text-xl font-bold text-red-800">{sentimentStats.badCount}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3 space-y-2">
                <span className="text-xs font-semibold text-slate-500 uppercase block mb-1">3. Action</span>
                <Button onClick={() => setShowReportPrint(true)} className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-1.5 py-2 font-semibold">
                  <Printer className="w-4 h-4" /> Export Report PDF ✓
                </Button>
                <Button onClick={handleDownloadReport} variant="outline" className="w-full flex items-center justify-center gap-1.5 py-1 text-slate-600">
                  <Download className="w-3.5 h-3.5" /> Download raw CSV
                </Button>
              </div>
            </CardContent>
          </Card>
        </Protect>

        {/* Department Satisfaction progress levels list */}
        <Card className="lg:col-span-1 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border-slate-200/60">
          <CardHeader>
            <CardTitle>Department Satisfaction</CardTitle>
            <CardDescription>Satisfaction levels by department</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 max-h-[350px] overflow-y-auto">
            {departmentSatisfaction.map((d) => (
              <div key={d.dept} className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-700 truncate max-w-[150px]">{d.dept}</span>
                  <span className="text-slate-500">{d.sat}% ({d.count})</span>
                </div>
                <Progress value={d.sat} className="h-1.5" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Feedback List */}
      <Card className="w-full">
        <CardHeader className="flex flex-col gap-4">
          <div>
            <CardTitle>Recent Feedback</CardTitle>
            <CardDescription>
              Latest patient comments and ratings
            </CardDescription>
          </div>
          <div className="flex flex-col md:flex-row gap-4 pt-4 border-t border-slate-100 w-full">
            <div className="w-full md:flex-1 space-y-1">
              <Label className="text-xs font-semibold text-slate-500 uppercase">Search Patient</Label>
              <Input 
                placeholder="Search by name..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border-slate-200"
              />
            </div>
            <div className="w-full md:flex-1 space-y-1">
              <Label className="text-xs font-semibold text-slate-500 uppercase">Time Period</Label>
              <Select value={timeFilter} onValueChange={(val: any) => setTimeFilter(val)}>
                <SelectTrigger className="w-full bg-slate-50 border-slate-200">
                  <SelectValue placeholder="Select Time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Time">All Time</SelectItem>
                  <SelectItem value="Today">Today</SelectItem>
                  <SelectItem value="This Week">This Week</SelectItem>
                  <SelectItem value="This Month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:flex-1 space-y-1">
              <Label className="text-xs font-semibold text-slate-500 uppercase">Department</Label>
              <Select value={serviceFilter} onValueChange={(val: any) => setServiceFilter(val)}>
                <SelectTrigger className="w-full bg-slate-50 border-slate-200">
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Services">All Services</SelectItem>
                  {FEEDBACK_SECTIONS.map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:flex-1 space-y-1">
              <Label className="text-xs font-semibold text-slate-500 uppercase">Rating Filter</Label>
              <Select value={ratingFilter} onValueChange={(val: any) => setRatingFilter(val)}>
                <SelectTrigger className="w-full bg-slate-50 border-slate-200">
                  <SelectValue placeholder="Select Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Ratings">All Ratings</SelectItem>
                  <SelectItem value="5 Stars Only">5 Stars Only</SelectItem>
                  <SelectItem value="4 Stars Only">4 Stars Only</SelectItem>
                  <SelectItem value="Negative (1-3 Stars)">Negative (1-3 Stars)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {filteredFeedbacks.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              No feedback found for the selected services.
            </div>
          ) : (
            <>
              {filteredFeedbacks.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map((f) => (
            <div
              key={f.id}
              className="flex flex-col gap-3 rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-slate-200/60 p-5 shadow-sm hover:shadow-md transition-all duration-300 group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Avatar className="size-9">
                    <AvatarFallback>
                      {f.patient
                        .split(' ')
                        .map((n: string) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">
                      {f.patient}
                    </span>
                    <Badge variant="secondary" className="mt-0.5 w-fit">
                      {f.service}
                    </Badge>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <StarRating rating={f.rating} />
                  <span className="text-xs text-muted-foreground">
                    {f.date}
                  </span>
                </div>
              </div>
              {f.comments && f.comments.trim().length > 0 ? (
                <p className="text-base italic text-slate-700 text-pretty font-serif leading-relaxed px-1">
                  "{f.comments}"
                </p>
              ) : (
                <p className="text-sm italic text-slate-400 px-1">
                  No additional comments provided.
                </p>
              )}
              {f.ratings && f.ratings.length > 0 && (
                <div className="pt-2 border-t border-slate-100/50 mt-1">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-white hover:bg-slate-50 text-slate-600 border-slate-200 shadow-sm transition-all group-hover:border-blue-300 group-hover:text-blue-700"
                    onClick={() => setSelectedFeedback(f)}
                  >
                    View Detailed Answers
                  </Button>
                </div>
              )}
            </div>
          ))}
          {filteredFeedbacks.length > ITEMS_PER_PAGE && (
            <div className="pt-4 flex items-center justify-between border-t border-slate-100 mt-2">
              <span className="text-sm text-slate-500">
                Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredFeedbacks.length)} of {filteredFeedbacks.length} feedbacks
              </span>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-white hover:bg-slate-50 text-slate-700 border-slate-200"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                </Button>
                <div className="text-sm font-medium text-slate-700 px-2">
                  Page {currentPage} of {Math.ceil(filteredFeedbacks.length / ITEMS_PER_PAGE)}
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-white hover:bg-slate-50 text-slate-700 border-slate-200"
                  onClick={() => setCurrentPage(prev => Math.min(Math.ceil(filteredFeedbacks.length / ITEMS_PER_PAGE), prev + 1))}
                  disabled={currentPage === Math.ceil(filteredFeedbacks.length / ITEMS_PER_PAGE)}
                >
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
          </>
        )}
        </CardContent>
      </Card>

      <PatientPicker
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        query={query}
        onQuery={setQuery}
        patients={filtered}
        onPick={selectPatient}
      />

      {/* Detailed Feedback Modal */}
      <Dialog open={!!selectedFeedback} onOpenChange={(open) => !open && setSelectedFeedback(null)}>
        <DialogContent className="w-[95vw] !max-w-5xl sm:!max-w-5xl md:!max-w-5xl lg:!max-w-5xl max-h-[95vh] overflow-y-auto bg-white p-6 sm:p-10 text-black font-sans text-xs">
          {selectedFeedback && (() => {
            const realPatient = patients.find(p => p.uhid === selectedFeedback.uhid)
            const dateStr = selectedFeedback.date
            const timeStr = "16:49" // Example time format for print view
            const locationStr = realPatient?.city || 'Ahmedabad'
            const ageGender = realPatient ? `${realPatient.age} / ${realPatient.gender}` : 'Not Specified'
            const servicesStr = selectedFeedback.serviceAvailed || selectedFeedback.service

            return (
              <div className="w-full max-w-[210mm] mx-auto flex flex-col gap-4">
                
                <header className="flex items-center justify-between border-b-2 border-black pb-3 mb-2">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                      <img src="/es-logo.jpg" alt="ES Healthcare Centre logo" className="size-9 object-contain" />
                    </div>
                    <div>
                      <h1 className="text-base font-bold tracking-tight text-slate-900 leading-none">ES Healthcare Centre</h1>
                      <p className="text-[10px] font-semibold text-teal-700 tracking-wide mt-0.5">Patient Experience & Feedback Form</p>
                    </div>
                  </div>
                  <div className="text-right text-[10px] text-slate-600 font-mono">
                    <p className="font-semibold">📞 +917961616161.</p>
                    <p className="hover:underline">https://eshealthcarecentre.in/</p>
                  </div>
                </header>

                <div className="grid grid-cols-3 gap-x-6 gap-y-2 mb-4 border border-slate-200 rounded p-3 bg-slate-50/50">
                  <div className="flex items-baseline gap-2">
                    <span className="whitespace-nowrap text-[11px] font-semibold text-slate-800">Patient name:</span>
                    <span className="flex-1 border-b border-black/40 px-1 font-medium text-slate-900">{realPatient?.name || selectedFeedback.patient}</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="whitespace-nowrap text-[11px] font-semibold text-slate-800">Date:</span>
                    <span className="flex-1 border-b border-black/40 px-1 font-medium text-slate-900">{dateStr}</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="whitespace-nowrap text-[11px] font-semibold text-slate-800">Time:</span>
                    <span className="flex-1 border-b border-black/40 px-1 font-medium text-slate-900">{timeStr}</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="whitespace-nowrap text-[11px] font-semibold text-slate-800">UHID No.</span>
                    <span className="flex-1 border-b border-black/40 px-1 font-medium text-slate-900">{realPatient?.uhid || selectedFeedback.uhid || 'Verified'}</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="whitespace-nowrap text-[11px] font-semibold text-slate-800">Location:</span>
                    <span className="flex-1 border-b border-black/40 px-1 font-medium text-slate-900">{locationStr}</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="whitespace-nowrap text-[11px] font-semibold text-slate-800">Age / Gender:</span>
                    <span className="flex-1 border-b border-black/40 px-1 font-medium text-slate-900">{ageGender}</span>
                  </div>
                  <div className="col-span-3 flex items-baseline gap-2 mt-1">
                    <span className="whitespace-nowrap text-[11px] font-semibold text-slate-800">Services:</span>
                    <span className="flex-1 border-b border-black/40 px-1 font-medium text-slate-900">{servicesStr}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 border-b border-slate-200 pb-4 mb-4">
                  <div>
                    <h3 className="font-bold text-slate-800 mb-2 text-sm">How did you hear about ES healthcare?</h3>
                    <div className="grid grid-cols-2 gap-y-2 text-[11px]">
                      {['Family & Friends', 'Social Media', 'Magazine & Newspaper', 'Google Search', 'Website', 'Other'].map(item => {
                        const checked = (selectedFeedback.heardAbout || '').includes(item)
                        return (
                          <div key={item} className="flex items-center">
                            <span className="inline-flex items-center justify-center size-3.5 border border-black/70 align-middle text-[9px] font-bold select-none mr-1.5 bg-white">
                              {checked ? '✓' : ''}
                            </span>
                            {item}{item === 'Other' ? '_____________' : ''}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 mb-2 text-sm">Reference By:</h3>
                    <div className="grid grid-cols-2 gap-y-2 text-[11px]">
                      {['Doctor', 'Camps/community Activity', 'Corporate Tie-up', 'Insurance/TPA', 'Existing Patient', 'Other'].map(item => {
                        const checked = (selectedFeedback.referenceBy || '').includes(item)
                        return (
                          <div key={item} className="flex items-center">
                            <span className="inline-flex items-center justify-center size-3.5 border border-black/70 align-middle text-[9px] font-bold select-none mr-1.5 bg-white">
                              {checked ? '✓' : ''}
                            </span>
                            {item}{item === 'Other' ? '_____________' : ''}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>

                <div className="border-b border-slate-200 pb-3 mb-4 flex items-center gap-6">
                  <span className="font-bold text-slate-800 text-sm">TYPE OF SERVICE AVAILED:</span>
                  <div className="flex items-center gap-6 text-[11px]">
                    {['Home Care Services', 'OPD', 'IPD'].map(item => {
                      const checked = (selectedFeedback.serviceAvailed || '').includes(item)
                      return (
                        <span key={item} className="flex items-center">
                          <span className="inline-flex items-center justify-center size-3.5 border border-black/70 rounded-full align-middle text-[9px] font-bold select-none mr-1.5 bg-white">
                            {checked ? '•' : ''}
                          </span>
                          {item}
                        </span>
                      )
                    })}
                  </div>
                </div>

                {Object.entries(
                  (selectedFeedback.ratings || []).reduce((acc: any, r: any) => {
                    const dept = r.category || 'General'
                    if (!acc[dept]) acc[dept] = []
                    acc[dept].push(r)
                    return acc
                  }, {})
                ).map(([dept, questions]: [string, any]) => (
                  <div key={dept} className="mb-4">
                    <h4 className="font-bold text-slate-800 mb-2 text-sm uppercase">{dept}</h4>
                    <div className="rounded-lg border border-slate-300 overflow-hidden">
                      <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-100 text-slate-700 font-semibold text-[11px]">
                          <tr>
                            <th className="p-2 border-b border-r w-1/2">Particulars</th>
                            {['Poor', 'Average', 'Good', 'Very Good', 'Excellent'].map(label => (
                              <th key={label} className="p-2 border-b text-center border-l border-slate-200">{label}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="text-[11px] bg-white">
                          {questions.map((r: any, idx: number) => (
                            <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                              <td className="p-2 border-b border-r text-slate-800">{r.question}</td>
                              {[1, 2, 3, 4, 5].map(ratingValue => (
                                <td key={ratingValue} className="p-2 border-b border-l border-slate-200 text-center">
                                  {r.rating === ratingValue ? (
                                    <span className="inline-flex items-center justify-center size-3.5 border border-black/70 rounded-full align-middle text-[9px] font-bold bg-white">
                                      •
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center justify-center size-3.5 rounded-full border border-slate-300 bg-white" />
                                  )}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}

                <div className="border border-slate-300 rounded-lg p-6 text-center bg-slate-50 mt-2 mb-6">
                  <h3 className="text-sm font-bold text-slate-800 mb-1">OVERALL SATISFACTION</h3>
                  <p className="text-[10px] text-slate-500 mb-4">Please rate the overall quality of healthcare services provided</p>
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-8 h-8 ${star <= selectedFeedback.rating ? 'fill-slate-700 text-slate-700' : 'fill-slate-200 text-slate-200'}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-4 text-[11px] mb-8">
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-slate-800">Staff member you would like to appreciate:</span>
                    <div className="border border-slate-300 rounded p-2 bg-white min-h-[32px]">
                      {selectedFeedback.staffAppreciated}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-teal-700">What did we do well? (Optional)</span>
                      <div className="border border-slate-300 rounded p-2 bg-white min-h-[80px]">
                        {selectedFeedback.positiveComments}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-red-700">Suggestions / Remarks for improvement:</span>
                      <div className="border border-slate-300 rounded p-2 bg-white min-h-[80px]">
                        {selectedFeedback.negativeComments}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 pt-4">
                    <span className="inline-flex items-center justify-center size-3.5 border border-black/70 bg-teal-600 text-white text-[9px] font-bold">✓</span>
                    <span className="font-bold uppercase text-slate-800">I AGREE TO THE USAGE OF ABOVE FEEDBACK BY THE CENTRE</span>
                  </div>
                </div>

              </div>
            )
          })()}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function PatientPicker({
  open,
  onOpenChange,
  query,
  onQuery,
  patients,
  onPick,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  query: string
  onQuery: (v: string) => void
  patients: Patient[]
  onPick: (p: Patient) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Select a patient</DialogTitle>
          <DialogDescription>
            Search by UHID, name, or phone to load their feedback form.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="patient-search">Search patients</Label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="patient-search"
                value={query}
                onChange={(e) => onQuery(e.target.value)}
                placeholder="e.g. ESHS2025-15529, Harish, 99786..."
                className="pl-9"
                autoFocus
              />
            </div>
          </div>
          <div className="max-h-72 overflow-y-auto rounded-md border border-border">
            {patients.length === 0 ? (
              <p className="p-4 text-center text-sm text-muted-foreground">
                No patients match your search.
              </p>
            ) : (
              <ul className="divide-y divide-border">
                {patients.map((p) => (
                  <li key={p.uhid}>
                    <button
                      type="button"
                      onClick={() => onPick(p)}
                      className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-accent"
                    >
                      <Avatar className="size-9">
                        <AvatarFallback>{p.initials}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-foreground">
                          {p.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {p.uhid} · {p.phone} · {p.service}
                        </span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
