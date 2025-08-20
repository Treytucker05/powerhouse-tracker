import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function AuthUpdatePassword() {
    const [pw1, setPw1] = useState('');
    const [pw2, setPw2] = useState('');
    const [error, setError] = useState('');
    const [ok, setOk] = useState(false);
    const navigate = useNavigate();

    const submit = async (e) => {
        e.preventDefault();
        if (pw1 !== pw2) { setError('Passwords do not match'); return; }
        if (pw1.length < 6) { setError('Password must be at least 6 characters'); return; }
        const { error } = await supabase.auth.updateUser({ password: pw1 });
        if (error) { setError(error.message); return; }
        setOk(true);
        setTimeout(() => navigate('/hub'), 800);
    };

    return (
        <form onSubmit={submit} className="max-w-sm mx-auto p-6 space-y-4">
            <h1 className="text-lg font-semibold">Update Password</h1>
            <input type="password" placeholder="New password" value={pw1} onChange={e => setPw1(e.target.value)} className="w-full border rounded px-3 py-2" />
            <input type="password" placeholder="Confirm password" value={pw2} onChange={e => setPw2(e.target.value)} className="w-full border rounded px-3 py-2" />
            {error && <div className="text-red-500 text-sm">{error}</div>}
            {ok && <div className="text-green-500 text-sm">Updated! Redirecting…</div>}
            <button className="bg-red-600 text-white px-4 py-2 rounded" disabled={!pw1 || pw1 !== pw2}>Update</button>
        </form>
    );
}
