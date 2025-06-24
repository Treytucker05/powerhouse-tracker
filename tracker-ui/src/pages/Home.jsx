import React from 'react';
import SimpleVolumeChart from '../components/dashboard/SimpleVolumeChart';
import TrainingStatusCard from '../components/dashboard/TrainingStatusCard';

function QuickStatsCard() {
  return (
    <div className="card-powerhouse">
      <h2 className="text-xl font-semibold text-red-500 mb-4">📊 Quick Stats</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-red-500">142</div>
          <div className="text-sm text-gray-400">Total Sets</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400">8.5</div>
          <div className="text-sm text-gray-400">Avg RIR</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-400">12</div>
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
  // Sample data for the volume chart
  const sampleVolumeData = {
    'Chest': 12,
    'Shoulders': 8,
    'Biceps': 6,
    'Triceps': 8,
    'Lats': 10,
    'Mid-Traps': 6,
    'Rear Delts': 4,
    'Abs': 8,
    'Glutes': 12,
    'Quads': 16,
    'Hamstrings': 10,
    'Calves': 6,
    'Forearms': 4,
    mev: {
      'Chest': 8, 'Shoulders': 6, 'Biceps': 6, 'Triceps': 6, 'Lats': 10,
      'Mid-Traps': 4, 'Rear Delts': 4, 'Abs': 4, 'Glutes': 8, 'Quads': 10,
      'Hamstrings': 8, 'Calves': 6, 'Forearms': 4
    },
    mrv: {
      'Chest': 22, 'Shoulders': 20, 'Biceps': 16, 'Triceps': 18, 'Lats': 25,
      'Mid-Traps': 12, 'Rear Delts': 12, 'Abs': 16, 'Glutes': 16, 'Quads': 25,
      'Hamstrings': 20, 'Calves': 16, 'Forearms': 12
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome back, <span className="text-red-500">Trey</span>! 💪
        </h1>
        <p className="text-gray-400">Ready to crush your training goals today?</p>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Volume Chart - Main Feature */}
        <div className="lg:col-span-8">
          <SimpleVolumeChart data={sampleVolumeData} />
        </div>
        
        {/* Side Cards */}
        <div className="lg:col-span-4 space-y-6">
          <TrainingStatusCard />
          <QuickStatsCard />
        </div>
      </div>

      {/* Additional Action Cards */}
      <div className="grid gap-4 md:grid-cols-3 mt-8">
        <div className="card-powerhouse hover:border-red-500/50 transition-colors cursor-pointer">
          <div className="text-lg font-semibold text-white mb-2">🏋️ Start Workout</div>
          <div className="text-sm text-gray-400">Begin your training session</div>
        </div>
        <div className="card-powerhouse hover:border-red-500/50 transition-colors cursor-pointer">
          <div className="text-lg font-semibold text-white mb-2">📈 View Progress</div>
          <div className="text-sm text-gray-400">Check your improvements</div>
        </div>
        <div className="card-powerhouse hover:border-red-500/50 transition-colors cursor-pointer">
          <div className="text-lg font-semibold text-white mb-2">⚙️ Settings</div>
          <div className="text-sm text-gray-400">Customize your experience</div>
        </div>
      </div>
    </div>
  );
}
