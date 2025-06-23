import React from 'react';
import PowerHouseVolumeChart from '../components/dashboard/PowerHouseVolumeChart';

function TrainingStatusCard() {
  return (
    <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700 shadow-lg">
      <h2 className="text-xl font-semibold text-offwhite mb-4">🎯 Current Training Status</h2>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-300">Week #:</span>
          <span className="text-primary font-semibold">3</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-300">Mesocycle Length:</span>
          <span className="text-offwhite font-medium">5 weeks</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-300">Block #:</span>
          <span className="text-offwhite font-medium">1</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-300">Target RIR:</span>
          <span className="text-accent font-semibold">2</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-300">Training Phase:</span>
          <span className="text-green-400 font-medium">Hypertrophy</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-300">Fatigue Rating:</span>
          <span className="text-yellow-400 font-semibold">Moderate</span>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-700">
        <button className="w-full bg-primary hover:bg-primary/90 text-black font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
          Update Status
        </button>
      </div>
    </div>
  );
}

function QuickStatsCard() {
  return (
    <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700 shadow-lg">
      <h2 className="text-xl font-semibold text-offwhite mb-4">📊 Quick Stats</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">142</div>
          <div className="text-sm text-gray-400">Total Sets</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400">8.5</div>
          <div className="text-sm text-gray-400">Avg RIR</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-accent">12</div>
          <div className="text-sm text-gray-400">Sessions</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-400">7.2</div>
          <div className="text-sm text-gray-400">RPE Avg</div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-offwhite mb-2">
          Welcome back, <span className="text-primary">Trey</span>! 💪
        </h1>
        <p className="text-gray-400">Ready to crush your training goals today?</p>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Volume Chart - Main Feature */}
        <div className="lg:col-span-8">
          <PowerHouseVolumeChart />
        </div>
        
        {/* Side Cards */}
        <div className="lg:col-span-4 space-y-6">
          <TrainingStatusCard />
          <QuickStatsCard />
        </div>
      </div>

      {/* Additional Action Cards */}
      <div className="grid gap-4 md:grid-cols-3 mt-8">
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-700 hover:border-primary/50 transition-colors cursor-pointer">
          <div className="text-lg font-semibold text-offwhite mb-2">🏋️ Start Workout</div>
          <div className="text-sm text-gray-400">Begin your training session</div>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-700 hover:border-primary/50 transition-colors cursor-pointer">
          <div className="text-lg font-semibold text-offwhite mb-2">📈 View Progress</div>
          <div className="text-sm text-gray-400">Check your improvements</div>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-700 hover:border-primary/50 transition-colors cursor-pointer">
          <div className="text-lg font-semibold text-offwhite mb-2">⚙️ Settings</div>
          <div className="text-sm text-gray-400">Customize your experience</div>
        </div>
      </div>
    </div>
  );
}
