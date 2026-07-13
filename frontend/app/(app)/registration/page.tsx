'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { BadgeCheck, RotateCcw, CheckCircle2, Printer } from 'lucide-react'
import { toast } from 'sonner'

import { PageHeader } from '@/components/page-header'
import { MessagePreview } from '@/components/message-preview'
import { Button } from '@/components/ui/button'
import { Protect } from '@/components/protect'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  FieldGroup,
  FieldSet,
  FieldLegend,
  Field,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import {
  SERVICES,
  SALUTATIONS,
  GENDERS,
  BLOOD_GROUPS,
  MARITAL_STATUSES,
  RELATIONSHIPS,
  PATIENT_CATEGORIES,
  CARE_TYPES,
  CENTRE,
} from '@/lib/constants'
import { useHealthcare } from '@/lib/store'

function ageFromDob(dob: string) {
  if (!dob) return 0
  const d = new Date(dob)
  const diff = Date.now() - d.getTime()
  return Math.max(0, Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000)))
}

function RegistrationForm() {
  const router = useRouter()
  const params = useSearchParams()
  const { registerPatient, patients, addDocument } = useHealthcare()

  const [uhid, setUhid] = useState('')
  const [salutation, setSalutation] = useState('Ms.')
  const [firstName, setFirstName] = useState('')
  const [middleName, setMiddleName] = useState('')
  const [lastName, setLastName] = useState('')
  const [dob, setDob] = useState('')
  const [age, setAge] = useState(0)
  const [gender, setGender] = useState('')
  const [bloodGroup, setBloodGroup] = useState('')
  const [maritalStatus, setMaritalStatus] = useState('')
  const [mobile, setMobile] = useState('')
  const [alternateMobile, setAlternateMobile] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [country, setCountry] = useState('India')
  const [pincode, setPincode] = useState('')
  const [emergencyName, setEmergencyName] = useState('')
  const [emergencyRelationship, setEmergencyRelationship] = useState('')
  const [emergencyPhone, setEmergencyPhone] = useState('')
  const [patientCategory, setPatientCategory] = useState('Walk-In')
  const [careType, setCareType] = useState('OPD')
  const [assignedDepartment, setAssignedDepartment] = useState('')
  const [service, setService] = useState('')
  const [insuranceProvider, setInsuranceProvider] = useState('')
  const [policyNumber, setPolicyNumber] = useState('')
  const [tpaName, setTpaName] = useState('')
  const [insuranceContact, setInsuranceContact] = useState('')
  const [insuranceNotes, setInsuranceNotes] = useState('')
  const [corporateName, setCorporateName] = useState('')
  const [corporateId, setCorporateId] = useState('')
  const [employeeId, setEmployeeId] = useState('')
  const [corporateContact, setCorporateContact] = useState('')
  const [corporateAddress, setCorporateAddress] = useState('')
  const [documentCategory, setDocumentCategory] = useState('')
  const [documents, setDocuments] = useState<File[]>([])
  const [documentError, setDocumentError] = useState<string | null>(null)

  const [success, setSuccess] = useState<{ uhid: string; name: string; phone: string; email: string } | null>(null)

  // prefill from an appointment / inquiry hand-off
  useEffect(() => {
    const fName = params.get('firstName')
    if (fName) setFirstName(fName)
    const lName = params.get('lastName')
    if (lName) setLastName(lName)
    const pPhone = params.get('phone')
    if (pPhone) setMobile(pPhone)
    const pEmail = params.get('email')
    if (pEmail) setEmail(pEmail)
    const pService = params.get('service')
    if (pService) setService(pService)
  }, [params])

  const fromAppt = params.get('appt')
  const fromInquiry = params.get('inquiry')

  useEffect(() => {
    if (!dob) {
      setAge(0)
      return
    }
    setAge(ageFromDob(dob))
  }, [dob])

  useEffect(() => {
    if (!uhid) {
      setUhid('ES2026-' + String(Math.floor(100000 + Math.random() * 900000)).padStart(6, '0'))
    }
  }, [uhid])

  function handleDocumentChange(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) {
      setDocuments([])
      setDocumentError('No files selected')
      return
    }

    const selectedFiles = Array.from(fileList).slice(0, 6)
    setDocuments(selectedFiles)
    setDocumentError(null)
  }

  function handlePatientCategoryChange(value: string) {
    setPatientCategory(value)
    if (value !== 'Insurance') {
      setInsuranceProvider('')
      setPolicyNumber('')
      setTpaName('')
      setInsuranceContact('')
      setInsuranceNotes('')
    }
    if (value !== 'Corporate') {
      setCorporateName('')
      setCorporateId('')
      setEmployeeId('')
      setCorporateContact('')
      setCorporateAddress('')
    }
  }

  function reset() {
    setUhid('ES2026-' + String(Math.floor(100000 + Math.random() * 900000)).padStart(6, '0'))
    setSalutation('Ms.')
    setFirstName('')
    setMiddleName('')
    setLastName('')
    setDob('')
    setAge(0)
    setGender('')
    setBloodGroup('')
    setMaritalStatus('')
    setMobile('')
    setAlternateMobile('')
    setEmail('')
    setAddress('')
    setCity('')
    setState('')
    setCountry('India')
    setPincode('')
    setEmergencyName('')
    setEmergencyRelationship('')
    setEmergencyPhone('')
    setPatientCategory('Walk-In')
    setCareType('OPD')
    setAssignedDepartment('')
    setService('')
    setInsuranceProvider('')
    setPolicyNumber('')
    setTpaName('')
    setInsuranceContact('')
    setInsuranceNotes('')
    setCorporateName('')
    setCorporateId('')
    setEmployeeId('')
    setCorporateContact('')
    setCorporateAddress('')
    setDocumentCategory('')
    setDocuments([])
    setDocumentError(null)
    toast('Form cleared')
  }

  async function submit(print = false) {
    if (!firstName || !lastName || !mobile || !service) {
      toast.error('First name, last name, mobile and service are required')
      return
    }
    
    if (!/^\d{10}$/.test(mobile.replace(/\D/g, ''))) {
      toast.error('Mobile number must be exactly 10 digits')
      return
    }
    
    // Duplicate Patient Check
    const duplicate = patients.find(
      (p) => p.mobileNo === mobile && p.firstName?.toLowerCase() === firstName.toLowerCase() && p.lastName?.toLowerCase() === lastName.toLowerCase()
    )
    if (duplicate) {
      toast.error(`Duplicate Check: Patient ${firstName} ${lastName} with this mobile number already exists (UHID: ${duplicate.uhid})`)
      return
    }

    const familyContact = patients.find((p) => p.mobileNo === mobile)
    if (familyContact) {
      toast('Family contact detected. Linking shared mobile number.', { icon: '👨‍👩‍👧‍👦' })
    }

    let patient
    try {
      patient = await registerPatient({
      uhid,
      salutation,
      firstName,
      middleName: middleName || undefined,
      lastName,
      dob: dob || undefined,
      age: age || ageFromDob(dob),
      gender: gender || 'Other',
      bloodGroup: bloodGroup || undefined,
      maritalStatus: maritalStatus || undefined,
      mobileNo: mobile,
      alternateMobile: alternateMobile || undefined,
      emailAddress: email || undefined,
      residentialAddress: address || undefined,
      city: city || undefined,
      state: state || undefined,
      country: country || undefined,
      pincode: pincode || undefined,
      emergencyContactName: emergencyName || undefined,
      emergencyRelationship: emergencyRelationship || undefined,
      emergencyPhoneNumber: emergencyPhone || undefined,
      patientCategory: patientCategory || undefined,
      careType: careType || undefined,
      assignedDepartmentServices: assignedDepartment || undefined,
      service,
      insuranceProvider: insuranceProvider || undefined,
      policyNumber: policyNumber || undefined,
      tpaNetwork: tpaName || undefined,
      insuranceContact: insuranceContact || undefined,
      insuranceNotes: insuranceNotes || undefined,
      companyName: corporateName || undefined,
      corporateId: corporateId || undefined,
      employeeId: employeeId || undefined,
      companyContact: corporateContact || undefined,
      corporateAddress: corporateAddress || undefined,
      appointmentId: fromAppt ?? undefined,
      inquiryId: fromInquiry ?? undefined,
    })
    } catch (error) {
      toast.error('Failed to save registration. Please try again.')
      return
    }

    setUhid(patient.uhid)
    setSuccess({ uhid: patient.uhid, name: patient.name, phone: mobile, email: email })
    toast.success(`Patient registered — ${patient.uhid} generated`)
    
    // Open WhatsApp Web Link
    import('@/lib/sms').then(({ generateWhatsAppLink, NotificationTemplates }) => {
      const msg = NotificationTemplates.patientRegistered(patient.name || firstName, patient.uhid, salutation)
      const waUrl = generateWhatsAppLink(mobile, msg)
      window.open(waUrl, 'whatsapp_web')
    })

    if (print) {
      toast.success('Registration slip is ready for print')
    }
    router.push(`/patient-profile?uhid=${patient.uhid}`)
  }

  const successMessage = success
    ? `Hello ${salutation} ${success.name.toUpperCase()}, Thank you for registering with ${CENTRE.name}! Your unique health ID (UHID) is ${success.uhid}. We're here to support your healthcare journey. Feel free to reach out at ${CENTRE.phone} for any assistance!`
    : ''

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Registration"
        description="Register a new patient and generate a Unique Health ID (UHID)."
        breadcrumb={['Home', 'Registration']}
      />

      <Card>
        <CardHeader>
          <div className="mb-2">
            <CardTitle className="text-3xl font-extrabold text-blue-900">Patient Registration</CardTitle>
          </div>
          <CardDescription>
            Demographic and clinical intake details for new admissions and visits.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {(fromAppt || fromInquiry) && (
            <Alert>
              <BadgeCheck />
              <AlertTitle>Details pre-filled</AlertTitle>
              <AlertDescription>
                Prefilled from {fromAppt ? `appointment ${fromAppt}` : ''}
                {fromAppt && fromInquiry ? ' · ' : ''}
                {fromInquiry ? `inquiry ${fromInquiry}` : ''}. Complete the
                remaining fields and register.
              </AlertDescription>
            </Alert>
          )}

          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span><strong>UHID Code:</strong> {uhid}</span>
            </div>
          </div>

          <FieldSet>
            <FieldLegend variant="label" className="text-xl font-bold text-blue-800">Section 1 • Patient Personal Details</FieldLegend>
            <FieldGroup>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
                <Field>
                  <FieldLabel>Salutation</FieldLabel>
                  <Select value={salutation} onValueChange={(value) => setSalutation(value ?? '')}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="Select..." /></SelectTrigger>
                    <SelectContent>
                      {SALUTATIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel htmlFor="reg-first">First Name *</FieldLabel>
                  <Input id="reg-first" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="reg-middle">Middle Name</FieldLabel>
                  <Input id="reg-middle" value={middleName} onChange={(e) => setMiddleName(e.target.value)} placeholder="Middle name" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="reg-last">Last Name *</FieldLabel>
                  <Input id="reg-last" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last name" />
                </Field>
              </div>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
                <Field>
                  <FieldLabel>Gender *</FieldLabel>
                  <Select value={gender} onValueChange={(value) => setGender(value ?? '')}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="Select..." /></SelectTrigger>
                    <SelectContent>
                      {GENDERS.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel htmlFor="reg-dob">Date of Birth *</FieldLabel>
                  <Input id="reg-dob" type="date" value={dob} max={new Date().toISOString().split('T')[0]} onChange={(e) => setDob(e.target.value)} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="reg-age">Age</FieldLabel>
                  <Input id="reg-age" type="number" value={age} readOnly className="bg-muted cursor-not-allowed" />
                </Field>
                <Field>
                  <FieldLabel>Blood Group *</FieldLabel>
                  <Select value={bloodGroup} onValueChange={(value) => setBloodGroup(value ?? '')}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="Select..." /></SelectTrigger>
                    <SelectContent>
                      {BLOOD_GROUPS.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </Field>
              </div>
              <Field>
                <FieldLabel>Marital Status</FieldLabel>
                <Select value={maritalStatus} onValueChange={(value) => setMaritalStatus(value ?? '')}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="Select..." /></SelectTrigger>
                  <SelectContent>
                    {MARITAL_STATUSES.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
            </FieldGroup>
          </FieldSet>

          <FieldSet>
            <FieldLegend variant="label" className="text-xl font-bold text-blue-800">Section 2 • Contact Information</FieldLegend>
            <FieldGroup>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <Field>
                  <FieldLabel htmlFor="reg-mobile">Mobile Number *</FieldLabel>
                  <Input id="reg-mobile" type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="+91 ..." />
                </Field>
                <Field>
                  <FieldLabel htmlFor="reg-alt-mobile">Alternate Mobile</FieldLabel>
                  <Input id="reg-alt-mobile" type="tel" value={alternateMobile} onChange={(e) => setAlternateMobile(e.target.value)} placeholder="+91 ..." />
                </Field>
                <Field>
                  <FieldLabel htmlFor="reg-email">Email Address</FieldLabel>
                  <Input id="reg-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@email.com" />
                </Field>
              </div>
            </FieldGroup>
          </FieldSet>

          <FieldSet>
            <FieldLegend variant="label" className="text-xl font-bold text-blue-800">Section 3 • Residential Address Profile</FieldLegend>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="reg-address">Residential Address *</FieldLabel>
                <Textarea id="reg-address" value={address} onChange={(e) => setAddress(e.target.value)} rows={2} placeholder="Street address" />
              </Field>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
                <Field>
                  <FieldLabel htmlFor="reg-city">City *</FieldLabel>
                  <Input id="reg-city" value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="reg-state">State *</FieldLabel>
                  <Input id="reg-state" value={state} onChange={(e) => setState(e.target.value)} placeholder="State" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="reg-country">Country</FieldLabel>
                  <Input id="reg-country" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="India" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="reg-pincode">Pincode </FieldLabel>
                  <Input id="reg-pincode" value={pincode} onChange={(e) => setPincode(e.target.value)} placeholder="000000" />
                </Field>
              </div>
            </FieldGroup>
          </FieldSet>

          <FieldSet>
            <FieldLegend variant="label" className="text-xl font-bold text-blue-800">Section 4 • Emergency Contact Information</FieldLegend>
            <FieldGroup>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <Field>
                  <FieldLabel htmlFor="reg-emergency-name">Emergency Contact Name *</FieldLabel>
                  <Input id="reg-emergency-name" value={emergencyName} onChange={(e) => setEmergencyName(e.target.value)} placeholder="Contact name" />
                </Field>
                <Field>
                  <FieldLabel>Relationship *</FieldLabel>
                  <Select value={emergencyRelationship} onValueChange={(value) => setEmergencyRelationship(value ?? '')}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="Select..." /></SelectTrigger>
                    <SelectContent>
                      {RELATIONSHIPS.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel htmlFor="reg-emergency-phone">Emergency Phone Number *</FieldLabel>
                  <Input id="reg-emergency-phone" value={emergencyPhone} onChange={(e) => setEmergencyPhone(e.target.value)} placeholder="+91 ..." />
                </Field>
              </div>
            </FieldGroup>
          </FieldSet>

          <FieldSet>
            <FieldLegend variant="label" className="text-xl font-bold text-blue-800">Section 5 • Clinical Department Service Allocation</FieldLegend>
            <FieldGroup>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <Field>
                  <FieldLabel>Patient Category *</FieldLabel>
                  <Select value={patientCategory} onValueChange={(value) => handlePatientCategoryChange(value ?? '')}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="Select..." /></SelectTrigger>
                    <SelectContent>
                      {PATIENT_CATEGORIES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel>Care Type *</FieldLabel>
                  <Select value={careType} onValueChange={(value) => setCareType(value ?? '')}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="Select..." /></SelectTrigger>
                    <SelectContent>
                      {CARE_TYPES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel>Assigned Department / Service *</FieldLabel>
                  <Select value={service} onValueChange={(value) => setService(value ?? '')}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="Select..." /></SelectTrigger>
                    <SelectContent>
                      {SERVICES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </Field>
              </div>
            </FieldGroup>
          </FieldSet>

          {(patientCategory === 'Insurance' || patientCategory === 'Corporate') && (
            <FieldSet>
              <FieldLegend variant="label" className="text-xl font-bold text-blue-800">
                {patientCategory === 'Insurance' ? 'Section 6 • Insurance Details' : 'Section 6 • Corporate Details'}
              </FieldLegend>
              <FieldGroup>
                {patientCategory === 'Insurance' ? (
                  <>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <Field>
                        <FieldLabel htmlFor="ins-provider">Insurance Provider *</FieldLabel>
                        <Input id="ins-provider" value={insuranceProvider} onChange={(e) => setInsuranceProvider(e.target.value)} placeholder="Provider name" />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="ins-policy">Policy Number *</FieldLabel>
                        <Input id="ins-policy" value={policyNumber} onChange={(e) => setPolicyNumber(e.target.value)} placeholder="Policy number" />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="ins-tpa">TPA / Network *</FieldLabel>
                        <Input id="ins-tpa" value={tpaName} onChange={(e) => setTpaName(e.target.value)} placeholder="TPA or network" />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="ins-contact">Insurance Contact *</FieldLabel>
                        <Input id="ins-contact" value={insuranceContact} onChange={(e) => setInsuranceContact(e.target.value)} placeholder="Contact number" />
                      </Field>
                    </div>
                    <Field>
                      <FieldLabel htmlFor="ins-notes">Insurance Notes</FieldLabel>
                      <Textarea id="ins-notes" value={insuranceNotes} onChange={(e) => setInsuranceNotes(e.target.value)} rows={2} placeholder="Additional insurance details" />
                    </Field>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <Field>
                        <FieldLabel htmlFor="corp-name">Company Name *</FieldLabel>
                        <Input id="corp-name" value={corporateName} onChange={(e) => setCorporateName(e.target.value)} placeholder="Company name" />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="corp-id">Corporate ID *</FieldLabel>
                        <Input id="corp-id" value={corporateId} onChange={(e) => setCorporateId(e.target.value)} placeholder="Corporate ID" />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="corp-employee">Employee ID *</FieldLabel>
                        <Input id="corp-employee" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} placeholder="Employee ID" />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="corp-contact">Company Contact *</FieldLabel>
                        <Input id="corp-contact" value={corporateContact} onChange={(e) => setCorporateContact(e.target.value)} placeholder="Contact number or email" />
                      </Field>
                    </div>
                    <Field>
                      <FieldLabel htmlFor="corp-address">Corporate Address</FieldLabel>
                      <Textarea id="corp-address" value={corporateAddress} onChange={(e) => setCorporateAddress(e.target.value)} rows={2} placeholder="Billing address or branch details" />
                    </Field>
                  </>
                )}
              </FieldGroup>
            </FieldSet>
          )}


        </CardContent>
        <CardFooter className="justify-end gap-2 border-t">
          <Button variant="outline" onClick={reset}>
            <RotateCcw data-icon="inline-start" />
            Clear Form
          </Button>
          <Protect module="REGISTRATION" action="CREATE">
            <Button onClick={() => submit(false)}>Save Registration & Generate UHID</Button>
          </Protect>
        </CardFooter>
      </Card>

      <Dialog open={success !== null} onOpenChange={(o) => !o && setSuccess(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mb-1 flex items-center gap-2">
              <span className="flex size-9 items-center justify-center rounded-full bg-success/12 text-success">
                <CheckCircle2 className="size-5" />
              </span>
              <DialogTitle>Registration Successful</DialogTitle>
            </div>
            <DialogDescription>
              UHID{' '}
              <Badge variant="secondary" className="font-mono">
                {success?.uhid}
              </Badge>{' '}
              has been generated for {success?.name}.
            </DialogDescription>
          </DialogHeader>
          <MessagePreview
            message={successMessage}
            patientPhone={success?.phone}
            patientEmail={success?.email}
            actions={['sms', 'whatsapp', 'call', 'directions', 'profile']}
            onProfile={() => {
              const uhid = success?.uhid
              setSuccess(null)
              if (uhid) router.push(`/patient-profile?uhid=${encodeURIComponent(uhid)}`)
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function RegistrationPage() {
  return (
    <Suspense fallback={null}>
      <RegistrationForm />
    </Suspense>
  )
}
