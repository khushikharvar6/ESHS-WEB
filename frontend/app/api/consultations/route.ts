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
  const consultations = await listResource('consultations')
  return NextResponse.json(consultations)
}

export async function POST(request: Request) {
  const payload = await request.json()
  const consultation = await createResource('consultations', payload)
  return NextResponse.json(consultation, { status: 201 })
}

export async function PATCH(request: Request) {
  const { id, patch } = await request.json()
  const consultation = await updateResource('consultations', String(id), patch)
  return NextResponse.json(consultation)
}

export async function DELETE(request: Request) {
  const { id } = await request.json()
  const result = await deleteResource('consultations', String(id))
  return NextResponse.json(result)
}

