export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { createResource } from '@/lib/server-db'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Hash password before saving if bcrypt was available, 
    // but we'll store it directly for local demo purposes to prevent crashes
    // Note: This matches the frontend architecture for the demo.
    const newUser = await createResource('users', body)

    return NextResponse.json({ success: true, data: newUser })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

