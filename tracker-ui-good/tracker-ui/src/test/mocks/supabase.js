// Global Supabase mock used by tests to avoid network calls and keep deterministic results
// Override per-test as needed for specific scenarios.
export const supabaseMock = {
    auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
        getUser: async () => ({ data: { user: null }, error: null }),
        onAuthStateChange: (cb) => {
            try { cb?.('SIGNED_OUT', { session: null }); } catch { }
            return { data: { subscription: { unsubscribe: () => { } } } };
        },
        signOut: async () => ({ error: null }),
    },
    from: () => ({
        insert: () => ({ data: [{ id: 'sup-123' }], error: null }),
        upsert: () => ({ data: [{ id: 'sup-123' }], error: null }),
        select: () => ({ data: [], error: null }),
        order: () => ({ data: [], error: null }),
        single: () => ({ data: null, error: { message: 'Not found' } }),
        eq: () => ({ data: [], error: null }),
        gte: () => ({ data: [], error: null }),
        lte: () => ({ data: [], error: null }),
    }),
};

export function createSupabaseMock(overrides = {}) {
    return { ...supabaseMock, ...overrides };
}
