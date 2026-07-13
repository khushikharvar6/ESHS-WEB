import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'

const options = ['SMS', 'WhatsApp', 'Email', 'Print', 'Hand Delivery']

export function ReportDispatchStep({
  dispatchMethods,
  onToggle,
}: {
  dispatchMethods: string[]
  onToggle: (value: string) => void
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Report Dispatch</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {options.map((option) => {
          const active = dispatchMethods.includes(option)
          return (
            <label key={option} className="flex items-center justify-between rounded-lg border p-3">
              <span>{option}</span>
              <input type="checkbox" checked={active} onChange={() => onToggle(option)} />
            </label>
          )
        })}
      </CardContent>
    </Card>
  )
}
