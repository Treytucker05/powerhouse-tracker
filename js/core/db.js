/* global process */
import { createClient } from "@supabase/supabase-js";

// Load from Parcel-exposed env vars
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

export const supa = createClient(supabaseUrl, supabaseKey);

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
  return supa.auth.onAuthStateChange((_e, s) => {
    console.log("onAuth change:", s);
    callback(s);
  });
}
