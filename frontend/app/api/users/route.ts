import { NextResponse } from 'next/server'
import { listResource } from '@/lib/server-db'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  try {
    const users = await listResource('users')
    
    return NextResponse.json({
      success: true,
      users: users,
      total: users.length,
      page: 1,
      totalPages: 1,
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
