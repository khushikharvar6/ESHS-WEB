import { TrendingUp, TrendingDown, type LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function KpiCard({
  label,
  value,
  icon: Icon,
  trend,
  trendDirection = 'up',
  trendPositive,
  accent = 'primary',
}: {
  label: string
  value: string | number
  icon: LucideIcon
  trend?: string
  trendDirection?: 'up' | 'down'
  trendPositive?: boolean
  accent?: 'primary' | 'teal' | 'green' | 'warning' | 'destructive'
}) {
  const accentBg: Record<string, string> = {
    primary: 'bg-primary/10 text-primary',
    teal: 'bg-brand-teal/10 text-brand-teal',
    green: 'bg-brand-green/10 text-brand-green',
    warning: 'bg-warning/15 text-warning-foreground',
    destructive: 'bg-destructive/10 text-destructive',
  }
  const TrendIcon = trendDirection === 'up' ? TrendingUp : TrendingDown
  const isPositive = trendPositive ?? trendDirection === 'up'

  return (
    <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1 rounded-2xl border-slate-200">
      <CardContent className="flex items-start justify-between gap-4 p-5">
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-foreground">
            {label}
          </span>
          <span className="font-heading text-3xl font-semibold tracking-tight text-foreground tabular-nums">
            {value}
          </span>
        </div>
        <div
          className={cn(
            'flex size-11 shrink-0 items-center justify-center rounded-xl',
            accentBg[accent],
          )}
        >
          <Icon className="size-5" aria-hidden="true" />
        </div>
      </CardContent>
    </Card>
  )
}
