'use client'

// @ts-expect-error - Next.js types might be missing in this environment
import Image from 'next/image'
import { CENTRE } from '@/lib/constants'
import type { Patient } from '@/lib/store'

const RATING_LABELS = ['Poor', 'Average', 'Good', 'Very Good', 'Excellent']

function BlankLine({ className = '' }: { className?: string }) {
  return <span className={`inline-block border-b border-black/60 ${className}`} />
}

function EmptyBox({ checked = false }: { checked?: boolean }) {
  return (
    <span className="inline-flex items-center justify-center size-3.5 border border-black/70 align-middle text-[9px] font-bold select-none mr-1.5 bg-white">
      {checked ? '✓' : ''}
    </span>
  )
}

function EmptyCircle({ checked = false }: { checked?: boolean }) {
  return (
    <span className={`inline-flex items-center justify-center size-3.5 border border-black/70 rounded-full align-middle text-[9px] font-bold select-none mr-1.5 bg-white`}>
      {checked ? '•' : ''}
    </span>
  )
}

function FieldRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="whitespace-nowrap text-[11px] font-semibold text-slate-800">
        {label}
      </span>
      <span className="flex-1 border-b border-black/40 px-1 font-medium text-slate-900">
        {value || '__________________________'}
      </span>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Printable Feedback Layout                                           */
