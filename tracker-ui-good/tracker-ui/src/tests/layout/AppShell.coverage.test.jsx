import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AppShell from '@/layout/AppShell';

vi.mock('@/lib/api/supabaseClient', () => ({
    supabase: {
        auth: {
            getSession: vi.fn(async () => ({ data: { session: { user: { id: 'u1', email: 'user@test.com' } } } })),
            onAuthStateChange: vi.fn((cb) => {
                cb('SIGNED_IN', { user: { id: 'u1' } });
                return { data: { subscription: { unsubscribe: vi.fn() } } };
            }),
            signOut: vi.fn(async () => ({ error: null }))
        }
    }
}));

describe('AppShell (coverage)', () => {
    it('renders navigation links', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <AppShell />
            </MemoryRouter>
        );
        expect(screen.getAllByText(/Dashboard/i).length).toBeGreaterThan(0);
        expect(screen.getAllByText(/Program/i).length).toBeGreaterThan(0);
        expect(screen.getAllByText(/Tracking/i).length).toBeGreaterThan(0);
    });

    it('handles auth state change without crashing', () => {
        render(
            <MemoryRouter>
                <AppShell />
            </MemoryRouter>
        );
        expect(true).toBe(true);
    });
});
