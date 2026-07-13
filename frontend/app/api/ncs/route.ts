import { NextResponse } from 'next/server'
import {
  createResource,
  deleteResource,
  listResource,
  updateResource,
} from '@/lib/server-db'

export const runtime = 'nodejs'

export async function GET() {
  const ncs = await listResource('ncs')
  return NextResponse.json(ncs)
}

export async function POST(request: Request) {
  const payload = await request.json()
  const nc = await createResource('ncs', payload)
  return NextResponse.json(nc, { status: 201 })
}

export async function PATCH(request: Request) {
  const { id, patch } = await request.json()
  const nc = await updateResource('ncs', String(id), patch)
  return NextResponse.json(nc)
}

export async function DELETE(request: Request) {
  const { id } = await request.json()
  const result = await deleteResource('ncs', String(id))
  return NextResponse.json(result)
}
