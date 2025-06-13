// Try bare import (works when bundled); fall back to CDN for direct load
let createClient;
try {
  ({ createClient } = await import('@supabase/supabase-js'));
} catch {
  console.warn('Falling back to CDN for Supabase');
  ({ createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'));
}

const supa = createClient(
  'https://cqjzvbvmpcqohjarcydg.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxanp2YnZtcGNxb2hqYXJjeWRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3NzExNzksImV4cCI6MjA2NTM0NzE3OX0.wioeITJitSKZ9HrZ2iRPmC3xHHj-bL4xDYtT1iXws44'
);

/* ---------- Auth helpers ---------- */
export async function signUp(email, password) {
  return supa.auth.signUp({ email, password });
}

export async function signIn(email, password) {
  return supa.auth.signInWithPassword({ email, password });
}

export function onAuth(callback) {
  return supa.auth.onAuthStateChange((_event, session) => callback(session));
}

export { supa };
