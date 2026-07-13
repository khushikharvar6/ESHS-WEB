"use client"

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { BillingPatient } from '@/src/types/billing.types'

const mockPatients: BillingPatient[] = [
  {
    id: 'patient-1',
    uhid: 'ESHS2025-15550',
    name: 'KHUSHI JAYESHKUMAR KHARVAR',
    age: 22,
    gender: 'Female',
    phone: '+91 98765 43210',
    email: 'khushi@example.com',
    servicesTaken: ['Doctor Consultation', 'Pathology'],
  },
  {
    id: 'patient-2',
    uhid: 'ESHS2026-00002',
    name: 'RIYA SHAH',
    age: 34,
    gender: 'Female',
    phone: '+91 99887 76655',
    email: 'riya@example.com',
    servicesTaken: ['Radiology'],
  },
]

export function PatientBillingSearch({
  onSelect,
}: {
  onSelect: (patient: BillingPatient) => void
}) {
  const [query, setQuery] = useState('')
  const results = mockPatients.filter((patient) => {
    const q = query.toLowerCase()
    return (
      patient.uhid.toLowerCase().includes(q) ||
      patient.name.toLowerCase().includes(q) ||
      patient.phone.toLowerCase().includes(q)
    )
  })

  return (
    <div className="space-y-3">
      <Input placeholder="Search by UHID, patient name, or mobile" value={query} onChange={(e) => setQuery(e.target.value)} />
      <div className="space-y-2">
        {results.map((patient) => (
          <div key={patient.id} className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <p className="font-medium">{patient.name}</p>
              <p className="text-sm text-slate-500">{patient.uhid} • {patient.phone}</p>
            </div>
            <Button size="sm" onClick={() => onSelect(patient)}>Select</Button>
          </div>
        ))}
      </div>
    </div>
  )
}
