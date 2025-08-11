import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.jsx'
import { TrainingStateProvider } from './context/TrainingStateContext.jsx'
import { AppProvider } from './context/AppContext.jsx'

// Ensure dark mode is always enabled
document.documentElement.classList.add('dark');

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
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <TrainingStateProvider>
          <App />
        </TrainingStateProvider>
      </AppProvider>
    </QueryClientProvider>
  </StrictMode>,
)
