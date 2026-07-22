export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/server-db'

export async function GET() {
  try {
    const url = process.env.DATABASE_URL || 'NONE'
    const redactedUrl = url.substring(0, 15) + '...'
    return NextResponse.json({ success: true, url: redactedUrl, node_env: process.env.NODE_ENV })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message, stack: err?.stack })
  }
}
