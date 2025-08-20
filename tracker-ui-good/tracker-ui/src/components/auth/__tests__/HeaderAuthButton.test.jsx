import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, cleanup, act } from '@testing-library/react';

// Mocks
const navigateMock = vi.fn();
vi.mock('react-router-dom', () => ({ useNavigate: () => navigateMock }));
vi.mock('@/lib/supabaseClient', () => ({ supabase: { auth: { signOut: vi.fn(async () => ({})) } } }));
vi.mock('@/context/AppContext', () => ({ useApp: vi.fn() }));

import HeaderAuthButton from '../HeaderAuthButton.jsx';
import { useApp } from '@/context/AppContext';
import { supabase } from '@/lib/supabaseClient';

beforeEach(() => {
    cleanup();
    navigateMock.mockReset();
    supabase.auth.signOut.mockReset();
});

describe('HeaderAuthButton', () => {
    it('renders Sign in and navigates without signOut when no user', async () => {
        useApp.mockReturnValue({ user: null });
        const { getByTestId, getByText } = render(<HeaderAuthButton />);
        expect(getByText('Sign in')).toBeTruthy();
        fireEvent.click(getByTestId('auth-header-btn'));
        expect(supabase.auth.signOut).not.toHaveBeenCalled();
        expect(navigateMock).toHaveBeenCalledWith('/login');
    });

    it('renders Sign out and signs out then navigates when user present', async () => {
        useApp.mockReturnValue({ user: { id: 'u1' } });
        const { getAllByTestId, getByText } = render(<HeaderAuthButton />);
        expect(getByText('Sign out')).toBeTruthy();
        const btn = getAllByTestId('auth-header-btn')[0];
        await act(async () => { fireEvent.click(btn); });
        expect(supabase.auth.signOut).toHaveBeenCalledTimes(1);
        expect(navigateMock).toHaveBeenCalledWith('/login');
    });
});
