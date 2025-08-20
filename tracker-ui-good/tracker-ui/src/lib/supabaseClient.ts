import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON;

if (import.meta.env.DEV) {
    if (!url) throw new Error('[supabase] Missing VITE_SUPABASE_URL');
    if (!anon) throw new Error('[supabase] Missing VITE_SUPABASE_ANON');
}

export const supabase = createClient(url as string, anon as string, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    }
});

export async function getCurrentUserId(): Promise<string | null> {
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id ?? null;
}
