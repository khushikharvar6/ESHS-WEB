import { createClient } from '@supabase/supabase-js'
import { DOCUMENTS_BUCKET } from './supabase'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder_key'

// This client has admin privileges and should ONLY be used in server environments (API routes/Server actions)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export { DOCUMENTS_BUCKET }
