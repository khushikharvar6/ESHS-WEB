import { NextResponse } from 'next/server'
import { supabaseAdmin, DOCUMENTS_BUCKET } from '@/lib/supabase-server'

export async function POST(request: Request) {
  try {
    const { storagePath } = await request.json()

    if (!storagePath) {
      return NextResponse.json({ error: 'storagePath is required' }, { status: 400 })
    }

    // Generate a signed URL for uploading to the private bucket.
    // The client can use this URL to PUT the file directly to Supabase.
    const { data, error } = await supabaseAdmin.storage
      .from(DOCUMENTS_BUCKET)
      .createSignedUploadUrl(storagePath)

    if (error) {
      console.error('Error generating signed upload URL:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      signedUrl: data.signedUrl,
      token: data.token,
      path: data.path
    })
  } catch (error: any) {
    console.error('Sign upload error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
