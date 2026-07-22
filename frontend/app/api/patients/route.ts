export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import {
  createResource,
  deleteResource,
  listResource,
  updateResource,
} from '@/lib/server-db'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const patients = await listResource('patients')
    return NextResponse.json(patients)
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Unknown error', stack: error?.stack }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const payload = await request.json()
  
  const {
    insuranceProvider, policyNumber, tpaNetwork, insuranceContact, insuranceNotes,
    companyName, corporateId, employeeId, companyContact, corporateAddress,
    ...patientData
  } = payload;

  if (insuranceProvider || policyNumber || tpaNetwork || insuranceContact || insuranceNotes) {
    patientData.insurance = {
      create: {
        insuranceProvider: insuranceProvider || '',
        policyNumber: policyNumber || '',
        tpaNetwork: tpaNetwork || '',
        insuranceContact: insuranceContact || '',
        insuranceNotes: insuranceNotes || ''
      }
    }
  }

  if (companyName || corporateId || employeeId || companyContact || corporateAddress) {
    patientData.corporate = {
      create: {
        companyName: companyName || '',
        corporateId: corporateId || '',
        employeeId: employeeId || '',
        companyContact: companyContact || '',
        corporateAddress: corporateAddress || ''
      }
    }
  }

  let patient
  try {
    patient = await createResource('patients', patientData)
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || String(error) }, { status: 500 })
  }

  try {
    const { sendNotification, NotificationTemplates } = await import('@/lib/sms')
    // Send SMS
    await sendNotification({
      to: patient.mobile || payload.mobile || '9999999999',
      message: NotificationTemplates.patientRegistered(
        patient.firstName || payload.firstName || 'Patient',
        patient.uhid || payload.uhid || 'Unknown'
      ),
      type: 'SMS'
    })
    
    // Send WhatsApp
    await sendNotification({
      to: patient.mobile || payload.mobile || '9999999999',
      message: NotificationTemplates.patientRegistered(
        patient.firstName || payload.firstName || 'Patient',
        patient.uhid || payload.uhid || 'Unknown'
      ),
      type: 'WHATSAPP'
    })
  } catch (error) {
    console.error('Failed to send registration notifications:', error)
  }

  return NextResponse.json(patient, { status: 201 })
}

export async function PATCH(request: Request) {
  const { id, patch } = await request.json()
  const patient = await updateResource('patients', String(id), patch)
  return NextResponse.json(patient)
}

export async function DELETE(request: Request) {
  const { id } = await request.json()
  const result = await deleteResource('patients', String(id))
  return NextResponse.json(result)
}

