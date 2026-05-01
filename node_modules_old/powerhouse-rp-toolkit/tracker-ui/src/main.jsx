import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { TrainingStateProvider } from './context/trainingStateContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TrainingStateProvider>
      <App />
    </TrainingStateProvider>
  </StrictMode>,
)
