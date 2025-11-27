// Temporary shim: re-export from unified TypeScript client location.
// TODO: Remove this file after all references have migrated to `@/lib/supabaseClient`.
export { supabase, getCurrentUserId } from '@/lib/supabaseClient';
