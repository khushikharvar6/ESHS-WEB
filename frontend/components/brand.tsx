import Image from 'next/image'
import { cn } from '@/lib/utils'

export function Brand({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
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
      <div className="flex flex-col leading-tight">
        <span className="text-sm font-semibold tracking-tight text-foreground">
          ES Healthcare Centre
        </span>
      </div>
    </div>
  )
}
