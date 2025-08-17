import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://cqjzvbvmpcqohjarcydg.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxanp2YnZtcGNxb2hqYXJjeWRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3NzExNzksImV4cCI6MjA2NTM0NzE3OX0.wioeITJitSKZ9HrZ2iRPmC3xHHj-bL4xDYtT1iXws44'

// Debug logging for build-time environment variable resolution
console.log('=== Supabase Client Debug ===');
console.log('import.meta.env.VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('import.meta.env.VITE_SUPABASE_ANON_KEY (first 20 chars):', import.meta.env.VITE_SUPABASE_ANON_KEY?.substring(0, 20) + '...');
console.log('Resolved supabaseUrl:', supabaseUrl);
console.log('Resolved supabaseAnonKey (first 20 chars):', supabaseAnonKey?.substring(0, 20) + '...');
console.log('Using fallback URL:', !import.meta.env.VITE_SUPABASE_URL);
console.log('Using fallback key:', !import.meta.env.VITE_SUPABASE_ANON_KEY);
console.log('All VITE_ env vars:', Object.keys(import.meta.env).filter(key => key.startsWith('VITE_')));
console.log('=== End Supabase Client Debug ===');

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Missing Supabase environment variables. Using fallback values.')
}

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
