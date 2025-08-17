import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/api/supabaseClient';
import { useNavigate } from 'react-router-dom';
// Auth page now uses the global app theme utility classes (tailwind style) for consistency

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        navigate('/');
      }
    };
    checkUser();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      if (isSignUp) {
        // Sign up validation
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match');
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters');
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        if (data.user && !data.user.email_confirmed_at) {
          setMessage('Check your email for the confirmation link!');
        } else {
          // User is signed up and confirmed, redirect to home
          navigate('/');
        }
      } else {        // Sign in
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        // Redirect to home after successful sign in
        navigate('/');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError('');

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/tracker`
        }
      });

      if (error) throw error;
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email first');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const { error } = await supabase.auth.resetPasswordForEmail(email);

      if (error) throw error;

      setMessage('Password reset email sent! Check your inbox.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center px-4 py-10 text-gray-100">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-10 items-start">
        {/* Left: Form Card */}
        <div className="w-full max-w-md mx-auto bg-gray-800/70 border border-gray-700 rounded-xl shadow-lg backdrop-blur-sm p-8 space-y-8">
          <header className="space-y-2 text-center">
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
              PowerHouse Tracker
            </h1>
            <p className="text-sm text-gray-400">Your intelligent training companion</p>
          </header>

          {/* Auth Mode Switch */}
          <div className="flex rounded-lg overflow-hidden border border-gray-600 bg-gray-900/60 text-sm font-medium">
            <button
              type="button"
              onClick={() => { setIsSignUp(false); setError(''); setMessage(''); }}
              className={`flex-1 px-4 py-2 transition-colors ${!isSignUp ? 'bg-blue-600 text-white' : 'hover:bg-gray-700 text-gray-300'}`}
            >Sign In</button>
            <button
              type="button"
              onClick={() => { setIsSignUp(true); setError(''); setMessage(''); }}
              className={`flex-1 px-4 py-2 transition-colors ${isSignUp ? 'bg-blue-600 text-white' : 'hover:bg-gray-700 text-gray-300'}`}
            >Sign Up</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label htmlFor="email" className="text-xs uppercase tracking-wide text-gray-400">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full rounded-md bg-gray-900/70 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-600/40 px-3 py-2 text-sm outline-none transition"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="password" className="text-xs uppercase tracking-wide text-gray-400">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                minLength={6}
                className="w-full rounded-md bg-gray-900/70 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-600/40 px-3 py-2 text-sm outline-none transition"
              />
            </div>
            {isSignUp && (
              <div className="space-y-1">
                <label htmlFor="confirmPassword" className="text-xs uppercase tracking-wide text-gray-400">Confirm Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  minLength={6}
                  className="w-full rounded-md bg-gray-900/70 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-600/40 px-3 py-2 text-sm outline-none transition"
                />
              </div>
            )}

            {error && <div className="text-sm rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-red-300">{error}</div>}
            {message && <div className="text-sm rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-emerald-300">{message}</div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-md bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors px-4 py-2 text-sm font-medium shadow-md shadow-blue-900/40"
            >
              {loading ? 'Processing…' : (isSignUp ? 'Create Account' : 'Sign In')}
            </button>
          </form>

          <div className="flex items-center gap-3 my-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-600 to-transparent" />
            <span className="text-[10px] uppercase tracking-wider text-gray-400">or</span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-600 to-transparent" />
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full group flex items-center justify-center gap-3 rounded-md border border-gray-600 bg-gray-900/60 hover:border-blue-500/60 hover:bg-gray-800 transition px-4 py-2 text-sm font-medium"
          >
            <span className="inline-flex items-center gap-2">
              <svg viewBox="0 0 24 24" width="18" height="18" className="group-hover:scale-105 transition-transform">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </span>
          </button>

          {!isSignUp && (
            <div className="flex justify-end mt-2">
              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={loading}
                className="text-xs text-blue-400 hover:text-blue-300 transition disabled:opacity-50"
              >Forgot your password?</button>
            </div>
          )}

          <div className="text-center text-sm text-gray-400 pt-4 border-t border-gray-700/70">
            {isSignUp ? 'Already have an account? ' : "Need an account? "}
            <button
              type="button"
              onClick={() => { setIsSignUp(!isSignUp); setError(''); setMessage(''); }}
              className="text-blue-400 hover:text-blue-300 font-medium transition"
            >{isSignUp ? 'Sign In' : 'Create one'}</button>
          </div>
        </div>

        {/* Right: Feature Highlights */}
        <div className="hidden lg:flex flex-col gap-6 p-6 rounded-xl bg-gray-800/40 border border-gray-700 backdrop-blur-sm shadow-inner">
          <div>
            <h2 className="text-xl font-semibold tracking-tight mb-2">Why PowerHouse?</h2>
            <p className="text-sm text-gray-400 leading-relaxed">Purpose-built tooling to design, adapt, and execute evidence-based strength training cycles with clarity and precision.</p>
          </div>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-3"><span className="text-blue-400">🎯</span><span>Adaptive volume & intensity progression with clear guardrails.</span></li>
            <li className="flex gap-3"><span className="text-blue-400">📊</span><span>Macro → micro cycle visibility & readiness context.</span></li>
            <li className="flex gap-3"><span className="text-blue-400">🧠</span><span>Context aware recommendations (goals, experience, recovery).</span></li>
            <li className="flex gap-3"><span className="text-blue-400">📈</span><span>Historical performance trends & PR trajectory insights.</span></li>
            <li className="flex gap-3"><span className="text-blue-400">💾</span><span>Automatic cloud sync + offline-safe local caching.</span></li>
            <li className="flex gap-3"><span className="text-blue-400">�</span><span>Secure auth & privacy-first data handling.</span></li>
          </ul>
          <div className="mt-auto pt-4 text-xs text-gray-500 border-t border-gray-700/60">
            By signing in you agree to basic data usage for program personalization.
          </div>
        </div>
      </div>
    </div>
  );
}
