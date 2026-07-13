import { Suspense } from 'react'
import { BillingPage } from '@/src/components/billing/BillingPage'

export default function BillingRoutePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading Billing...</div>}>
      <BillingPage />
    </Suspense>
  )
}
