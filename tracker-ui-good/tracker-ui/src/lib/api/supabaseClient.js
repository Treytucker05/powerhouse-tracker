import { createClient } from '@supabase/supabase-js'

// Environment-based configuration (expected in production build via secrets)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://cqjzvbvmpcqohjarcydg.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxanp2YnZtcGNxb2hqYXJjeWRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3NzExNzksImV4cCI6MjA2NTM0NzE3OX0.wioeITJitSKZ9HrZ2iRPmC3xHHj-bL4xDYtT1iXws44'

// Debug logging (safe subset) – remove or gate behind dev flag later if noisy
console.log('[SupabaseClient] mode=env');
console.log('[SupabaseClient] import.meta.env keys:', Object.keys(import.meta.env).filter(k=>k.startsWith('VITE_')));
console.log('[SupabaseClient] URL resolved:', supabaseUrl);
console.log('[SupabaseClient] Key prefix:', supabaseAnonKey.substring(0,12) + '...');

// Lightweight in-memory mock for test environment to avoid any network/filesystem flakiness
export const supabase = (process.env.NODE_ENV === 'test') ? {
    from() {
        return {
            select: () => ({
                eq: () => Promise.resolve({ data: [], error: null })
            })
        };
    },
    auth: {
        getUser: () => ({ data: { user: { id: 'test-user-id' } } }),
        getSession: () => Promise.resolve({ data: { session: null } }),
        onAuthStateChange: (cb) => {
            // Immediately invoke callback once with signed_out to keep logic paths deterministic
            try { cb?.('SIGNED_OUT', { user: null }); } catch { /* noop */ }
            return { data: { subscription: { unsubscribe: () => { } } } };
        },
        signOut: () => Promise.resolve({ error: null })
    }
} : createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true
    }
})

// Helper function for user context
export const getCurrentUserId = () => {
    // Return mock user for tests
    if (typeof window === 'undefined' || window?.process?.env?.NODE_ENV === 'test') {
        return 'test-user-id'
    }

    const { data: { user } } = supabase.auth.getUser()
    return user?.id || null
}
