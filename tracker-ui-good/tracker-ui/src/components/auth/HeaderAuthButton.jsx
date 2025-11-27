import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { useApp } from '@/context/AppContext';

export default function HeaderAuthButton() {
    const { user } = useApp();
    const navigate = useNavigate();

    const handleClick = async () => {
        if (user) {
            await supabase.auth.signOut();
            navigate('/login');
        } else {
            navigate('/login');
        }
    };

    return (
        <button
            data-testid="auth-header-btn"
            onClick={handleClick}
            className="px-3 py-1 text-sm rounded bg-red-600 text-white hover:bg-red-700"
        >
            {user ? 'Sign out' : 'Sign in'}
        </button>
    );
}
