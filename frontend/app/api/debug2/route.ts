export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/server-db'

export async function GET() {
  try {
    const patients = await prisma.patient.findMany()
    return NextResponse.json({ success: true, count: patients.length })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message, stack: err?.stack })
  }
}
