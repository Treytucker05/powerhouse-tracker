import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://cqjzvbvmpcqohjarcydg.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxanp2YnZtcGNxb2hqYXJjeWRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3NzExNzksImV4cCI6MjA2NTM0NzE3OX0.wioeITJitSKZ9HrZ2iRPmC3xHHj-bL4xDYtT1iXws44'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true
  }
})

// Helper used by builder steps & hooks to safely obtain a user id.
// Returns a stable mock id during tests / SSR so persistence logic can no-op gracefully.
export const getCurrentUserId = async () => {
  if (typeof window === 'undefined' || window?.process?.env?.NODE_ENV === 'test') {
    return 'test-user-id'
  }
  try {
    const { data: { user } } = await supabase.auth.getUser()
    return user?.id || null
  } catch {
    return null
  }
}
