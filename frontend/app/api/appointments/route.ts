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
  const appointments = await listResource('appointments')
  return NextResponse.json(appointments)
}

export async function POST(request: Request) {
  const payload = await request.json()
  const appointment = await createResource('appointments', payload)

  try {
    const { sendNotification, NotificationTemplates } = await import('@/lib/sms')
    // Send SMS
    await sendNotification({
      to: appointment.phone || payload.phone || '9999999999',
      message: NotificationTemplates.appointmentCreated(
        appointment.firstName || payload.firstName || 'Patient',
        appointment.date || payload.date || 'today',
        appointment.time || payload.time || 'soon',
        appointment.doctor || payload.doctor || 'Doctor'
      ),
      type: 'SMS'
    })
    
    // Send WhatsApp
    await sendNotification({
      to: appointment.phone || payload.phone || '9999999999',
      message: NotificationTemplates.appointmentCreated(
        appointment.firstName || payload.firstName || 'Patient',
        appointment.date || payload.date || 'today',
        appointment.time || payload.time || 'soon',
        appointment.doctor || payload.doctor || 'Doctor'
      ),
      type: 'WHATSAPP'
    })
  } catch (error) {
    console.error('Failed to send appointment notifications:', error)
  }

  return NextResponse.json(appointment, { status: 201 })
}

export async function PATCH(request: Request) {
  const { id, patch } = await request.json()
  const appointment = await updateResource('appointments', String(id), patch)
  return NextResponse.json(appointment)
}

export async function DELETE(request: Request) {
  const { id } = await request.json()
  const result = await deleteResource('appointments', String(id))
  return NextResponse.json(result)
}

