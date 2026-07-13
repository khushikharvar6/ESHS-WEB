'use client'

import { useEffect, useState } from 'react'
import { Clock } from 'lucide-react'

function format(date: Date) {
  return {
    datePart: date.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }),
    timePart: date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    }),
  }
}

export function LiveClock() {
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const parts = now ? format(now) : null

  return (
    <div className="flex rounded-lg border border-border bg-card px-2.5 py-2 text-[11px] font-medium text-foreground shadow-sm">
      <div className="flex items-start gap-2">
        <Clock className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
        <div className="flex min-w-[9.2rem] flex-col leading-tight tabular-nums" aria-live="off" suppressHydrationWarning>
          <span className="whitespace-nowrap text-[11px] font-semibold text-foreground">
            {parts?.datePart ?? '—'}
          </span>
          <span className="whitespace-nowrap text-[12px] font-semibold tracking-wide text-primary">
            {parts?.timePart ?? '—'}
          </span>
        </div>
      </div>
    </div>
  )
}
