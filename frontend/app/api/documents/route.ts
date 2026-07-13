import { NextResponse } from 'next/server'
import {
  createResource,
  deleteResource,
  listResource,
  updateResource,
} from '@/lib/server-db'

export const runtime = 'nodejs'

export async function GET() {
  const documents = await listResource('documents')
  return NextResponse.json(documents)
}

export async function POST(request: Request) {
  const payload = await request.json()
  const document = await createResource('documents', payload)
  return NextResponse.json(document, { status: 201 })
}

export async function PATCH(request: Request) {
  const { id, patch } = await request.json()
  const document = await updateResource('documents', String(id), patch)
  return NextResponse.json(document)
}

export async function DELETE(request: Request) {
  const { id } = await request.json()
  const result = await deleteResource('documents', String(id))
  return NextResponse.json(result)
}
