import { Check } from 'lucide-react'
import { PATIENT_JOURNEY } from '@/lib/constants'
import { cn } from '@/lib/utils'

export function PatientJourneyStepper({
  currentStep = 4,
}: {
  currentStep?: number
}) {
  return (
    <div className="overflow-x-auto pb-2">
      <ol className="flex min-w-max items-center gap-1">
        {PATIENT_JOURNEY.map((stage, i) => {
          const isComplete = i < currentStep
          const isActive = i === currentStep
          const isLast = i === PATIENT_JOURNEY.length - 1
          return (
            <li key={stage} className="flex items-center gap-1">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    'flex size-9 items-center justify-center rounded-full border-2 text-xs font-semibold transition-colors',
                    isComplete &&
                      'border-success bg-success text-success-foreground',
                    isActive &&
                      'border-primary bg-primary text-primary-foreground ring-4 ring-primary/15',
                    !isComplete &&
                      !isActive &&
                      'border-border bg-card text-muted-foreground',
                  )}
                >
                  {isComplete ? (
                    <Check className="size-4" aria-hidden="true" />
                  ) : (
                    i + 1
                  )}
                </div>
                <span
                  className={cn(
                    'text-xs font-medium whitespace-nowrap',
                    isActive ? 'text-foreground' : 'text-muted-foreground',
                  )}
                >
                  {stage}
                </span>
              </div>
              {!isLast && (
                <div
                  className={cn(
                    '-mt-5 h-0.5 w-8 rounded-full sm:w-12',
                    isComplete ? 'bg-success' : 'bg-border',
                  )}
                  aria-hidden="true"
                />
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