/* ------------------------------------------------------------------ */
export function FeedbackPrintForm({
  patient,
  services,
}: {
  patient?: Patient
  services: string[]
}) {
  // Determine date, time, location
  const dateStr = patient ? new Date().toLocaleDateString('en-GB') : ''
  const timeStr = patient ? new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : ''
  const locationStr = patient ? (patient.city || 'Ahmedabad') : ''

  // Determine service availed type
  const isHomecare = services.some(s => s.toLowerCase().includes('home'))
  const isIPD = patient?.careType === 'IPD' || services.some(s => s.toUpperCase().includes('IPD'))
  const hasOPDService = services.some(s => 
    ['Doctor Consultation', 'Pathology', 'Radiology', 'Cardiology', 'Pulmonology', 'Ophthalmology', 'Physiotherapy', 'Pharmacy', 'Package', 'Day Care'].some(opd => s.includes(opd))
  )
  const isOPD = (!isHomecare && !isIPD) || hasOPDService

  return (
    <div className="mx-auto w-full max-w-[210mm] bg-white p-6 text-black shadow-sm print:max-w-none print:p-0 print:shadow-none font-sans text-xs">

      {/* Letterhead Logo Header */}
      <header className="flex items-center justify-between border-b-2 border-black pb-3 mb-4">
        <div className="flex items-center gap-3">
          {/* Real Logo element */}
          <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <Image
              src="/es-logo.jpg"
              alt="ES Healthcare Centre logo"
              width={40}
              height={40}
              className="size-9 object-contain"
              priority
            />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-slate-900 leading-none">ES Healthcare Centre</h1>
            <p className="text-[10px] font-semibold text-teal-700 tracking-wide mt-0.5">
              Patient Experience & Feedback Form
            </p>
          </div>
        </div>
        <div className="text-right text-[10px] text-slate-600 font-mono">
          <p className="font-semibold">📞 +917961616161.</p>
          <p className="hover:underline">https://eshealthcarecentre.in/</p>
        </div>
      </header>

      {/* Patient info boxes */}
      <div className="grid grid-cols-3 gap-x-6 gap-y-2 mb-4 border border-slate-200 rounded p-3 bg-slate-50/50">
        <FieldRow label="Patient name:" value={patient?.name} />
        <FieldRow label="Date:" value={dateStr} />
        <FieldRow label="Time:" value={timeStr} />
        <FieldRow label="UHID No." value={patient?.uhid} />
        <FieldRow label="Location:" value={locationStr} />
        <div className="flex items-baseline gap-2">
          <span className="whitespace-nowrap text-[11px] font-semibold text-slate-800">Age / Gender:</span>
          <span className="flex-1 border-b border-black/40 px-1 font-medium text-slate-900">
            {patient ? `${patient.age} / ${patient.gender}` : '____________________'}
          </span>
        </div>
        <div className="col-span-3">
          <FieldRow label="Services:" value={services.length ? services.join(', ') : undefined} />
        </div>
      </div>

      {/* How did you hear & Reference By section */}
      <div className="grid grid-cols-2 gap-6 border-b border-slate-200 pb-4 mb-4">
        {/* How did you hear */}
        <div>
          <h3 className="font-bold text-slate-800 mb-2">How did you hear about ES healthcare?</h3>
          <div className="grid grid-cols-2 gap-y-1.5 text-[11px]">
            <div className="flex items-center"><EmptyBox /> Family & Friends</div>
            <div className="flex items-center"><EmptyBox /> Social Media</div>
            <div className="flex items-center"><EmptyBox /> Magazine & Newspaper</div>
            <div className="flex items-center"><EmptyBox /> Google Search</div>
            <div className="flex items-center"><EmptyBox /> Website</div>
            <div className="flex items-center"><EmptyBox /> Other_____________</div>
          </div>
        </div>
        {/* Reference By */}
        <div>
          <h3 className="font-bold text-slate-800 mb-2">Reference By:</h3>
          <div className="grid grid-cols-2 gap-y-1.5 text-[11px]">
            <div className="flex items-center"><EmptyBox /> Doctor</div>
            <div className="flex items-center"><EmptyBox /> Camps/community Activity</div>
            <div className="flex items-center"><EmptyBox /> Corporate Tie-up</div>
            <div className="flex items-center"><EmptyBox /> Insurance/TPA</div>
            <div className="flex items-center"><EmptyBox /> Existing Patient</div>
            <div className="flex items-center"><EmptyBox /> Other____________</div>
          </div>
        </div>
      </div>

      {/* Type of Service Availed */}
      <div className="border-b border-slate-200 pb-3 mb-4 flex items-center gap-6">
        <span className="font-bold text-slate-800">TYPE OF SERVICE AVAILED:</span>
        <div className="flex items-center gap-6 text-[11px]">
          <span className="flex items-center"><EmptyCircle checked={isHomecare} /> Home Care Services</span>
          <span className="flex items-center"><EmptyCircle checked={isOPD} /> OPD</span>
          <span className="flex items-center"><EmptyCircle checked={isIPD} /> IPD</span>
        </div>
      </div>

      {/* General Experience Table (Seen by all) */}
      <div className="mb-4">
        <h3 className="font-bold text-slate-800 mb-2">GENERAL EXPERIENCE</h3>
        <table className="w-full text-left border-collapse border border-slate-300 text-[10px]">
          <thead>
            <tr className="bg-slate-50">
              <th className="border border-slate-300 p-2 w-1/2">Particulars</th>
              {RATING_LABELS.map(r => (
                <th key={r} className="border border-slate-300 p-2 text-center font-semibold w-16">{r}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              'Registration and enquiry services',
              'Handling of patient queries and guidance provided',
              'Waiting time management',
              'Behavior of the staff',
              'Billing and payment process',
              'Cleanliness and hygiene of the facility'
            ].map(q => (
              <tr key={q}>
                <td className="border border-slate-300 p-2 font-medium text-slate-700">{q}</td>
                {RATING_LABELS.map(r => (
                  <td key={r} className="border border-slate-300 p-2 text-center">
                    <EmptyBox />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Service-Specific Conditional Questionnaires */}
      {isHomecare && (
        <div className="mb-4 border-t border-slate-300 pt-3 break-inside-avoid">
          <h3 className="font-bold text-slate-800 mb-1">HOME HEALTHCARE SERVICES</h3>

          {/* Services availed sub list */}
          <div className="mb-2 bg-slate-50 p-2 rounded">
            <span className="font-semibold text-slate-700 block mb-1">Services Availed:</span>
            <div className="grid grid-cols-4 gap-y-1 text-[10px]">
              <div className="flex items-center"><EmptyBox checked={services.includes('Home Sample Collection')} /> Home Sample Collection</div>
              <div className="flex items-center"><EmptyBox checked={services.includes('Home Doctor Visit')} /> Home Doctor Visit</div>
              <div className="flex items-center"><EmptyBox checked={services.includes('Home Nursing Care')} /> Home Nursing Care</div>
              <div className="flex items-center"><EmptyBox checked={services.includes('Home Physiotherapy')} /> Home Physiotherapy</div>
              <div className="flex items-center"><EmptyBox checked={services.includes('Home Vaccination')} /> Home Vaccination</div>
              <div className="flex items-center"><EmptyBox checked={services.includes('ECG at Home')} /> ECG at Home</div>
              <div className="flex items-center"><EmptyBox checked={services.includes('Blood Glucose Monitoring')} /> Blood Glucose Monitoring</div>
            </div>
          </div>

          <table className="w-full text-left border-collapse border border-slate-300 text-[10px]">
            <thead>
              <tr className="bg-slate-50">
                <th className="border border-slate-300 p-2 w-1/2">Home Healthcare Experience</th>
                {RATING_LABELS.map(r => (
                  <th key={r} className="border border-slate-300 p-2 text-center font-semibold w-16">{r}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                'Ease of booking the service',
                'Timeliness of home visit',
                'Behaviour, professionalism and explanation given',
                'Infection control and quality standards',
                'Overall quality of home healthcare services'
              ].map(q => (
                <tr key={q}>
                  <td className="border border-slate-300 p-2 font-medium text-slate-700">{q}</td>
                  {RATING_LABELS.map(r => (
                    <td key={r} className="border border-slate-300 p-2 text-center"><EmptyBox /></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isOPD && (
        <div className="mb-4 border-t border-slate-300 pt-3 space-y-4">
          <h3 className="font-bold text-slate-800">OPD FEEDBACK</h3>

          {/* Doctor Consultation */}
          {services.some(s => s.includes('Doctor Consultation') || s.includes('Consultation')) && (
            <div className="break-inside-avoid">
              <h4 className="font-semibold text-slate-700 mb-1">Doctor Consultation</h4>
              <table className="w-full text-left border-collapse border border-slate-300 text-[10px]">
                <tbody>
                  {[
                    'Explanation regarding illness and treatment',
                    'Time spent during consultation',
                    'Clarity of advice and follow-up instructions'
                  ].map(q => (
                    <tr key={q}>
                      <td className="border border-slate-300 p-2 w-1/2 font-medium text-slate-700">{q}</td>
                      {RATING_LABELS.map(r => (
                        <td key={r} className="border border-slate-300 p-2 text-center w-16"><EmptyBox /></td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pathology */}
          {services.some(s => s.includes('Pathology')) && (
            <div className="break-inside-avoid">
              <h4 className="font-semibold text-slate-700 mb-1">Pathology</h4>
              <table className="w-full text-left border-collapse border border-slate-300 text-[10px]">
                <tbody>
                  {[
                    'Sample collection process',
                    'Comfort during sample collection',
                    'Timely availability of reports'
                  ].map(q => (
                    <tr key={q}>
                      <td className="border border-slate-300 p-2 w-1/2 font-medium text-slate-700">{q}</td>
                      {RATING_LABELS.map(r => (
                        <td key={r} className="border border-slate-300 p-2 text-center w-16"><EmptyBox /></td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Radiology */}
          {services.some(s => s.includes('Radiology')) && (
            <div className="break-inside-avoid">
              <h4 className="font-semibold text-slate-700 mb-1">Radiology</h4>
              <table className="w-full text-left border-collapse border border-slate-300 text-[10px]">
                <tbody>
                  {[
                    'Appointment scheduling process',
                    'Explanation before the procedure',
                    'Comfort during the procedure'
                  ].map(q => (
                    <tr key={q}>
                      <td className="border border-slate-300 p-2 w-1/2 font-medium text-slate-700">{q}</td>
                      {RATING_LABELS.map(r => (
                        <td key={r} className="border border-slate-300 p-2 text-center w-16"><EmptyBox /></td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Cardiology */}
          {services.some(s => s.includes('Cardiology')) && (
            <div className="break-inside-avoid">
              <h4 className="font-semibold text-slate-700 mb-1">Cardiology</h4>
              <table className="w-full text-left border-collapse border border-slate-300 text-[10px]">
                <tbody>
                  {[
                    'Explanation regarding cardiac evaluation',
                    'Quality of diagnostic services provided',
                    'Confidence in care received'
                  ].map(q => (
                    <tr key={q}>
                      <td className="border border-slate-300 p-2 w-1/2 font-medium text-slate-700">{q}</td>
                      {RATING_LABELS.map(r => (
                        <td key={r} className="border border-slate-300 p-2 text-center w-16"><EmptyBox /></td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pulmonology */}
          {services.some(s => s.includes('Pulmonology')) && (
            <div className="break-inside-avoid">
              <h4 className="font-semibold text-slate-700 mb-1">Pulmonology</h4>
              <table className="w-full text-left border-collapse border border-slate-300 text-[10px]">
                <tbody>
                  {[
                    'Explanation regarding respiratory condition',
                    'Quality of diagnostic services provided',
                    'Satisfaction with care received'
                  ].map(q => (
                    <tr key={q}>
                      <td className="border border-slate-300 p-2 w-1/2 font-medium text-slate-700">{q}</td>
                      {RATING_LABELS.map(r => (
                        <td key={r} className="border border-slate-300 p-2 text-center w-16"><EmptyBox /></td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Ophthalmology */}
          {services.some(s => s.includes('Ophthalmology')) && (
            <div className="break-inside-avoid">
              <h4 className="font-semibold text-slate-700 mb-1">Ophthalmology Services</h4>
              <table className="w-full text-left border-collapse border border-slate-300 text-[10px]">
                <tbody>
                  {[
                    'Eye examination process',
                    'Explanation regarding diagnosis and treatment',
                    'Quality of eye care services'
                  ].map(q => (
                    <tr key={q}>
                      <td className="border border-slate-300 p-2 w-1/2 font-medium text-slate-700">{q}</td>
                      {RATING_LABELS.map(r => (
                        <td key={r} className="border border-slate-300 p-2 text-center w-16"><EmptyBox /></td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Physiotherapy */}
          {services.some(s => s.includes('Physiotherapy')) && (
            <div className="break-inside-avoid">
              <h4 className="font-semibold text-slate-700 mb-1">Physiotherapy Services</h4>
              <table className="w-full text-left border-collapse border border-slate-300 text-[10px]">
                <tbody>
                  {[
                    'Explanation of exercises and treatment plan',
                    'Effectiveness of therapy sessions',
                    'Improvement experienced from treatment'
                  ].map(q => (
                    <tr key={q}>
                      <td className="border border-slate-300 p-2 w-1/2 font-medium text-slate-700">{q}</td>
                      {RATING_LABELS.map(r => (
                        <td key={r} className="border border-slate-300 p-2 text-center w-16"><EmptyBox /></td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pharmacy Services */}
          {services.some(s => s.includes('Pharmacy')) && (
            <div className="break-inside-avoid">
              <h4 className="font-semibold text-slate-700 mb-1">Pharmacy Services</h4>
              <table className="w-full text-left border-collapse border border-slate-300 text-[10px]">
                <tbody>
                  {[
                    'Availability of prescribed medicines',
                    'Guidance regarding medication usage'
                  ].map(q => (
                    <tr key={q}>
                      <td className="border border-slate-300 p-2 w-1/2 font-medium text-slate-700">{q}</td>
                      {RATING_LABELS.map(r => (
                        <td key={r} className="border border-slate-300 p-2 text-center w-16"><EmptyBox /></td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Health Check-up Package */}
          {services.some(s => s.includes('Package') || s.includes('Check-up')) && (
            <div className="break-inside-avoid">
              <h4 className="font-semibold text-slate-700 mb-1">Health Check-up Package</h4>
              <table className="w-full text-left border-collapse border border-slate-300 text-[10px]">
                <tbody>
                  {[
                    'Coordination between departments',
                    'Smoothness of overall process',
                    'Completion of package within expected time'
                  ].map(q => (
                    <tr key={q}>
                      <td className="border border-slate-300 p-2 w-1/2 font-medium text-slate-700">{q}</td>
                      {RATING_LABELS.map(r => (
                        <td key={r} className="border border-slate-300 p-2 text-center w-16"><EmptyBox /></td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Day Care Services */}
          {services.some(s => s.includes('Day Care')) && (
            <div className="break-inside-avoid">
              <h4 className="font-semibold text-slate-700 mb-1">Day Care Services</h4>
              <table className="w-full text-left border-collapse border border-slate-300 text-[10px]">
                <tbody>
                  {[
                    'Admission process',
                    'Comfort during stay',
                    'Monitoring and care provided',
                    'Discharge process'
                  ].map(q => (
                    <tr key={q}>
                      <td className="border border-slate-300 p-2 w-1/2 font-medium text-slate-700">{q}</td>
                      {RATING_LABELS.map(r => (
                        <td key={r} className="border border-slate-300 p-2 text-center w-16"><EmptyBox /></td>
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
        <div className="mb-4 border-t border-slate-300 pt-3 break-inside-avoid">
          <h3 className="font-bold text-slate-800 mb-2">IPD (INPATIENT) FEEDBACK</h3>
          <table className="w-full text-left border-collapse border border-slate-300 text-[10px]">
            <tbody>
              {[
                'Admission process',
                "Doctor's care and communication",
                'Nursing care and responsiveness',
                'Investigation and diagnostic services',
                'Room comfort and cleanliness',
                'Food quality and service',
                'Discharge process and instructions'
              ].map(q => (
                <tr key={q}>
                  <td className="border border-slate-300 p-2 w-1/2 font-medium text-slate-700">{q}</td>
                  {RATING_LABELS.map(r => (
                    <td key={r} className="border border-slate-300 p-2 text-center w-16"><EmptyBox /></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer seen by all */}
      <div className="mt-4 border-t border-slate-300 pt-3 break-inside-avoid space-y-3">
        {/* Overall satisfaction */}
        <div className="flex items-center gap-3">
          <span className="font-bold text-slate-800">OVERALL SATISFACTION:</span>
          <span className="text-[10px] text-slate-600">Please rate the overall quality of healthcare services provided</span>
          <div className="flex items-center gap-3 ml-2">
            {[1, 2, 3, 4, 5].map(num => (
              <span key={num} className="flex items-center font-semibold"><EmptyBox /> {num}</span>
            ))}
          </div>
        </div>

        {/* Appreciation line */}
        <div className="flex items-baseline gap-2">
          <span className="font-bold text-slate-800 whitespace-nowrap">Staff member you would like to appreciate:</span>
          <BlankLine className="flex-1" />
        </div>

        {/* Suggestions */}
        <div className="flex items-start gap-2">
          <span className="font-bold text-slate-800 whitespace-nowrap pt-1">Suggestions / Remarks for improvement:</span>
          <div className="flex-1 flex flex-col gap-3">
            <BlankLine className="w-full h-4" />
            <BlankLine className="w-full h-4" />
          </div>
        </div>

        {/* Consent usage */}
        <div className="flex items-center gap-4 py-1">
          <span className="font-bold text-slate-800 uppercase">I AGREE TO THE USAGE OF ABOVE FEEDBACK BY THE CENTRE:</span>
          <span className="flex items-center"><EmptyBox /> YES</span>
          <span className="flex items-center"><EmptyBox /> NO</span>
        </div>

        {/* Signatures */}
        <div className="grid grid-cols-3 gap-6 pt-4 text-[10px]">
          <div>
            <BlankLine className="w-full h-4" />
            <div className="mt-1 font-semibold text-slate-700">Contact No.</div>
          </div>
          <div>
            <BlankLine className="w-full h-4" />
            <div className="mt-1 font-semibold text-slate-700">Email ID</div>
          </div>
          <div>
            <BlankLine className="w-full h-4" />
            <div className="mt-1 font-semibold text-slate-700">Signature</div>
          </div>
        </div>
      </div>

      <footer className="mt-8 border-t border-slate-200 pt-3 text-center text-[10px] font-bold text-teal-800 uppercase tracking-widest break-inside-avoid">
        ** THANK YOU **
      </footer>
    </div>
  )
}
