import { createClient } from '@supabase/supabase-js'

// TEMPORARY HARD-CODE (duplicate helper) - unify later or delete this file in favor of api/supabaseClient.js
const supabaseUrl = 'https://cqjzvbvmpcqohjarcydg.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxanp2YnZtcGNxb2hqYXJjeWRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3NzExNzksImV4cCI6MjA2NTM0NzE3OX0.wioeITJitSKZ9HrZ2iRPmC3xHHj-bL4xDYtT1iXws44'

console.log('[SupabaseClient:legacy][HARD-CODED TEST] URL:', supabaseUrl)

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true
  }
})
