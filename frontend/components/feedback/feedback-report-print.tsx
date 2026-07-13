'use client'

import Image from 'next/image'

interface FeedbackReportPrintProps {
  total: number
  avg: number
  satisfaction: number
  promoters: number
  sentimentStats: { goodCount: number; badCount: number }
  departmentSatisfaction: Array<{ dept: string; count: number; sat: number }>
  allFeedbacks: any[]
}

export function FeedbackReportPrint({
  total,
  avg,
  satisfaction,
  promoters,
  sentimentStats,
  departmentSatisfaction,
  allFeedbacks,
}: FeedbackReportPrintProps) {
  const dateStr = new Date().toLocaleDateString('en-GB')
  const timeStr = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

  // Extract comments
  const positiveComments = allFeedbacks
    .filter(f => f.rating >= 4 && f.comments?.trim())
    .map(f => ({ patient: f.patient, service: f.service, text: f.comments }))
    .slice(0, 8)

  const criticalComments = allFeedbacks
    .filter(f => (f.rating <= 3 || f.comments?.toLowerCase().includes('slow') || f.comments?.toLowerCase().includes('wait')) && f.comments?.trim())
    .map(f => ({ patient: f.patient, service: f.service, text: f.comments }))
    .slice(0, 8)

  return (
    <div className="mx-auto w-full max-w-[210mm] bg-white p-8 text-black font-sans text-xs print:p-0">
      
      {/* Header Branding */}
      <header className="flex items-center justify-between border-b-2 border-slate-800 pb-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <Image
              src="/es-logo.jpg"
              alt="ES Healthcare Centre logo"
              width={40}
              height={40}
              className="size-9 object-contain"
              priority
            />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-slate-900 leading-none">ES Healthcare Centre</h1>
            <p className="text-[10px] font-semibold text-teal-700 tracking-wide mt-0.5">
              Quality & Experience Management Team
            </p>
          </div>
        </div>
        <div className="text-right text-[10px] text-slate-600 font-mono">
          <p className="font-semibold">Report Generated On:</p>
          <p>{dateStr} · {timeStr}</p>
        </div>
      </header>

      {/* Title */}
      <div className="text-center mb-6">
        <h2 className="text-lg font-bold uppercase tracking-wider text-slate-900">
          PATIENT EXPERIENCE & FEEDBACK ANALYTICS REPORT
        </h2>
        <p className="text-[10px] text-slate-500 mt-0.5">Consolidated analysis of overall satisfaction metrics and remarks sentiment</p>
      </div>

      {/* Overall Summary KPI blocks */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="border border-slate-200 rounded p-3 bg-slate-50 text-center">
          <span className="text-[10px] text-slate-500 uppercase block font-semibold">Total Responses</span>
          <span className="text-xl font-bold text-slate-800">{total}</span>
        </div>
        <div className="border border-slate-200 rounded p-3 bg-slate-50 text-center">
          <span className="text-[10px] text-slate-500 uppercase block font-semibold">Average Rating</span>
          <span className="text-xl font-bold text-slate-800">{avg.toFixed(2)} ★</span>
        </div>
        <div className="border border-slate-200 rounded p-3 bg-slate-50 text-center">
          <span className="text-[10px] text-slate-500 uppercase block font-semibold">Satisfaction level</span>
          <span className="text-xl font-bold text-slate-800">{satisfaction}%</span>
        </div>
        <div className="border border-slate-200 rounded p-3 bg-slate-50 text-center">
          <span className="text-[10px] text-slate-500 uppercase block font-semibold">Total Promoters</span>
          <span className="text-xl font-bold text-slate-800">{promoters}</span>
        </div>
      </div>

      {/* Department-wise Satisfaction analysis */}
      <div className="mb-6">
        <h3 className="text-xs font-bold text-slate-800 border-b border-slate-300 pb-1.5 mb-3 uppercase tracking-wider">
          1. Department-wise Satisfaction Levels
        </h3>
        <table className="w-full text-left border-collapse border border-slate-200 text-[10px]">
          <thead>
            <tr className="bg-slate-50">
              <th className="border border-slate-200 p-2 font-bold w-1/3">Department / Service</th>
              <th className="border border-slate-200 p-2 font-bold text-center">Response Count</th>
              <th className="border border-slate-200 p-2 font-bold text-center w-1/2">Satisfaction Score (%)</th>
            </tr>
          </thead>
          <tbody>
            {departmentSatisfaction.map((d) => (
              <tr key={d.dept}>
                <td className="border border-slate-200 p-2 font-medium text-slate-700">{d.dept}</td>
                <td className="border border-slate-200 p-2 text-center text-slate-600">{d.count}</td>
                <td className="border border-slate-200 p-2">
                  <div className="flex items-center gap-3 px-2">
                    <span className="w-8 font-semibold text-right">{d.sat}%</span>
                    <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden max-w-[200px]">
                      <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${d.sat}%` }} />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sentiment Analysis stats */}
      <div className="grid grid-cols-2 gap-6 mb-6 break-inside-avoid">
        {/* Good Points */}
        <div>
          <h3 className="text-xs font-bold text-green-800 border-b border-green-200 pb-1.5 mb-3 uppercase tracking-wider flex justify-between">
            <span>2. Positive Highlights</span>
            <span>({sentimentStats.goodCount} good remarks)</span>
          </h3>
          <div className="space-y-2 max-h-[300px] overflow-hidden">
            {positiveComments.length === 0 ? (
              <p className="italic text-slate-400 p-2">No comments matches positive highlight filter.</p>
            ) : (
              positiveComments.map((c, i) => (
                <div key={i} className="bg-green-50/50 border border-green-100 rounded p-2 text-[10px]">
                  <p className="text-slate-800 italic">"{c.text}"</p>
                  <span className="text-[9px] text-green-700 font-semibold block mt-1">
                    — {c.patient} ({c.service})
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Bad Points / Areas of improvement */}
        <div>
          <h3 className="text-xs font-bold text-red-800 border-b border-red-200 pb-1.5 mb-3 uppercase tracking-wider flex justify-between">
            <span>3. Critical Insights</span>
            <span>({sentimentStats.badCount} poor remarks)</span>
          </h3>
          <div className="space-y-2 max-h-[300px] overflow-hidden">
            {criticalComments.length === 0 ? (
              <p className="italic text-slate-400 p-2">No comments matches critical insight filter.</p>
            ) : (
              criticalComments.map((c, i) => (
                <div key={i} className="bg-red-50/50 border border-red-100 rounded p-2 text-[10px]">
                  <p className="text-slate-800 italic">"{c.text}"</p>
                  <span className="text-[9px] text-red-700 font-semibold block mt-1">
                    — {c.patient} ({c.service})
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Signature block */}
      <div className="flex justify-between items-end text-[10px] mt-16 pt-6 border-t border-slate-200 break-inside-avoid">
        <div>
          <p className="font-semibold text-slate-700">Prepared By:</p>
          <p className="font-bold text-slate-900 mt-2">Quality Assurance Executive</p>
        </div>
        <div className="w-48 text-center">
          <div className="border-b border-black h-8 w-full" />
          <p className="text-[9px] text-slate-500 uppercase mt-1">Authorized Signature</p>
        </div>
      </div>
      
    </div>
  )
}
