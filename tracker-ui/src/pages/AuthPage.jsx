import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

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
    <div className="min-h-screen bg-gradient-to-br from-primary-black via-rich-black to-primary-black flex items-center justify-center p-4 lg:p-8">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-red/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative w-full max-w-6xl grid lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left Side - Branding & Features */}
        <div className="hidden lg:flex flex-col justify-center space-y-8 p-8 lg:p-12">
          {/* PowerHouse Branding */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-red to-accent-red rounded-xl shadow-2xl"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-primary-red to-accent-red rounded-xl opacity-50 blur-lg"></div>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-pure-white to-off-white bg-clip-text text-transparent">
                  PowerHouse
                </h1>
                <p className="text-primary-red font-semibold tracking-wider text-sm uppercase">
                  ATX
                </p>
              </div>
            </div>
            <p className="text-xl text-gray-300 font-medium leading-relaxed">
              Your intelligent training companion for optimal muscle development
            </p>
          </div>

          {/* Features List */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white mb-6">Why PowerHouse?</h3>
            <div className="space-y-4">
              {[
                { icon: '🎯', title: 'Smart Volume Progression', desc: 'AI-driven training load optimization' },
                { icon: '📊', title: 'Advanced Analytics', desc: 'Deep insights into your progress' },
                { icon: '🧠', title: 'Intelligent Recommendations', desc: 'Personalized training suggestions' },
                { icon: '💾', title: 'Cloud Sync', desc: 'Access your data anywhere, anytime' }
              ].map((feature, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <span className="text-2xl">{feature.icon}</span>
                  <div>
                    <h4 className="text-white font-semibold text-lg">{feature.title}</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md">
            {/* Mobile Branding */}
            <div className="lg:hidden text-center mb-8">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-red to-accent-red rounded-lg shadow-lg"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-red to-accent-red rounded-lg opacity-30 blur-lg"></div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-pure-white to-off-white bg-clip-text text-transparent">
                    PowerHouse ATX
                  </h1>
                </div>
              </div>
              <p className="text-gray-300 text-sm">Your intelligent training companion</p>
            </div>

            {/* Auth Card */}
            <div className="bg-rich-black/80 backdrop-blur-xl border border-accent/20 rounded-2xl shadow-2xl p-8 space-y-6">
              {/* Tab Navigation */}
              <div className="flex bg-primary-black/50 rounded-xl p-1 mb-6">
                <button
                  onClick={() => {
                    setIsSignUp(false);
                    setError('');
                    setMessage('');
                  }}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                    !isSignUp
                      ? 'bg-accent text-white shadow-lg shadow-accent/30'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setIsSignUp(true);
                    setError('');
                    setMessage('');
                  }}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                    isSignUp
                      ? 'bg-accent text-white shadow-lg shadow-accent/30'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Input */}
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 bg-primary-black/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-red focus:border-transparent transition-all duration-300"
                  />
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                    minLength={6}
                    className="w-full px-4 py-3 bg-primary-black/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-red focus:border-transparent transition-all duration-300"
                  />
                </div>

                {/* Confirm Password Input (Sign Up Only) */}
                {isSignUp && (
                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                      Confirm Password
                    </label>
                    <input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      placeholder="Confirm your password"
                      minLength={6}
                      className="w-full px-4 py-3 bg-primary-black/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-red focus:border-transparent transition-all duration-300"
                    />
                  </div>
                )}

                {/* Error/Success Messages */}
                {error && (
                  <div className="p-4 bg-red-900/50 border border-red-600/50 rounded-xl text-red-200 text-sm">
                    {error}
                  </div>
                )}
                {message && (
                  <div className="p-4 bg-green-900/50 border border-green-600/50 rounded-xl text-green-200 text-sm">
                    {message}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-primary-red to-accent-red text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-red/30 focus:outline-none focus:ring-2 focus:ring-primary-red focus:ring-offset-2 focus:ring-offset-rich-black transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      <span>Loading...</span>
                    </div>
                  ) : (
                    isSignUp ? 'Create Account' : 'Sign In'
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="relative flex items-center justify-center py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-600"></div>
                </div>
                <div className="relative bg-rich-black px-4 text-sm text-gray-400">or continue with</div>
              </div>

              {/* Google Sign In */}
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full py-4 bg-white/10 hover:bg-white/20 border border-gray-600 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Continue with Google</span>
              </button>

              {/* Forgot Password */}
              {!isSignUp && (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    disabled={loading}
                    className="text-sm text-gray-400 hover:text-primary-red transition-colors duration-300"
                  >
                    Forgot your password?
                  </button>
                </div>
              )}

              {/* Switch Auth Mode */}
              <div className="text-center text-sm text-gray-400">
                {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError('');
                    setMessage('');
                  }}
                  className="text-accent hover:text-accent font-semibold transition-colors duration-300"
                >
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
