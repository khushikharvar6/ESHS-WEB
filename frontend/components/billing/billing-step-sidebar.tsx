import { CheckCircle2, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'

type Step = {
  id: string
  label: string
}

const steps: Step[] = [
  { id: 'billing-summary', label: 'Billing Summary' },
  { id: 'discount', label: 'Discount' },
  { id: 'deposit', label: 'Deposit' },
  { id: 'payment-details', label: 'Payment Details' },
  { id: 'due', label: 'Due' },
  { id: 'report-dispatch', label: 'Report Dispatch' },
  { id: 'remarks', label: 'Remarks' },
]

export function BillingStepSidebar({ activeStep, completed = [] }: { activeStep: string; completed?: string[] }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="mb-3 text-sm font-semibold text-foreground">Billing Workflow</div>
      <div className="flex flex-col gap-2">
        {steps.map((step) => {
          const isActive = step.id === activeStep
          const isCompleted = completed.includes(step.id)
          return (
            <div
              key={step.id}
              className={cn(
                'flex items-center gap-2 rounded-lg border px-3 py-2 text-sm',
                isActive ? 'border-primary bg-primary/10 text-primary' : 'border-transparent bg-muted/40',
              )}
            >
              {isCompleted ? (
                <CheckCircle2 className="size-4 text-emerald-600" />
              ) : (
                <Circle className="size-4 text-muted-foreground" />
              )}
              <span className="font-medium">{step.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
