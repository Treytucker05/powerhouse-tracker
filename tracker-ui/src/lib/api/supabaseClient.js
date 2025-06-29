// This file is deprecated - use ../supabaseClient.ts instead
// Re-export from the TypeScript version for backward compatibility

export { 
  supabase,
  getCurrentUserId,
  getCurrentUserProfile,
  isAuthenticated,
  signOut,
  tables,
  rpc
} from '../supabaseClient';

export { supabase as default } from '../supabaseClient';
