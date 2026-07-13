import { NextResponse } from 'next/server'
import {
  createResource,
  deleteResource,
  listResource,
  updateResource,
} from '@/lib/server-db'

export const runtime = 'nodejs'

export async function GET() {
  const inquiries = await listResource('inquiries')
  return NextResponse.json(inquiries)
}

export async function POST(request: Request) {
  const payload = await request.json()
  const inquiry = await createResource('inquiries', payload)
  return NextResponse.json(inquiry, { status: 201 })
}

export async function PATCH(request: Request) {
  const { id, patch } = await request.json()
  const inquiry = await updateResource('inquiries', String(id), patch)
  return NextResponse.json(inquiry)
}

export async function DELETE(request: Request) {
  const { id } = await request.json()
  const result = await deleteResource('inquiries', String(id))
  return NextResponse.json(result)
}
