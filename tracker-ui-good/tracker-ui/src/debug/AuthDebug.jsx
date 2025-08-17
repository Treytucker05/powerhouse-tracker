import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/api/supabaseClient';

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
          actualSupabaseUrl: import.meta.env.VITE_SUPABASE_URL || 'FALLBACK',
        };
        
        // Check Supabase client configuration
        const clientCheck = {
          supabaseExists: !!supabase,
          supabaseUrl: supabase?.supabaseUrl || 'NOT_FOUND',
          hasAuth: !!supabase?.auth,
        };
        
        // Try a simple auth operation
        let authCheck = { error: null, session: null };
        try {
          const { data, error } = await supabase.auth.getSession();
          authCheck = { error: error?.message || null, hasSession: !!data?.session };
        } catch (err) {
          authCheck = { error: err.message };
        }
        
        setDebugInfo({
          env: envCheck,
          client: clientCheck,
          auth: authCheck,
          timestamp: new Date().toISOString()
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
    return <div className="p-4 text-white">Running auth debug checks...</div>;
  }

  return (
    <div className="p-4 text-white bg-gray-800 rounded-lg">
      <h3 className="text-lg font-bold mb-4">Auth Debug Information</h3>
      <pre className="text-sm bg-gray-900 p-3 rounded overflow-auto">
        {JSON.stringify(debugInfo, null, 2)}
      </pre>
      
      <div className="mt-4">
        <h4 className="font-semibold mb-2">Network Requests Monitor</h4>
        <p className="text-sm text-gray-300">
          Check browser Dev Tools → Network tab for any requests to '/auth' endpoints.
          Expected: Requests should go to 'cqjzvbvmpcqohjarcydg.supabase.co', not relative '/auth' paths.
        </p>
      </div>
    </div>
  );
}
