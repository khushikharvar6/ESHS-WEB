import { CheckCircle2, Circle } from 'lucide-react'

export function BillingStepSidebar({
  steps,
  activeStep,
  completedSteps,
}: {
  steps: string[]
  activeStep: number
  completedSteps: number[]
}) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="mb-4">
        <p className="text-sm font-semibold text-slate-900">Billing Workflow</p>
        <p className="text-sm text-slate-500">Complete the invoice in sequence</p>
      </div>
      <div className="space-y-3">
        {steps.map((step, index) => {
          const isActive = index === activeStep
          const isCompleted = completedSteps.includes(index)
          return (
            <div key={step} className="flex items-start gap-3">
              <div className="mt-0.5">
                {isCompleted ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                ) : isActive ? (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-semibold text-white">
                    {index + 1}
                  </div>
                ) : (
                  <Circle className="h-5 w-5 text-slate-300" />
                )}
              </div>
              <div>
                <p className={`text-sm font-medium ${isActive ? 'text-blue-600' : 'text-slate-700'}`}>
                  {step}
                </p>
                <p className="text-xs text-slate-500">{index + 1}/7</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
