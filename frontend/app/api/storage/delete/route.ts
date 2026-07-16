import { NextResponse } from 'next/server'
import { getSupabaseAdmin, DOCUMENTS_BUCKET } from '@/lib/supabase-server'

export async function POST(request: Request) {
  try {
    const { storagePath } = await request.json()

    if (!storagePath) {
      return NextResponse.json({ error: 'storagePath is required' }, { status: 400 })
    }

    const supabaseAdmin = getSupabaseAdmin()
    const { data, error } = await supabaseAdmin.storage
      .from(DOCUMENTS_BUCKET)
      .remove([storagePath])

    if (error) {
      console.error('Error deleting file:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error('Delete API error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
