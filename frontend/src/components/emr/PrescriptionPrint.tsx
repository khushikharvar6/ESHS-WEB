'use client'

import React from 'react'

export function PrescriptionPrint({ data }: { data: any }) {
  if (!data || !data.patient) return null

  return (
    <div className="p-10 max-w-[800px] mx-auto bg-white font-sans text-slate-800">
      {/* Header */}
      <div className="flex justify-between items-start border-b-2 border-emerald-600 pb-6 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-emerald-700">ES Healthcare Centre</h1>
          <p className="text-slate-500 mt-1">123 Health Avenue, Medical District</p>
          <p className="text-slate-500">Phone: +91 7961 616161</p>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-bold">{data.doctor}</h2>
          <p className="text-slate-500">Consulting Physician</p>
        </div>
      </div>

      {/* Patient Info */}
      <div className="flex justify-between bg-slate-50 p-4 rounded-lg mb-8 border border-slate-100">
        <div>
          <p className="text-sm text-slate-500">Patient Name</p>
          <p className="font-semibold text-lg">{data.patient.name}</p>
          <p className="text-sm mt-1">{data.patient.age} Y / {data.patient.gender}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-500">Date</p>
          <p className="font-semibold">{new Date(data.date).toLocaleDateString('en-GB')}</p>
          <p className="text-sm text-slate-500 mt-1">UHID</p>
          <p className="font-semibold">{data.patient.uhid}</p>
        </div>
      </div>

      {/* Vitals & Clinical Notes */}
      <div className="grid grid-cols-3 gap-8 mb-8">
        <div className="col-span-1 border-r border-slate-200 pr-6">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Vitals</h3>
          <div className="space-y-2 text-sm">
            {data.vitals?.bp && <p><span className="text-slate-500">BP:</span> {data.vitals.bp}</p>}
            {data.vitals?.pulse && <p><span className="text-slate-500">Pulse:</span> {data.vitals.pulse}</p>}
            {data.vitals?.temp && <p><span className="text-slate-500">Temp:</span> {data.vitals.temp}</p>}
            {data.vitals?.weight && <p><span className="text-slate-500">Weight:</span> {data.vitals.weight}</p>}
            {(!data.vitals?.bp && !data.vitals?.pulse && !data.vitals?.temp && !data.vitals?.weight) && <p className="text-slate-400">Not recorded</p>}
          </div>
        </div>
        
        <div className="col-span-2">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Clinical Notes</h3>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-slate-500 uppercase font-semibold">Chief Complaint</p>
              <p className="mt-1">{data.chiefComplaint}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase font-semibold">Diagnosis</p>
              <p className="mt-1 font-medium">{data.diagnosis}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Rx Medicines */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4 border-b border-slate-200 pb-2">
          <span className="text-3xl font-serif text-slate-300 italic">Rx</span>
          <h3 className="text-lg font-bold text-slate-700 mt-1">Prescription</h3>
        </div>
        
        {data.medicines && data.medicines.length > 0 ? (
          <table className="w-full text-left mt-4">
            <thead>
              <tr className="text-xs uppercase text-slate-400 border-b border-slate-200">
                <th className="pb-2 font-semibold">Medicine</th>
                <th className="pb-2 font-semibold">Dosage</th>
                <th className="pb-2 font-semibold">Duration</th>
                <th className="pb-2 font-semibold">Instructions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.medicines.map((med: any, i: number) => (
                <tr key={i}>
                  <td className="py-3 font-medium">{med.name}</td>
                  <td className="py-3">{med.dosage}</td>
                  <td className="py-3">{med.duration}</td>
                  <td className="py-3 text-slate-600">{med.instructions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-slate-400 italic">No medicines prescribed.</p>
        )}
      </div>

      {/* Advice & Follow Up */}
      <div className="grid grid-cols-2 gap-8 mb-12">
        <div>
          {data.advice && (
            <>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Advice / Diet</h3>
              <p className="text-sm whitespace-pre-wrap">{data.advice}</p>
            </>
          )}
        </div>
        <div className="text-right">
          {data.followUp && (
            <>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Follow Up</h3>
              <p className="text-sm font-medium">{new Date(data.followUp).toLocaleDateString('en-GB')}</p>
            </>
          )}
        </div>
      </div>

      {/* Footer / Signature */}
      <div className="mt-16 pt-8 border-t border-slate-200 flex justify-between items-end">
        <p className="text-xs text-slate-400">Powered by ES Healthcare HMS</p>
        <div className="text-center">
          <div className="w-40 border-b border-slate-300 mb-2"></div>
          <p className="text-sm font-semibold">{data.doctor}</p>
          <p className="text-xs text-slate-500">Signature</p>
        </div>
      </div>
    </div>
  )
}
