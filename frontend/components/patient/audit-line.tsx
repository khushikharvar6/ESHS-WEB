import { History } from 'lucide-react'

/** Small "Last updated by X on Y" stamp shown on editable records. */
export function AuditLine({
  updatedBy,
  updatedAt,
  className = '',
}: {
  updatedBy?: string
  updatedAt?: string
  className?: string
}) {
  if (!updatedBy || !updatedAt) return null
  return (
    <p
      className={`inline-flex items-center gap-1 text-xs text-muted-foreground ${className}`}
      suppressHydrationWarning
    >
      <History className="size-3" aria-hidden="true" />
      Last updated by {updatedBy} on {updatedAt}
    </p>
  )
}
