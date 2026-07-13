import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export type StatusTone = 'success' | 'warning' | 'error' | 'info' | 'neutral'

const toneStyles: Record<StatusTone, string> = {
  success: 'bg-success/12 text-success border-success/20',
  warning: 'bg-warning/15 text-warning-foreground border-warning/30',
  error: 'bg-destructive/12 text-destructive border-destructive/20',
  info: 'bg-primary/10 text-primary border-primary/20',
  neutral: 'bg-muted text-muted-foreground border-border',
}

/** Maps a domain status label to a visual tone. */
const statusToneMap: Record<string, StatusTone> = {
  // generic
  new: 'info',
  'in progress': 'warning',
  converted: 'success',
  closed: 'neutral',
  // appointment
  scheduled: 'info',
  confirmed: 'success',
  completed: 'success',
  cancelled: 'error',
  'no show': 'error',
  // queue
  waiting: 'warning',
  'in consult': 'info',
  'in diagnostics': 'info',
  billing: 'warning',
  done: 'success',
  // billing
  paid: 'success',
  'partially paid': 'warning',
  pending: 'warning',
  draft: 'neutral',
  registered: 'success',
  'checked in': 'info',
  // mrd
  verified: 'success',
  missing: 'error',
  rejected: 'error',
  // qa
  open: 'info',
  'in review': 'warning',
  'non-compliant': 'error',
  // priority
  emergency: 'error',
  urgent: 'warning',
  routine: 'neutral',
}

export function StatusBadge({
  status,
  tone,
  className,
}: {
  status: string
  tone?: StatusTone
  className?: string
}) {
  const resolved = tone ?? statusToneMap[status.toLowerCase()] ?? 'neutral'
  return (
    <Badge
      variant="outline"
      className={cn('gap-1.5', toneStyles[resolved], className)}
    >
      <span
        className={cn(
          'size-1.5 rounded-full',
          resolved === 'success' && 'bg-success',
          resolved === 'warning' && 'bg-warning',
          resolved === 'error' && 'bg-destructive',
          resolved === 'info' && 'bg-primary',
          resolved === 'neutral' && 'bg-muted-foreground',
        )}
        aria-hidden="true"
      />
      {status}
    </Badge>
  )
}
