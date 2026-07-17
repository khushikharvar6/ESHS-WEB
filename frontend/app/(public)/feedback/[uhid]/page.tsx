'use client'

import React, { useState, useEffect } from 'react'
// @ts-ignore: Could not find a declaration file for module 'next/navigation'
import { useParams, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { StarIcon, CheckSquare, Square } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'

const RATING_LABELS = ['Poor', 'Average', 'Good', 'Very Good', 'Excellent']

const fetchPatientService = async (uhid: string) => {
  const res = await fetch('/api/patients')
  const patients = await res.json()
  const p = patients.find((p: any) => p.uhid === uhid)
  return p || null
}

export default function PublicFeedbackPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const uhid = params.uhid as string
  const servicesParam = searchParams.get('services')

  const [patient, setPatient] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitted, setSubmitted] = useState(false)

  // Form State
  const [heardAbout, setHeardAbout] = useState<string[]>([])
  const [heardAboutOther, setHeardAboutOther] = useState('')
  
  const [referenceBy, setReferenceBy] = useState<string[]>([])
  const [referenceByOther, setReferenceByOther] = useState('')
  
  const [serviceAvailed, setServiceAvailed] = useState<string[]>([])

  const [ratings, setRatings] = useState<Record<string, number>>({})
  
  const [overallRating, setOverallRating] = useState(0)
  const [staffAppreciated, setStaffAppreciated] = useState('')
  const [positiveComments, setPositiveComments] = useState('')
  const [negativeComments, setNegativeComments] = useState('')
  const [agreeToUsage, setAgreeToUsage] = useState(true)

  const [servicesParamState, setServicesParamState] = useState<string[]>([])

  useEffect(() => {
    fetchPatientService(uhid).then(p => {
      setPatient(p)
      
      if (servicesParam) {
        const urlServices = servicesParam.split(',')
        setServicesParamState(urlServices)
        
        // Map to checkboxes
        const checkboxes: string[] = []
        if (urlServices.some((s: string) => s.toLowerCase().includes('home'))) checkboxes.push('Home Care Services')
        if (urlServices.some((s: string) => s.toLowerCase().includes('ipd'))) checkboxes.push('IPD')
        if (urlServices.length > 0 && !checkboxes.includes('Home Care Services') && !checkboxes.includes('IPD')) checkboxes.push('OPD')
        
        setServiceAvailed(checkboxes)
      } else {
        const s = p ? p.service : ''
        if (s.toLowerCase().includes('home')) setServiceAvailed(['Home Care Services'])
        else if (s.toLowerCase().includes('ipd')) setServiceAvailed(['IPD'])
        else setServiceAvailed(['OPD'])
      }
      setLoading(false)
    })
  }, [uhid, servicesParam])

  // Helpers
  const handleCheckbox = (list: string[], setList: (l: string[]) => void, item: string) => {
    if (list.includes(item)) setList(list.filter(i => i !== item))
    else setList([...list, item])
  }

  const setRating = (category: string, question: string, score: number) => {
    setRatings({ ...ratings, [`${category}|||${question}`]: score })
  }

  const getRating = (category: string, question: string) => {
    return ratings[`${category}|||${question}`] || 0
  }

  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitError('')
    
    // Prepare arrays
    const finalHeardAbout = [...heardAbout.filter(x => x !== 'Other')]
    if (heardAbout.includes('Other') && heardAboutOther) finalHeardAbout.push(`Other: ${heardAboutOther}`)
    
    const finalReferenceBy = [...referenceBy.filter(x => x !== 'Other')]
    if (referenceBy.includes('Other') && referenceByOther) finalReferenceBy.push(`Other: ${referenceByOther}`)

    // Prepare ratings array
    const ratingsPayload = Object.keys(ratings).map(key => {
      const [category, question] = key.split('|||')
      return { category, question, rating: ratings[key] }
    })
    
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uhid,
          patientName: patient ? `${patient.firstName} ${patient.lastName}` : 'Verified Patient',
          service: patient ? patient.service : 'General',
          heardAbout: finalHeardAbout.join(', '),
          referenceBy: finalReferenceBy.join(', '),
          serviceAvailed: serviceAvailed.join(', '),
          overallRating,
          staffAppreciated,
          positiveComments,
          negativeComments,
          agreeToUsage,
          ratings: ratingsPayload
        })
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.error || `Submission failed (status ${response.status})`)
      }

      setSubmitted(true)
    } catch (err: any) {
      console.error('Feedback submission error:', err)
      setSubmitError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50">Loading...</div>

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <Card className="w-full max-w-md text-center py-12">
          <CardContent>
            <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">✓</div>
            <CardTitle className="mb-2">Thank You!</CardTitle>
            <p className="text-slate-500">Your feedback has been submitted successfully and will help us improve our services.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // --- QUESTIONS DATA ---
  const generalQuestions = [
    'Registration and enquiry services',
    'Handling of patient queries and guidance provided',
    'Waiting time management',
    'Behavior of the staff',
    'Billing and payment process',
    'Cleanliness and hygiene of the facility'
  ]

  const svcString = servicesParamState.length > 0 
    ? servicesParamState.join(' ') 
    : (patient?.service || '')
    
  const hasSvc = (name: string) => svcString.toLowerCase().includes(name.toLowerCase())

  const isHomecare = serviceAvailed.some(s => s.toLowerCase().includes('home'))
  const isIPD = serviceAvailed.some(s => s.toLowerCase().includes('ipd'))
  const isOPD = serviceAvailed.some(s => s.toLowerCase().includes('opd')) || (!isHomecare && !isIPD)

  const showPathology = hasSvc('pathology') || hasSvc('lab')
  const showDoctorConsult = hasSvc('doctor') || (!showPathology && !hasSvc('radiology') && !hasSvc('cardiology') && !hasSvc('pulmonology') && !hasSvc('ophthalmology') && !hasSvc('physiotherapy') && !hasSvc('pharmacy') && !hasSvc('package') && !hasSvc('check-up') && !hasSvc('day care'))
  const showRadiology = hasSvc('radiology')
  const showCardiology = hasSvc('cardiology')
  const showPulmonology = hasSvc('pulmonology')
  const showOphthalmology = hasSvc('ophthalmology')
  const showPhysiotherapy = hasSvc('physiotherapy')
  const showPharmacy = hasSvc('pharmacy')
  const showPackage = hasSvc('package') || hasSvc('check-up')
  const showDayCare = hasSvc('day care')

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 flex justify-center font-sans">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-800">ES Healthcare Centre</h1>
          <p className="text-slate-600 font-medium">Patient Experience & Feedback Form</p>
        </div>

        {patient && (
          <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-sm">
            <div>
              <span className="block text-slate-500 font-medium text-xs uppercase mb-1">Patient Name</span>
              <span className="font-semibold text-slate-800">{patient.firstName} {patient.lastName}</span>
            </div>
            <div>
              <span className="block text-slate-500 font-medium text-xs uppercase mb-1">UHID</span>
              <span className="font-semibold text-slate-800">{patient.uhid}</span>
            </div>
            <div>
              <span className="block text-slate-500 font-medium text-xs uppercase mb-1">Age / Gender</span>
              <span className="font-semibold text-slate-800">{patient.age || 0} / {patient.gender || 'U'}</span>
            </div>
            <div>
              <span className="block text-slate-500 font-medium text-xs uppercase mb-1">Date</span>
              <span className="font-semibold text-slate-800">{new Date().toLocaleDateString('en-GB')}</span>
            </div>
          </div>
        )}

        <Card className="shadow-lg border-t-4 border-t-teal-600">
          <CardContent className="pt-8">
            <form onSubmit={handleSubmit} className="space-y-10">
              
              {/* Top Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50 p-6 rounded-xl border border-slate-200">
                
                {/* How did you hear */}
                <div>
                  <Label className="text-base font-semibold mb-3 block text-slate-800">How did you hear about ES healthcare?</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {['Family & Friends', 'Social Media', 'Magazine & Newspaper', 'Google Search', 'Website', 'Other'].map(opt => (
                      <div key={opt} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`hear-${opt}`} 
                          checked={heardAbout.includes(opt)}
                          onCheckedChange={() => handleCheckbox(heardAbout, setHeardAbout, opt)}
                        />
                        <Label htmlFor={`hear-${opt}`} className="font-normal">{opt}</Label>
                      </div>
                    ))}
                  </div>
                  {heardAbout.includes('Other') && (
                    <Input className="mt-3" placeholder="Please specify..." value={heardAboutOther} onChange={e => setHeardAboutOther(e.target.value)} />
                  )}
                </div>

                {/* Reference By */}
                <div>
                  <Label className="text-base font-semibold mb-3 block text-slate-800">Reference By:</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {['Doctor', 'Camps/community Activity', 'Corporate Tie-up', 'Insurance/TPA', 'Existing Patient', 'Other'].map(opt => (
                      <div key={opt} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`ref-${opt}`} 
                          checked={referenceBy.includes(opt)}
                          onCheckedChange={() => handleCheckbox(referenceBy, setReferenceBy, opt)}
                        />
                        <Label htmlFor={`ref-${opt}`} className="font-normal">{opt}</Label>
                      </div>
                    ))}
                  </div>
                  {referenceBy.includes('Other') && (
                    <Input className="mt-3" placeholder="Please specify..." value={referenceByOther} onChange={e => setReferenceByOther(e.target.value)} />
                  )}
                </div>

                {/* Service Availed */}
                <div className="md:col-span-2 pt-4 border-t border-slate-200">
                  <Label className="text-base font-semibold mb-3 block text-slate-800 uppercase tracking-wide">Type of Service Availed</Label>
                  <div className="flex flex-wrap gap-6">
                    {['Home Care Services', 'OPD', 'IPD'].map(opt => (
                      <div key={opt} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`svc-${opt}`} 
                          checked={serviceAvailed.includes(opt)}
                          onCheckedChange={() => {
                            if (!servicesParam) handleCheckbox(serviceAvailed, setServiceAvailed, opt)
                          }}
                          disabled={!!servicesParam}
                        />
                        <Label htmlFor={`svc-${opt}`} className={`font-medium ${servicesParam ? 'text-slate-400' : 'text-slate-700'}`}>{opt}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* General Experience Table */}
              <div>
                <Label className="text-lg font-bold mb-4 block text-slate-800 uppercase">General Experience</Label>
                <div className="overflow-x-auto rounded-lg border border-slate-200">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-100 text-slate-600 font-semibold">
                      <tr>
                        <th className="p-4 border-b">Particulars</th>
                        {RATING_LABELS.map(r => <th key={r} className="p-4 border-b text-center">{r}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {generalQuestions.map((q, idx) => (
                        <tr key={q} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                          <td className="p-4 border-b font-medium text-slate-700">{q}</td>
                          {RATING_LABELS.map((_, rIdx) => (
                            <td key={rIdx} className="p-4 border-b text-center">
                              <button
                                type="button"
                                onClick={() => setRating('General Experience', q, rIdx + 1)}
                                className={`w-6 h-6 rounded-full border-2 transition-colors ${getRating('General Experience', q) === rIdx + 1 ? 'border-teal-600 bg-teal-600' : 'border-slate-300 hover:border-teal-400'}`}
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Conditional Sections */}
              {isHomecare && (
                <div>
                  <Label className="text-lg font-bold mb-4 block text-slate-800 uppercase">Home Healthcare Experience</Label>
                  <div className="overflow-x-auto rounded-lg border border-slate-200">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-slate-100 text-slate-600 font-semibold">
                        <tr>
                          <th className="p-4 border-b">Particulars</th>
                          {RATING_LABELS.map(r => <th key={r} className="p-4 border-b text-center">{r}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          'Ease of booking the service',
                          'Timeliness of home visit',
                          'Behaviour, professionalism and explanation given',
                          'Infection control and quality standards',
                          'Overall quality of home healthcare services'
                        ].map((q, idx) => (
                          <tr key={q} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                            <td className="p-4 border-b font-medium text-slate-700">{q}</td>
                            {RATING_LABELS.map((_, rIdx) => (
                              <td key={rIdx} className="p-4 border-b text-center">
                                <button
                                  type="button"
                                  onClick={() => setRating('Home Healthcare', q, rIdx + 1)}
                                  className={`w-6 h-6 rounded-full border-2 transition-colors ${getRating('Home Healthcare', q) === rIdx + 1 ? 'border-teal-600 bg-teal-600' : 'border-slate-300 hover:border-teal-400'}`}
                                />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {isOPD && (
                <div>
                  <Label className="text-lg font-bold mb-4 block text-slate-800 uppercase">OPD Feedback</Label>
                  
                  {showDoctorConsult && (
                    <div className="overflow-x-auto rounded-lg border border-slate-200 mb-6">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-slate-100 text-slate-600 font-semibold">
                          <tr>
                            <th className="p-4 border-b">Doctor Consultation</th>
                            {RATING_LABELS.map(r => <th key={r} className="p-4 border-b text-center">{r}</th>)}
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            'Explanation regarding illness and treatment',
                            'Time spent during consultation',
                            'Clarity of advice and follow-up instructions'
                          ].map((q, idx) => (
                            <tr key={q} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                              <td className="p-4 border-b font-medium text-slate-700">{q}</td>
                              {RATING_LABELS.map((_, rIdx) => (
                                <td key={rIdx} className="p-4 border-b text-center">
                                  <button
                                    type="button"
                                    onClick={() => setRating('Doctor Consultation', q, rIdx + 1)}
                                    className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${getRating('Doctor Consultation', q) === rIdx + 1 ? 'border-teal-600 bg-teal-600' : 'border-slate-300 hover:border-teal-400'}`}
                                  />
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {showPathology && (
                    <div className="overflow-x-auto rounded-lg border border-slate-200 mb-6">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-slate-100 text-slate-600 font-semibold">
                          <tr>
                            <th className="p-4 border-b">Pathology</th>
                            {RATING_LABELS.map(r => <th key={r} className="p-4 border-b text-center">{r}</th>)}
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            'Sample collection process',
                            'Comfort during sample collection',
                            'Timely availability of reports'
                          ].map((q, idx) => (
                             <tr key={q} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                              <td className="p-4 border-b font-medium text-slate-700">{q}</td>
                              {RATING_LABELS.map((_, rIdx) => (
                                <td key={rIdx} className="p-4 border-b text-center">
                                  <button
                                    type="button"
                                    onClick={() => setRating('Pathology', q, rIdx + 1)}
                                    className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${getRating('Pathology', q) === rIdx + 1 ? 'border-teal-600 bg-teal-600' : 'border-slate-300 hover:border-teal-400'}`}
                                  />
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {showRadiology && (
                    <div className="overflow-x-auto rounded-lg border border-slate-200 mb-6">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-slate-100 text-slate-600 font-semibold">
                          <tr>
                            <th className="p-4 border-b">Radiology</th>
                            {RATING_LABELS.map(r => <th key={r} className="p-4 border-b text-center">{r}</th>)}
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            'Appointment scheduling process',
                            'Explanation before the procedure',
                            'Comfort during the procedure'
                          ].map((q, idx) => (
                             <tr key={q} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                              <td className="p-4 border-b font-medium text-slate-700">{q}</td>
                              {RATING_LABELS.map((_, rIdx) => (
                                <td key={rIdx} className="p-4 border-b text-center">
                                  <button
                                    type="button"
                                    onClick={() => setRating('Radiology', q, rIdx + 1)}
                                    className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${getRating('Radiology', q) === rIdx + 1 ? 'border-teal-600 bg-teal-600' : 'border-slate-300 hover:border-teal-400'}`}
                                  />
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {showCardiology && (
                    <div className="overflow-x-auto rounded-lg border border-slate-200 mb-6">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-slate-100 text-slate-600 font-semibold">
                          <tr>
                            <th className="p-4 border-b">Cardiology</th>
                            {RATING_LABELS.map(r => <th key={r} className="p-4 border-b text-center">{r}</th>)}
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            'Explanation regarding cardiac evaluation',
                            'Quality of diagnostic services provided',
                            'Confidence in care received'
                          ].map((q, idx) => (
                             <tr key={q} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                              <td className="p-4 border-b font-medium text-slate-700">{q}</td>
                              {RATING_LABELS.map((_, rIdx) => (
                                <td key={rIdx} className="p-4 border-b text-center">
                                  <button
                                    type="button"
                                    onClick={() => setRating('Cardiology', q, rIdx + 1)}
                                    className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${getRating('Cardiology', q) === rIdx + 1 ? 'border-teal-600 bg-teal-600' : 'border-slate-300 hover:border-teal-400'}`}
                                  />
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {showPulmonology && (
                    <div className="overflow-x-auto rounded-lg border border-slate-200 mb-6">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-slate-100 text-slate-600 font-semibold">
                          <tr>
                            <th className="p-4 border-b">Pulmonology</th>
                            {RATING_LABELS.map(r => <th key={r} className="p-4 border-b text-center">{r}</th>)}
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            'Explanation regarding respiratory condition',
                            'Quality of diagnostic services provided',
                            'Satisfaction with care received'
                          ].map((q, idx) => (
                             <tr key={q} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                              <td className="p-4 border-b font-medium text-slate-700">{q}</td>
                              {RATING_LABELS.map((_, rIdx) => (
                                <td key={rIdx} className="p-4 border-b text-center">
                                  <button
                                    type="button"
                                    onClick={() => setRating('Pulmonology', q, rIdx + 1)}
                                    className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${getRating('Pulmonology', q) === rIdx + 1 ? 'border-teal-600 bg-teal-600' : 'border-slate-300 hover:border-teal-400'}`}
                                  />
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {showOphthalmology && (
                    <div className="overflow-x-auto rounded-lg border border-slate-200 mb-6">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-slate-100 text-slate-600 font-semibold">
                          <tr>
                            <th className="p-4 border-b">Ophthalmology Services</th>
                            {RATING_LABELS.map(r => <th key={r} className="p-4 border-b text-center">{r}</th>)}
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            'Eye examination process',
                            'Explanation regarding diagnosis and treatment',
                            'Quality of eye care services'
                          ].map((q, idx) => (
                             <tr key={q} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                              <td className="p-4 border-b font-medium text-slate-700">{q}</td>
                              {RATING_LABELS.map((_, rIdx) => (
                                <td key={rIdx} className="p-4 border-b text-center">
                                  <button
                                    type="button"
                                    onClick={() => setRating('Ophthalmology Services', q, rIdx + 1)}
                                    className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${getRating('Ophthalmology Services', q) === rIdx + 1 ? 'border-teal-600 bg-teal-600' : 'border-slate-300 hover:border-teal-400'}`}
                                  />
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {showPhysiotherapy && (
                    <div className="overflow-x-auto rounded-lg border border-slate-200 mb-6">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-slate-100 text-slate-600 font-semibold">
                          <tr>
                            <th className="p-4 border-b">Physiotherapy Services</th>
                            {RATING_LABELS.map(r => <th key={r} className="p-4 border-b text-center">{r}</th>)}
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            'Explanation of exercises and treatment plan',
                            'Effectiveness of therapy sessions',
                            'Improvement experienced from treatment'
                          ].map((q, idx) => (
                             <tr key={q} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                              <td className="p-4 border-b font-medium text-slate-700">{q}</td>
                              {RATING_LABELS.map((_, rIdx) => (
                                <td key={rIdx} className="p-4 border-b text-center">
                                  <button
                                    type="button"
                                    onClick={() => setRating('Physiotherapy Services', q, rIdx + 1)}
                                    className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${getRating('Physiotherapy Services', q) === rIdx + 1 ? 'border-teal-600 bg-teal-600' : 'border-slate-300 hover:border-teal-400'}`}
                                  />
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {showPharmacy && (
                    <div className="overflow-x-auto rounded-lg border border-slate-200 mb-6">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-slate-100 text-slate-600 font-semibold">
                          <tr>
                            <th className="p-4 border-b">Pharmacy Services</th>
                            {RATING_LABELS.map(r => <th key={r} className="p-4 border-b text-center">{r}</th>)}
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            'Availability of prescribed medicines',
                            'Guidance regarding medication usage'
                          ].map((q, idx) => (
                             <tr key={q} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                              <td className="p-4 border-b font-medium text-slate-700">{q}</td>
                              {RATING_LABELS.map((_, rIdx) => (
                                <td key={rIdx} className="p-4 border-b text-center">
                                  <button
                                    type="button"
                                    onClick={() => setRating('Pharmacy Services', q, rIdx + 1)}
                                    className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${getRating('Pharmacy Services', q) === rIdx + 1 ? 'border-teal-600 bg-teal-600' : 'border-slate-300 hover:border-teal-400'}`}
                                  />
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {showPackage && (
                    <div className="overflow-x-auto rounded-lg border border-slate-200 mb-6">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-slate-100 text-slate-600 font-semibold">
                          <tr>
                            <th className="p-4 border-b">Health Check-up Package</th>
                            {RATING_LABELS.map(r => <th key={r} className="p-4 border-b text-center">{r}</th>)}
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            'Coordination between departments',
                            'Smoothness of overall process',
                            'Completion of package within expected time'
                          ].map((q, idx) => (
                             <tr key={q} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                              <td className="p-4 border-b font-medium text-slate-700">{q}</td>
                              {RATING_LABELS.map((_, rIdx) => (
                                <td key={rIdx} className="p-4 border-b text-center">
                                  <button
                                    type="button"
                                    onClick={() => setRating('Health Check-up Package', q, rIdx + 1)}
                                    className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${getRating('Health Check-up Package', q) === rIdx + 1 ? 'border-teal-600 bg-teal-600' : 'border-slate-300 hover:border-teal-400'}`}
                                  />
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {showDayCare && (
                    <div className="overflow-x-auto rounded-lg border border-slate-200 mb-6">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-slate-100 text-slate-600 font-semibold">
                          <tr>
                            <th className="p-4 border-b">Day Care Services</th>
                            {RATING_LABELS.map(r => <th key={r} className="p-4 border-b text-center">{r}</th>)}
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            'Admission process',
                            'Comfort during stay',
                            'Monitoring and care provided',
                            'Discharge process'
                          ].map((q, idx) => (
                             <tr key={q} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                              <td className="p-4 border-b font-medium text-slate-700">{q}</td>
                              {RATING_LABELS.map((_, rIdx) => (
                                <td key={rIdx} className="p-4 border-b text-center">
                                  <button
                                    type="button"
                                    onClick={() => setRating('Day Care Services', q, rIdx + 1)}
                                    className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${getRating('Day Care Services', q) === rIdx + 1 ? 'border-teal-600 bg-teal-600' : 'border-slate-300 hover:border-teal-400'}`}
                                  />
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {isIPD && (
                <div>
                  <Label className="text-lg font-bold mb-4 block text-slate-800 uppercase">IPD Feedback</Label>
                  <div className="overflow-x-auto rounded-lg border border-slate-200">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-slate-100 text-slate-600 font-semibold">
                        <tr>
                          <th className="p-4 border-b">Inpatient Experience</th>
                          {RATING_LABELS.map(r => <th key={r} className="p-4 border-b text-center">{r}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          'Admission process',
                          "Doctor's care and communication",
                          'Nursing care and responsiveness',
                          'Investigation and diagnostic services',
                          'Room comfort and cleanliness',
                          'Food quality and service',
                          'Discharge process and instructions'
                        ].map((q, idx) => (
                          <tr key={q} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                            <td className="p-4 border-b font-medium text-slate-700">{q}</td>
                            {RATING_LABELS.map((_, rIdx) => (
                              <td key={rIdx} className="p-4 border-b text-center">
                                <button
                                  type="button"
                                  onClick={() => setRating('IPD', q, rIdx + 1)}
                                  className={`w-6 h-6 rounded-full border-2 transition-colors ${getRating('IPD', q) === rIdx + 1 ? 'border-teal-600 bg-teal-600' : 'border-slate-300 hover:border-teal-400'}`}
                                />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="border-t-2 border-slate-200 my-8"></div>

              {/* Overall Satisfaction */}
              <div className="bg-slate-50 p-8 rounded-xl text-center border border-slate-200">
                <Label className="text-xl font-bold block mb-2 text-slate-800">OVERALL SATISFACTION</Label>
                <p className="text-slate-500 mb-6">Please rate the overall quality of healthcare services provided</p>
                <div className="flex justify-center gap-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setOverallRating(star)}
                      className={`p-2 transition-transform hover:scale-110 ${overallRating >= star ? 'text-amber-500' : 'text-slate-300 hover:text-amber-300'}`}
                    >
                      <StarIcon className="w-12 h-12 fill-current" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Open Feedback */}
              <div className="space-y-6">
                <div>
                  <Label className="text-slate-800 font-semibold">Staff member you would like to appreciate:</Label>
                  <Input 
                    placeholder="Name of doctor, nurse, or staff..."
                    value={staffAppreciated}
                    onChange={(e) => setStaffAppreciated(e.target.value)}
                    className="mt-2"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-teal-700 font-semibold mb-2 block">What did we do well? (Optional)</Label>
                    <Textarea 
                      placeholder="Positive feedback..."
                      value={positiveComments}
                      onChange={(e) => setPositiveComments(e.target.value)}
                      className="resize-none h-24"
                    />
                  </div>
                  <div>
                    <Label className="text-red-700 font-semibold mb-2 block">Suggestions / Remarks for improvement:</Label>
                    <Textarea 
                      placeholder="Areas for improvement..."
                      value={negativeComments}
                      onChange={(e) => setNegativeComments(e.target.value)}
                      className="resize-none h-24"
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 pt-4">
                  <Checkbox 
                    id="agree" 
                    checked={agreeToUsage}
                    onCheckedChange={(checked) => setAgreeToUsage(checked as boolean)}
                  />
                  <Label htmlFor="agree" className="font-semibold text-slate-700">I AGREE TO THE USAGE OF ABOVE FEEDBACK BY THE CENTRE</Label>
                </div>
              </div>

              {submitError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-center font-medium">
                  ⚠️ {submitError}
                </div>
              )}

              <Button type="submit" className="w-full bg-teal-700 hover:bg-teal-800 text-white py-8 text-xl rounded-xl shadow-lg transition-transform hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0" disabled={submitting || overallRating === 0}>
                {submitting ? 'Submitting...' : 'Submit Form'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
