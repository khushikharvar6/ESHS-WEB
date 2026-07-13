import { NextResponse } from 'next/server'
import { getDatabaseSummary } from '@/lib/server-db'

export const runtime = 'nodejs'

export async function GET() {
  const summary = await getDatabaseSummary()
  return NextResponse.json(summary)
}
