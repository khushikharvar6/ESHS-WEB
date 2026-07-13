import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

export function StarRating({
  rating,
  size = 'sm',
  showValue = false,
}: {
  rating: number
  size?: 'sm' | 'md'
  showValue?: boolean
}) {
  const sizeClass = size === 'md' ? 'size-5' : 'size-4'
  return (
    <div className="inline-flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              sizeClass,
              i < Math.round(rating)
                ? 'fill-warning text-warning'
                : 'fill-muted text-muted-foreground/40',
            )}
            aria-hidden="true"
          />
        ))}
      </div>
      {showValue && (
        <span className="text-sm font-medium tabular-nums text-foreground">
          {rating.toFixed(1)}
        </span>
      )}
      <span className="sr-only">{`${rating} out of 5 stars`}</span>
    </div>
  )
}
