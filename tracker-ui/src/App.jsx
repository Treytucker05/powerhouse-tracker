import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { supabase } from './lib/supabaseClient'
import Dashboard from './pages/Dashboard'
import Workouts from './pages/Workouts'
import VolumeChart from './pages/VolumeChart'
import Settings from './pages/Settings'

function App() {
  const [count, setCount] = useState(0)

  React.useEffect(() => {
    supabase.from('workout_sessions').select('*').limit(1)
      .then(({ error }) => {
        if (error) console.error('Supabase test error:', error.message);
        else console.log('✅ Supabase connection successful');
      });
  }, []);

  return (
    <Router>
      <nav className="p-4 bg-slate-100 flex gap-4">
        <Link to="/" className="font-medium">Dashboard</Link>
        <Link to="/workouts" className="font-medium">Workouts</Link>
        <Link to="/volume" className="font-medium">Volume Chart</Link>
        <Link to="/settings" className="font-medium">Settings</Link>
      </nav>
      
      <div className="p-4">
        <div>
          <a href="https://vite.dev" target="_blank">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        <h1 className="text-emerald-600 text-3xl font-bold">
          Vite + React + Tailwind
        </h1>
        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
          <p>
            Edit <code>src/App.jsx</code> and save to test HMR
          </p>
        </div>
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
        
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="/volume" element={<VolumeChart />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
