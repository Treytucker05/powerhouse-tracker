import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '@/context/AppContext';

export default function AuthPage() {
  const [tab, setTab] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useApp();
  const base = (import.meta.env && import.meta.env.BASE_URL) ? import.meta.env.BASE_URL : '/';

  // Compute target after auth: next query param or Dashboard
  const getNextPath = () => {
    try {
      const params = new URLSearchParams(location.search);
      const next = params.get('next');
      const target = next && next.startsWith('/') ? next : '/';
      return target === '/hub' ? '/' : target;
    } catch {
      return '/';
    }
  };

  useEffect(() => { if (user) navigate(getNextPath(), { replace: true }); }, [user, navigate, location.search]);

  const handleSignIn = async (e) => {
    e.preventDefault(); setLoading(true); setError('');
    try { const { error } = await supabase.auth.signInWithPassword({ email, password }); if (error) throw error; navigate(getNextPath()); }
    catch (err) { setError(err.message); } finally { setLoading(false); }
  };
  const handleSignUp = async (e) => {
    e.preventDefault(); setLoading(true); setError(''); setMessage('');
    try {
      if (password !== confirmPassword) throw new Error('Passwords do not match'); if (password.length < 6) throw new Error('Password must be at least 6 characters');
      const redirectTo = `${window.location.origin}${base}#/auth/callback`;
      const { data, error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: redirectTo } }); if (error) throw error; if (data.user) setMessage('Check your email to confirm your account.');
    }
    catch (err) { setError(err.message); } finally { setLoading(false); }
  };
  const handleReset = async (e) => {
    e.preventDefault(); setLoading(true); setError(''); setMessage('');
    try { const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}${base}#/auth/update-password` }); if (error) throw error; setMessage('Password reset email sent.'); }
    catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  const handleGoogleSignIn = async () => {
    try { setLoading(true); setError(''); const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}${base}#/auth/callback` } }); if (error) throw error; }
    catch (err) { setError(err.message); setLoading(false); }
  };

  const activeForm = tab === 'signin' ? (
    <form onSubmit={handleSignIn} data-testid="auth-signin" className="space-y-4">
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full border rounded px-3 py-2" />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full border rounded px-3 py-2" />
      <button disabled={loading} className="w-full bg-red-600 text-white py-2 rounded">{loading ? 'Signing in...' : 'Sign in'}</button>
    </form>
  ) : tab === 'signup' ? (
    <form onSubmit={handleSignUp} data-testid="auth-signup" className="space-y-4">
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full border rounded px-3 py-2" />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full border rounded px-3 py-2" />
      <input type="password" placeholder="Confirm" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="w-full border rounded px-3 py-2" />
      <button disabled={loading} className="w-full bg-red-600 text-white py-2 rounded">{loading ? 'Creating...' : 'Create account'}</button>
    </form>
  ) : (
    <form onSubmit={handleReset} data-testid="auth-reset" className="space-y-4">
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full border rounded px-3 py-2" />
      <button disabled={loading} className="w-full bg-red-600 text-white py-2 rounded">{loading ? 'Sending...' : 'Send reset link'}</button>
    </form>
  );

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-white">PowerHouse Tracker</h1>
      <div className="flex gap-2 text-sm">
        {['signin', 'signup', 'reset'].map(t => (
          <button key={t} onClick={() => { setTab(t); setError(''); setMessage(''); }} className={`px-3 py-1 rounded ${tab === t ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300'}`}>{t === 'signin' ? 'Sign in' : t === 'signup' ? 'Create account' : 'Reset'}</button>
        ))}
      </div>
      {error && <div className="text-red-400 text-sm">{error}</div>}
      {message && <div className="text-green-400 text-sm">{message}</div>}
      {activeForm}
      <div className="text-center text-xs text-gray-400">or</div>
      <button onClick={handleGoogleSignIn} disabled={loading} className="w-full flex items-center justify-center gap-2 bg-white text-gray-800 border rounded py-2 text-sm">
        <svg viewBox="0 0 24 24" width="20" height="20">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        Continue with Google
      </button>
    </div>
  );
}
