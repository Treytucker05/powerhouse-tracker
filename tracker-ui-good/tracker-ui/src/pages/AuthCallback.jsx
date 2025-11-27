import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';

export default function AuthCallback() {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    useEffect(() => {
        (async () => {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (session?.user) {
                navigate('/hub', { replace: true });
            } else if (error) {
                setError(error.message);
            } else {
                setError('No active session. Try signing in again.');
            }
        })();
    }, [navigate]);
    return (
        <div className="p-6 text-sm text-gray-200">
            <h1 className="text-xl mb-2">Authenticating…</h1>
            {!error && <div>Completing sign-in…</div>}
            {error && <div className="text-red-400">{error} <a className="underline" href="/login">Go to Login</a></div>}
        </div>
    );
}
