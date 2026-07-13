import { Button } from '@/components/ui/button'

export function BillingActionBar({
  onBack,
  onCreate,
  onCreateAndPrint,
  onDraft,
  canGoBack,
}: {
  onBack: () => void
  onCreate: () => void
  onCreateAndPrint: () => void
  onDraft: () => void
  canGoBack: boolean
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-white p-4 shadow-sm">
      <Button variant="outline" onClick={onBack} disabled={!canGoBack}>Back</Button>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={onDraft}>Draft Order</Button>
        <Button variant="outline" onClick={onCreateAndPrint}>Create & Print Bill</Button>
        <Button onClick={onCreate}>Create Bill</Button>
      </div>
    </div>
  )
}
