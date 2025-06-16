console.log("AUTH SYSTEM NUKED");

// Provide a minimal stub so anything expecting the Supabase client
// won't throw errors when auth is disabled. This avoids DOM access
// during initialization which previously caused crashes.
export const supa = {
  auth: {
    signUp: async () => ({ data: null, error: new Error("Auth disabled") }),
    signInWithPassword: async () => ({ data: null, error: new Error("Auth disabled") }),
    signOut: async () => ({ error: new Error("Auth disabled") }),
    onAuthStateChange: () => {
      console.log("Auth system disabled; onAuthStateChange ignored.");
      return { data: null };
    },
  },
};

/* ---------- Auth helpers ---------- */
// export async function signUp(email, password) {
//   return supa.auth.signUp({ email, password });
// }

// export async function signIn(email, password) {
//   return supa.auth.signInWithPassword({ email, password });
// }

// export async function signOut() {
//   return supa.auth.signOut();
// }

// export function onAuth(callback) {
//   return console.log("Auth functionality temporarily disabled for debugging");
//   return supa.auth.onAuthStateChange((_e, s) => {
//     console.log("onAuth change:", s);
//     callback(s);
//   });
// }
