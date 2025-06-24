import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import NavBar from './components/NavBar'
import Dashboard from './pages/Dashboard'
import Workouts from './pages/Workouts'
import VolumeChart from './pages/VolumeChart'
import Settings from './pages/Settings'
import MesocycleNew from './pages/MesocycleNew'
import { TrainingStateProvider } from './context/trainingStateContext'
import ErrorBoundary from './components/ErrorBoundary'
import './App.css'

function App() {
  const [user, setUser] = useState(null);

  const handleSignOut = () => {
    setUser(null);
  };

  return (
    <ErrorBoundary>
      <TrainingStateProvider>
        <Router>
          <div className="min-h-screen bg-black">
            <NavBar user={user} onSignOut={handleSignOut} />
            
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/tracking" element={<Workouts />} />
              <Route path="/mesocycle" element={<MesocycleNew />} />
              <Route path="/microcycle" element={<VolumeChart />} />
              <Route path="/macrocycle" element={<Settings />} />
            </Routes>
          </div>
        </Router>
      </TrainingStateProvider>
    </ErrorBoundary>  )
}

export default App
