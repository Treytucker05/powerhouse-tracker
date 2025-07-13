import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { useApp } from './context'
import Assessment from './components/Assessment'

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
            <Routes>
                <Route path="/" element={
                    assessment ? (
                        <div className="min-h-screen bg-black text-white flex items-center justify-center">
                            <div className="text-center">
                                <h1 className="text-4xl font-bold mb-4">Welcome to PowerHouse Tracker</h1>
                                <p className="text-gray-400 mb-8">Your assessment is complete!</p>
                                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 max-w-md mx-auto">
                                    <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Goal:</span>
                                            <span className="text-white">{assessment.primaryGoal}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Experience:</span>
                                            <span className="text-white">{assessment.trainingExperience}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">System:</span>
                                            <span className="text-blue-400">{assessment.recommendedSystem}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <Assessment />
                    )
                } />
                <Route path="/assessment" element={<Assessment />} />
                {/* Add more routes here as needed */}
            </Routes>
        </div>
    )
}

export default App
