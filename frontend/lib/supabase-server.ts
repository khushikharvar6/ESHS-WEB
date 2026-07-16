import { createClient } from '@supabase/supabase-js'
import { DOCUMENTS_BUCKET } from './supabase'

export function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn('Warning: Missing Supabase Admin credentials')
  }

  return createClient(supabaseUrl, supabaseServiceKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.dummy')
}

export { DOCUMENTS_BUCKET }
