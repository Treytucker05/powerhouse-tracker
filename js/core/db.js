import { debugLog } from "../utils/debug.js";

// Provide a minimal stub so anything expecting the Supabase client
// won't throw errors when auth is disabled. This avoids DOM access
// during initialization which previously caused crashes.
export const supa = {
  auth: {
    signUp: async () => ({ data: null, error: new Error("Auth disabled") }),
    signInWithPassword: async () => ({ data: null, error: new Error("Auth disabled") }),
    signOut: async () => ({ error: new Error("Auth disabled") }),
    onAuthStateChange: () => {
      debugLog("Auth system disabled; onAuthStateChange ignored.");
      return { data: null };
    },
  },
};

/* ---------- Auth helpers ---------- */
export async function signUp(email, password) {
  debugLog("signUp called but auth is disabled");
  return supa.auth.signUp({ email, password });
}

export async function signIn(email, password) {
  debugLog("signIn called but auth is disabled");
  return supa.auth.signInWithPassword({ email, password });
}

export async function signOut() {
  debugLog("signOut called but auth is disabled");
  return supa.auth.signOut();
}

export function onAuth(callback) {
  debugLog("onAuth called but auth is disabled");
  return supa.auth.onAuthStateChange((_e, s) => {
    debugLog("Auth state change ignored - system disabled");
    // Don't call the callback to prevent any DOM manipulation
  });
}
