import { createClient } from '@supabase/supabase-js';

const supaUrl = process.env.SUPABASE_URL;
const supaKey = process.env.SUPABASE_ANON_KEY;
const supa = createClient(supaUrl, supaKey);

/* ---------- Auth helpers ---------- */
export async function signUp(email, password) {
  return supa.auth.signUp({ email, password });
}

export async function signIn(email, password) {
  return supa.auth.signInWithPassword({ email, password });
}

export async function signOut() {
  return supa.auth.signOut();
}

export function onAuth(callback) {
  return supa.auth.onAuthStateChange((_event, session) => callback(session));
}

export { supa };
