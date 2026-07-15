export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export const runtime = 'nodejs'

export async function POST() {
  try {
    const cookieStore = await cookies()
    cookieStore.delete('es-homs-auth')

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Failed to logout' }, { status: 500 })
  }
}

