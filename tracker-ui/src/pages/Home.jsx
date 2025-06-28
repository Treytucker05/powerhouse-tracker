import React from 'react';
import SimpleVolumeChart from '../components/dashboard/SimpleVolumeChart';
import TrainingStatusCard from '../components/dashboard/TrainingStatusCard';
import TrainingSplitOverview from '../components/dashboard/TrainingSplitOverview';
import UpcomingSessionsPreview from '../components/dashboard/UpcomingSessionsPreview';

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
    <div className="space-y-6 overflow-hidden px-4 sm:px-6 lg:px-8 min-h-screen" style={{
      background: 'linear-gradient(135deg, #1C1C1C 0%, #0A0A0A 100%)'
    }}>
      {/* Premium Welcome Header */}
      <div className="pt-6 text-center">
        <h1 className="text-4xl font-bold" style={{
          background: 'linear-gradient(135deg, #FFF 0%, #FAFAFA 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Welcome back, <span className="text-accent-red" style={{ textShadow: '0 0 10px rgba(239, 68, 68, 0.3)' }}>Trey</span>! 💪
        </h1>
        <p className="text-gray-400 opacity-80 text-lg">Ready to crush your training goals today?</p>
        <div className="mt-6 w-32 h-px bg-gradient-to-r from-transparent via-accent-red to-transparent mx-auto opacity-50"></div>
      </div>

      {/* Volume Chart - Hero Section */}
      <div className="max-w-4xl mx-auto">
        <div className="py-6 px-6">
          <div className="premium-card">
            <SimpleVolumeChart data={sampleVolumeData} />
          </div>
        </div>
      </div>

      {/* Main Dashboard - Secondary Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Dashboard Cards - Clean Layout */}
        <div className="space-y-8">
          {/* Primary Card - Training Status (Full Width) */}
          <div className="w-full">
            <div className="min-h-[600px]">
              <TrainingStatusCard />
            </div>
          </div>
          
          {/* Secondary Cards Row (Equal Width) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="min-h-[400px]">
              <TrainingSplitOverview split={["Push", "Pull", "Legs", "Rest"]} />
            </div>
            
            <div className="min-h-[400px]">
              <UpcomingSessionsPreview
                sessions={[
                  { id: "s1", dateStr: "Friday", focus: "Push" },
                  { id: "s2", dateStr: "Sunday", focus: "Pull + Arms" },
                  { id: "s3", dateStr: "Tuesday", focus: "Legs" },
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
