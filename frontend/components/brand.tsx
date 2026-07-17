import Image from 'next/image'
import { cn } from '@/lib/utils'

export function Brand({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-card shadow-sm p-0.5">
        <Image
          src="/es-favicon-padded.png"
          alt="ES Healthcare Centre logo"
          width={40}
          height={40}
          className="size-full object-contain"
          priority
        />
      </div>
      <div className="flex flex-col leading-tight max-w-[160px]">
        <span className="text-[14px] font-semibold tracking-tight text-foreground whitespace-normal break-words leading-tight">
          ES Healthcare Centre
        </span>
      </div>
    </div>
  )
}
