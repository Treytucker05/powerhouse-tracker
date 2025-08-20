import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function AuthDebug() {
    const [debugInfo, setDebugInfo] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const runDebug = async () => {
            try {
                console.log('AuthDebug: Starting debug checks...');

                // Check environment variables
                const envCheck = {
                    NODE_ENV: process.env.NODE_ENV,
                    hasViteSupabaseUrl: !!import.meta.env.VITE_SUPABASE_URL,
                    hasViteSupabaseKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
                    actualSupabaseUrl: import.meta.env.VITE_SUPABASE_URL || 'USING_FALLBACK',
                    actualSupabaseKey: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'DEFINED' : 'USING_FALLBACK',
                    allEnvKeys: Object.keys(import.meta.env).filter(key => key.startsWith('VITE_')),
                };

                // Check Supabase client configuration
                const clientCheck = {
                    supabaseExists: !!supabase,
                    supabaseUrl: supabase?.supabaseUrl || 'NOT_FOUND',
                    hasAuth: !!supabase?.auth,
                    isTestEnvironment: process.env.NODE_ENV === 'test',
                };

                // Try a simple auth operation and capture actual network behavior
                let authCheck = { error: null, session: null };
                try {
                    console.log('AuthDebug: Attempting getSession...');
                    const { data, error } = await supabase.auth.getSession();
                    authCheck = {
                        error: error?.message || null,
                        hasSession: !!data?.session,
                        networkSuccess: true
                    };
                    console.log('AuthDebug: getSession completed successfully');
                } catch (err) {
                    console.error('AuthDebug: getSession failed:', err);
                    authCheck = {
                        error: err.message,
                        networkSuccess: false,
                        errorType: err.name
                    };
                }

                setDebugInfo({
                    env: envCheck,
                    client: clientCheck,
                    auth: authCheck,
                    timestamp: new Date().toISOString(),
                    userAgent: navigator.userAgent,
                    currentUrl: window.location.href
                });

                console.log('AuthDebug: Debug info collected:', {
                    env: envCheck,
                    client: clientCheck,
                    auth: authCheck
                });

            } catch (err) {
                console.error('AuthDebug: Error during debug:', err);
                setDebugInfo({ error: err.message });
            } finally {
                setLoading(false);
            }
        };

        runDebug();
    }, []);

    if (loading) {
        return <div className="p-4 text-white">Running enhanced auth debug checks...</div>;
    }

    return (
        <div className="p-4 text-white bg-gray-800 rounded-lg">
            <h3 className="text-lg font-bold mb-4">Enhanced Auth Debug Information</h3>
            <pre className="text-sm bg-gray-900 p-3 rounded overflow-auto max-h-96">
                {JSON.stringify(debugInfo, null, 2)}
            </pre>

            <div className="mt-4 space-y-2">
                <h4 className="font-semibold mb-2">Diagnosis:</h4>
                {!debugInfo.env?.hasViteSupabaseUrl && (
                    <div className="bg-red-900 text-red-200 p-2 rounded">
                        ❌ VITE_SUPABASE_URL is not defined - this will cause relative URL requests
                    </div>
                )}
                {!debugInfo.env?.hasViteSupabaseKey && (
                    <div className="bg-red-900 text-red-200 p-2 rounded">
                        ❌ VITE_SUPABASE_ANON_KEY is not defined - using fallback
                    </div>
                )}
                {debugInfo.env?.hasViteSupabaseUrl && debugInfo.env?.hasViteSupabaseKey && (
                    <div className="bg-green-900 text-green-200 p-2 rounded">
                        ✅ Environment variables are properly configured
                    </div>
                )}

                <div className="mt-4">
                    <h4 className="font-semibold mb-2">Network Requests Monitor</h4>
                    <p className="text-sm text-gray-300">
                        Check browser Dev Tools → Network tab for any requests to '/auth' endpoints.
                        Expected: Requests should go to 'cqjzvbvmpcqohjarcydg.supabase.co', not relative '/auth' paths.
                    </p>
                </div>
            </div>
        </div>
    );
}
