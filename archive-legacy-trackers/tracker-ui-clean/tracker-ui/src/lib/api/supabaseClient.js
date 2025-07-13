import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

// Create a typed Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true
  }
})

// Database types (can be generated with supabase gen types typescript)
/**
 * @typedef {Object} VolumeTracking
 * @property {string} id
 * @property {string} user_id
 * @property {string} muscle_group
 * @property {number} sets
 * @property {number} mrv_percentage
 * @property {string} week_start_date
 * @property {string} created_at
 */

/**
 * @typedef {Object} TrainingSession
 * @property {string} id
 * @property {string} user_id
 * @property {string} title
 * @property {string} date
 * @property {number} duration_minutes
 * @property {number} exercises_count
 * @property {number} sets_count
 * @property {number} total_volume
 * @property {boolean} completed
 * @property {string} created_at
 */

// Helper function to get current user ID
export const getCurrentUserId = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user?.id
}

export default supabase
