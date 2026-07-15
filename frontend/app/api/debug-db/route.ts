export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET() {
  const url = process.env.DATABASE_URL || ''
  // Mask the password but show the port
  const masked = url.replace(/:([^:@]+)@/, ':***@')
  
  return NextResponse.json({
    hasUrl: !!process.env.DATABASE_URL,
    maskedUrl: masked,
    portMatch: url.match(/:(\d+)\//)?.[1] || 'none'
  })
}
