import { NextResponse } from 'next/server'
import { supabaseAdmin, DOCUMENTS_BUCKET } from '@/lib/supabase-server'

export async function POST(request: Request) {
  try {
    const { storagePath, download } = await request.json()

    if (!storagePath) {
      return NextResponse.json({ error: 'storagePath is required' }, { status: 400 })
    }

    // Generate a signed URL for downloading/viewing the file.
    // Valid for 60 seconds.
    const { data, error } = await supabaseAdmin.storage
      .from(DOCUMENTS_BUCKET)
      .createSignedUrl(storagePath, 60, {
        download: download === true
      })

    if (error) {
      console.error('Error generating signed download URL:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      signedUrl: data.signedUrl,
    })
  } catch (error: any) {
    console.error('Sign download error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
