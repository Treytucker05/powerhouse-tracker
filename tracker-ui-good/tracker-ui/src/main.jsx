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
import { SettingsProvider as BookSettingsProvider } from './store/settingsStore'
import { EquipmentProvider } from './store/equipmentStore'
import { ScheduleProvider } from './store/scheduleStore'
import { CalendarProvider } from './store/calendarStore'
import { ProgressionProvider } from './store/progressionStore'
import { FinalPlanProvider } from './store/finalPlanStore'
import { Step3Provider } from './store/step3Store'
import ErrorBoundary from './components/ErrorBoundary.jsx'

// Ensure dark mode is always enabled
document.documentElement.classList.add('dark');


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
          <BookSettingsProvider>
            <EquipmentProvider>
              <ScheduleProvider>
                <Step3Provider>
                  <ProgressionProvider>
                    <CalendarProvider>
                      <FinalPlanProvider>
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
                      </FinalPlanProvider>
                    </CalendarProvider>
                  </ProgressionProvider>
                </Step3Provider>
              </ScheduleProvider>
            </EquipmentProvider>
          </BookSettingsProvider>
        </SettingsProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>,
)
