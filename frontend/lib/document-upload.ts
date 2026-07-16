import { supabase, DOCUMENTS_BUCKET } from './supabase'

/** Maximum file size: 10 MB */
export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB

/** Allowed file MIME types */
export const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

/** Allowed file extensions for display */
export const ALLOWED_EXTENSIONS = 'PDF, DOC, DOCX, JPG, PNG, WEBP'

export type UploadResult = {
  publicUrl: string
  storagePath: string
  fileSize: number
}

/**
 * Upload a file securely to Supabase Storage using a backend-generated signed URL.
 * Path format: `{uhid}/{timestamp}_{sanitized_filename}`
 */
export async function uploadDocumentFile(
  file: File,
  uhid: string,
): Promise<UploadResult> {
  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(
      `File "${file.name}" is too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum allowed is 10 MB.`,
    )
  }

  // Validate file type
  if (ALLOWED_MIME_TYPES.length > 0 && !ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error(
      `File type "${file.type || 'unknown'}" is not allowed. Accepted types: ${ALLOWED_EXTENSIONS}`,
    )
  }

  // Sanitize filename — remove special chars, keep extension
  const sanitized = file.name
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_+/g, '_')

  const timestamp = Date.now()
  const storagePath = `${uhid}/${timestamp}_${sanitized}`

  // 1. Get signed upload URL from our backend
  const signRes = await fetch('/api/storage/sign-upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ storagePath })
  })

  if (!signRes.ok) {
    const errorData = await signRes.json()
    throw new Error(`Failed to get secure upload pass: ${errorData.error}`)
  }

  const { token, path } = await signRes.json()

  // 2. Upload file directly to Supabase using the signed token
  const { error } = await supabase.storage
    .from(DOCUMENTS_BUCKET)
    .uploadToSignedUrl(path, token, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    console.error('Supabase upload error:', error)
    throw new Error(`Upload failed: ${error.message}`)
  }

  return {
    publicUrl: '', // No longer using public URL
    storagePath,
    fileSize: file.size,
  }
}

/**
 * Get a temporary, self-destructing signed URL for viewing/downloading the file.
 */
export async function getSignedDownloadUrl(storagePath: string, download = false): Promise<string> {
  const signRes = await fetch('/api/storage/sign-download', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ storagePath, download })
  })

  if (!signRes.ok) {
    const errorData = await signRes.json()
    throw new Error(`Failed to get secure view pass: ${errorData.error}`)
  }

  const { signedUrl } = await signRes.json()
  return signedUrl
}

/**
 * Delete a file from Supabase Storage.
 */
export async function deleteDocumentFile(storagePath: string): Promise<void> {
  if (!storagePath) return

  const deleteRes = await fetch('/api/storage/delete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ storagePath })
  })

  if (!deleteRes.ok) {
    const errorData = await deleteRes.json()
    throw new Error(`Failed to delete file: ${errorData.error}`)
  }
}

/**
 * Format file size for display.
 */
export function formatFileSize(bytes: number | null | undefined): string {
  if (!bytes) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
