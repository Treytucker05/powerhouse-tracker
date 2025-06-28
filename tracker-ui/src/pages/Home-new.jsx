import React from 'react';
import SimpleVolumeChart from '../components/dashboard/SimpleVolumeChart';
import TrainingStatusCard from '../components/dashboard/TrainingStatusCard';
import DashboardCard from '../components/ui/DashboardCard';

function QuickStatsCard() {
  return (
    <DashboardCard>
      <h2 className="text-xl font-semibold text-accent mb-4">📊 Quick Stats</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-accent">142</div>
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
    </DashboardCard>
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
    <>
      {/* Welcome Header */}
      <DashboardCard className="col-full">
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome back, <span className="text-accent">Trey</span>! 💪
        </h1>
        <p className="text-gray-400">Ready to crush your training goals today?</p>
      </DashboardCard>

      <QuickStatsCard />
      
      <DashboardCard>
        <TrainingStatusCard />
      </DashboardCard>

      {/* Volume Chart */}
      <DashboardCard className="col-full">
        <SimpleVolumeChart data={sampleVolumeData} />
      </DashboardCard>
    </>
  );
}
