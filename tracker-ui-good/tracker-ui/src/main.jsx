import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HashRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { TrainingStateProvider } from './context/TrainingStateContext.jsx'
import { ExerciseDBProvider } from './contexts/ExerciseDBContext.jsx'
import { AppProvider } from './context/AppContext.jsx'
import { ToastProvider } from './components/ui/Toast.jsx'
import { SettingsProvider } from './contexts/SettingsContext.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

// Ensure dark mode is always enabled
document.documentElement.classList.add('dark');

// TEMPORARY DEBUG: Intercept fetch calls to detect any remaining '/auth' network request source.
// This wraps the global fetch before application code mounts. Remove once the source is identified.
(() => {
  if (typeof window !== 'undefined' && window.fetch && !window.__authFetchInterceptorInstalled) {
    const originalFetch = window.fetch;
    const loggedOnce = new Set();
    window.fetch = async function authDebugFetch(...args) {
      try {
        const [input, init] = args;
        const url = typeof input === 'string' ? input : (input && input.url) || '';
        if (url.includes('/auth')) {
          const method = (init && init.method) || (typeof input === 'object' && input.method) || 'GET';
          // Build a stable key to avoid duplicate noisy logs
          const key = method + ' ' + url;
          if (!loggedOnce.has(key)) {
            loggedOnce.add(key);
            const stack = new Error('Auth fetch trace').stack;
            // Attempt to classify whether this is an internal (same-origin) relative call
            const sameOrigin = (() => {
              try { return url.startsWith(location.origin) || (!/^https?:/i.test(url)); } catch { return false; }
            })();
            // Print a concise header + serialized details, then stack as plain text for immediate readability
            const when = new Date().toISOString();
            const header = `[AUTH FETCH DEBUG] ${when} -> ${method} ${url}`;
            const details = `sameOrigin=${sameOrigin}`;
            console.warn(header + ' ' + details);
            if (stack) {
              // Clean the stack: remove the first line (error message) for brevity
              const cleaned = stack.split('\n').filter((l, i) => i !== 0).join('\n');
              console.log('[AUTH FETCH DEBUG][STACK BEGIN]\n' + cleaned + '\n[AUTH FETCH DEBUG][STACK END]');
            }
          }
        }
        const response = await originalFetch.apply(this, args);
        return response;
      } catch (err) {
        console.warn('[AUTH FETCH DEBUG] fetch wrapper error (non-fatal):', err);
        // Fallback to original fetch if our wrapper logic failed early
        return originalFetch.apply(this, args);
      }
    };
    window.__restoreOriginalFetch = () => {
      window.fetch = originalFetch;
      console.info('[AUTH FETCH DEBUG] Original fetch restored.');
    };
    window.__authFetchInterceptorInstalled = true;
    console.info('[AUTH FETCH DEBUG] Fetch interceptor installed.');
  }
})();

// Global error handling for unhandled promises and runtime errors
window.addEventListener('unhandledrejection', event => {
  console.error('Unhandled promise rejection:', event.reason);
  // Prevent the default browser error handling
  event.preventDefault();
});

window.addEventListener('error', event => {
  console.error('Global error:', event.error || event.message);
});

// Handle browser extension runtime errors (common in dev tools)
if (typeof chrome !== 'undefined' && chrome.runtime) {
  const originalAddListener = chrome.runtime.onMessage?.addListener;
  if (originalAddListener) {
    chrome.runtime.onMessage.addListener = function (listener) {
      return originalAddListener.call(this, function (...args) {
        try {
          return listener(...args);
        } catch (error) {
          console.warn('Chrome extension message error (safe to ignore):', error);
        }
      });
    };
  }
}

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <SettingsProvider>
          <ExerciseDBProvider>
            <AppProvider>
              <TrainingStateProvider>
                <ToastProvider>
                  <HashRouter basename="/">
                    <App />
                  </HashRouter>
                </ToastProvider>
              </TrainingStateProvider>
            </AppProvider>
          </ExerciseDBProvider>
        </SettingsProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>,
)
