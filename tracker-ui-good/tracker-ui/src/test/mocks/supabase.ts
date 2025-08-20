export const supabaseMock = {
    auth: {
        getSession: async () => ({ data: { session: null }, error: null })
    },
    from: () => ({
        select: () => ({
            order: () => ({
                eq: () => ({ data: [], error: null }),
                data: [],
                error: null
            })
        }),
        insert: () => ({ select: () => ({ single: () => ({ data: { id: 'sup-123' }, error: null }) }) })
    })
};
