import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { useApp } from './context'
import Assessment from './components/Assessment'
import Program from './pages/Program'
import Auth from './pages/Auth'
import Navbar from './components/ui/Navbar'
import ProtectedRoute from './components/ui/ProtectedRoute'

function App() {
    const { user, assessment, loading } = useApp()

    if (loading.user) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-white text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-xl">Loading PowerHouse Tracker...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-black">
            <Navbar />
            <main className="pt-16">
                <Routes>
                    <Route path="/login" element={<Auth />} />
                    <Route path="/signup" element={<Auth />} />
                    <Route path="/" element={
                        <ProtectedRoute>
                            <div className="text-center py-12">
                                <h1 className="text-4xl font-bold text-white mb-4">Welcome to PowerHouse Tracker</h1>
                                <p className="text-gray-400 mb-8">Complete your assessment and build your program</p>
                                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 max-w-md mx-auto">
                                    <h2 className="text-xl font-semibold mb-4">Getting Started</h2>
                                    <p className="text-gray-300 mb-4">Click "Program Design" to start your integrated assessment and program building process.</p>
                                    <a
                                        href="/program"
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg inline-block transition-colors"
                                    >
                                        Start Program Design
                                    </a>
                                </div>
                            </div>
                        </ProtectedRoute>
                    } />
                    <Route path="/program" element={
                        <ProtectedRoute>
                            <Program />
                        </ProtectedRoute>
                    } />
                </Routes>
            </main>
        </div>
    )
}

export default App
