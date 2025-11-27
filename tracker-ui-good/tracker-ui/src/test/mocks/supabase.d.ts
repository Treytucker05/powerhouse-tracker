declare module './supabase.js' {
    export const supabaseMock: any;
    export function createSupabaseMock(overrides?: Record<string, any>): any;
}
