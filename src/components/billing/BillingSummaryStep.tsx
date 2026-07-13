import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import type { BillingInvoice, BillingPatient } from '@/src/types/billing.types'

export function BillingSummaryStep({
  patient,
  invoice,
  onAddItem,
  onSelectPatient,
}: {
  patient: BillingPatient | null
  invoice: BillingInvoice
  onAddItem: () => void
  onSelectPatient: () => void
}) {
  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle>Patient Selection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="text-sm font-semibold text-slate-900">{patient?.name ?? 'No patient selected'}</p>
              <p className="text-sm text-slate-500">{patient ? `${patient.uhid} • ${patient.phone}` : 'Search by UHID, name, or phone'}</p>
            </div>
            <Button variant="outline" onClick={onSelectPatient}>Select Patient</Button>
          </div>
          {patient && (
            <div className="grid gap-3 rounded-lg border bg-slate-50 p-4 md:grid-cols-2">
              <div><p className="text-xs uppercase text-slate-500">UHID</p><p className="text-sm font-medium">{patient.uhid}</p></div>
              <div><p className="text-xs uppercase text-slate-500">Age / Gender</p><p className="text-sm font-medium">{patient.age} / {patient.gender}</p></div>
              <div><p className="text-xs uppercase text-slate-500">Phone</p><p className="text-sm font-medium">{patient.phone}</p></div>
              <div><p className="text-xs uppercase text-slate-500">Email</p><p className="text-sm font-medium">{patient.email ?? '—'}</p></div>
              <div className="md:col-span-2"><p className="text-xs uppercase text-slate-500">Services Taken</p><p className="text-sm font-medium">{patient.servicesTaken.join(', ')}</p></div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Billing Items</CardTitle>
          <Button onClick={onAddItem}>
            <Plus className="mr-2 h-4 w-4" />Add Billing Item
          </Button>
        </CardHeader>
        <CardContent>
          {invoice.items.length === 0 ? (
            <div className="rounded-lg border border-dashed p-6 text-center text-sm text-slate-500">No items added yet. Add services, tests, or packages.</div>
          ) : (
            <div className="overflow-hidden rounded-lg border">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium text-slate-600">Item Type</th>
                    <th className="px-3 py-2 text-left font-medium text-slate-600">Item Name</th>
                    <th className="px-3 py-2 text-left font-medium text-slate-600">Category / Department</th>
                    <th className="px-3 py-2 text-right font-medium text-slate-600">Qty</th>
                    <th className="px-3 py-2 text-right font-medium text-slate-600">Unit Price</th>
                    <th className="px-3 py-2 text-right font-medium text-slate-600">Tax</th>
                    <th className="px-3 py-2 text-right font-medium text-slate-600">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {invoice.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-3 py-2">{item.itemType}</td>
                      <td className="px-3 py-2 font-medium">{item.itemName}</td>
                      <td className="px-3 py-2">{item.category} / {item.department}</td>
                      <td className="px-3 py-2 text-right">{item.quantity}</td>
                      <td className="px-3 py-2 text-right">₹{item.unitPrice}</td>
                      <td className="px-3 py-2 text-right">{item.taxRate}%</td>
                      <td className="px-3 py-2 text-right font-semibold">₹{item.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
