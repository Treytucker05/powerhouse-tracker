import React from 'react';

const colors = { 
  accum: "bg-blue-500/80", 
  deload: "bg-green-500/60",
  maintain: "bg-gray-500/60", 
  cut: "bg-red-500/70",
  bulk: "bg-purple-500/70",
  specialization: "bg-orange-500/80"
};

export default function PhaseTimeline({ plan }) {
  if (!plan || !plan.phases) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-2">No Plan Generated</h2>
          <p className="text-gray-400">There was an issue generating your macrocycle plan.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-4">
            Your Macrocycle Plan
          </h1>
          <p className="text-gray-300 text-lg">
            {plan.totalWeeks}-week {plan.planType} training program
          </p>
          <div className="flex items-center justify-center space-x-6 mt-4">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span className="text-blue-400 font-medium text-sm">{plan.phases.length} Phases</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span className="text-green-400 font-medium text-sm">
                Created {new Date(plan.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Phase Timeline */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Phase Timeline</h2>
          
          <div className="flex overflow-x-auto gap-4 p-4 min-h-[300px]">
            {plan.phases.map((phase, index) => (
              <div 
                key={phase.id}
                className={`min-w-64 rounded-xl p-6 shadow-xl transition-all duration-200 hover:scale-105 ${colors[phase.type] || colors.accum} border border-white/10`}
              >
                {/* Phase Header */}
                <div className="text-center mb-4">
                  <div className="text-3xl mb-2">
                    {phase.type === 'accum' && '📈'}
                    {phase.type === 'deload' && '🌱'}
                    {phase.type === 'cut' && '🔥'}
                    {phase.type === 'bulk' && '💪'}
                    {phase.type === 'maintain' && '⚖️'}
                    {phase.type === 'specialization' && '⭐'}
                  </div>
                  <h3 className="font-bold text-white text-lg">{phase.title}</h3>
                  <p className="text-white/80 text-sm">{phase.lengthWeeks} weeks</p>
                </div>

                {/* Phase Details */}
                <div className="space-y-3">
                  <div className="text-center">
                    <span className="px-3 py-1 bg-white/20 rounded-full text-white text-xs font-medium uppercase">
                      {phase.type}
                    </span>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-white/90 text-sm font-medium">Diet: {phase.diet}</p>
                  </div>

                  {phase.focus && phase.focus.length > 0 && (
                    <div>
                      <p className="text-white/70 text-xs italic text-center mb-2">
                        Focus: {phase.focus.join(", ")}
                      </p>
                    </div>
                  )}

                  {phase.description && (
                    <p className="text-white/70 text-xs text-center">
                      {phase.description}
                    </p>
                  )}

                  {/* Volume Modifier */}
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-white/70 text-xs">Volume</span>
                      <span className="text-white text-xs font-medium">
                        {Math.round(phase.volumeModifier * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div 
                        className="bg-white h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.round(phase.volumeModifier * 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Phase Number */}
                  <div className="text-center mt-4">
                    <span className="text-white/50 text-xs">
                      Phase {index + 1} of {plan.phases.length}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Plan Summary */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-white font-semibold text-lg mb-4 flex items-center">
              <span className="mr-2">📊</span> Plan Overview
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Total Duration:</span>
                <span className="text-white">{plan.totalWeeks} weeks</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Plan Type:</span>
                <span className="text-white capitalize">{plan.planType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Number of Phases:</span>
                <span className="text-white">{plan.phases.length}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-white font-semibold text-lg mb-4 flex items-center">
              <span className="mr-2">📈</span> Phase Breakdown
            </h3>
            <div className="space-y-2 text-sm">
              {plan.phases.map((phase, index) => (
                <div key={phase.id} className="flex justify-between">
                  <span className="text-gray-400">{phase.title}:</span>
                  <span className="text-white">{phase.lengthWeeks}w</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-white font-semibold text-lg mb-4 flex items-center">
              <span className="mr-2">🎯</span> Next Steps
            </h3>
            <div className="space-y-3 text-sm text-gray-300">
              <p>• Review each phase details</p>
              <p>• Set up your training schedule</p>
              <p>• Begin with Phase 1: {plan.phases[0]?.title}</p>
              <p>• Track progress and adjust as needed</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mt-8">
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-xl 
              transition-all duration-200"
          >
            Create New Plan
          </button>
          <button
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 
              text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02]"
          >
            Start Training
          </button>
        </div>
      </div>
    </div>
  );
}
