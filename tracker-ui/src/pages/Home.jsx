import React, { useEffect } from 'react';
import SimpleVolumeChart from '../components/dashboard/SimpleVolumeChart';
import TrainingStatusCard from '../components/dashboard/TrainingStatusCard';
import TrainingSplitOverview from '../components/dashboard/TrainingSplitOverview';
import UpcomingSessionsPreview from '../components/dashboard/UpcomingSessionsPreview';
import VolumeTonnageCard from '../components/dashboard/VolumeTonnageCard';
import DashboardCard from '../components/ui/DashboardCard';
import HeroHeader from '../components/ui/HeroHeader';
import AIInsightBar from '../components/ui/AIInsightBar';
import { useAI } from '../context/trainingStateHooks';
import { seedDemo } from '../lib/devSeed';

export default function Home() {
  const aiInsight = useAI();

  // Auto-seed demo data in development
  useEffect(() => {
    if (import.meta.env.DEV) {
      seedDemo();
    }
  }, []);

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

  // Sample volume state for VolumeTonnageCard
  const volumeState = {
    day: [
      { muscle: 'Chest', sets: 4, tonnage: 2400, volumeLoad: 18500 },
      { muscle: 'Triceps', sets: 3, tonnage: 1200, volumeLoad: 9800 },
    ],
    week: [
      { muscle: 'Chest', sets: 12, tonnage: 7200, volumeLoad: 55500 },
      { muscle: 'Back', sets: 14, tonnage: 8400, volumeLoad: 64800 },
    ],
    block: [
      { muscle: 'Chest', sets: 48, tonnage: 28800, volumeLoad: 222000 },
      { muscle: 'Back', sets: 56, tonnage: 33600, volumeLoad: 259200 },
    ],
    program: [
      { muscle: 'Chest', sets: 192, tonnage: 115200, volumeLoad: 888000 },
      { muscle: 'Back', sets: 224, tonnage: 134400, volumeLoad: 1036800 },
    ]
  };

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #1C1C1C 0%, #0A0A0A 100%)'
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* 1 · Hero header (transparent wrapper) */}
        <DashboardCard className="border-none bg-transparent p-0">
          <HeroHeader />
        </DashboardCard>

        {/* 2 · Training status big card */}
        <TrainingStatusCard />

        {/* 3 · Volume & Tonnage tabbed card */}
        <VolumeTonnageCard data={volumeState} />

        {/* 4 · Weekly volume bar/line chart (full-width) */}
        <DashboardCard className="border-none p-0">
          <SimpleVolumeChart data={sampleVolumeData} />
        </DashboardCard>

        {/* 5 · Split & upcoming workouts */}
        <div className="flex flex-col gap-8">
          <TrainingSplitOverview split={["Push", "Pull", "Legs", "Rest"]} />
          <UpcomingSessionsPreview
            sessions={[
              { id: "s1", dateStr: "Friday", focus: "Push" },
              { id: "s2", dateStr: "Sunday", focus: "Pull + Arms" },
              { id: "s3", dateStr: "Tuesday", focus: "Legs" },
            ]}
          />
        </div>
      </div>

      {/* Sticky AI insight footer */}
      <AIInsightBar insight={aiInsight} />
    </div>
  );
}
