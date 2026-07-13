import { NextResponse } from 'next/server'
import {
  createResource,
  deleteResource,
  listResource,
  updateResource,
} from '@/lib/server-db'

export const runtime = 'nodejs'

export async function GET() {
  const patients = await listResource('patients')
  return NextResponse.json(patients)
}

export async function POST(request: Request) {
  const payload = await request.json()
  const patient = await createResource('patients', payload)

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
