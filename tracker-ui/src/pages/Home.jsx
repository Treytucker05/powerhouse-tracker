import React from 'react';
import SimpleVolumeChart from '../components/dashboard/SimpleVolumeChart';
import TrainingStatusCard from '../components/dashboard/TrainingStatusCard';
import TrainingSplitOverview from '../components/dashboard/TrainingSplitOverview';
import UpcomingSessionsPreview from '../components/dashboard/UpcomingSessionsPreview';
import FatigueGauge from '../components/dashboard/FatigueGauge';
import DashboardCard from '../components/ui/DashboardCard';
import HeroHeader from '../components/ui/HeroHeader';

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
      {/* 1️⃣  Hero header – transparent card spans grid */}
      <DashboardCard className="border-none shadow-none
                               bg-transparent p-0 pointer-events-none">
        <HeroHeader />
      </DashboardCard>

      {/* 2️⃣  Weekly volume chart – full-width card */}
      <DashboardCard>
        <SimpleVolumeChart data={sampleVolumeData} />
      </DashboardCard>

      {/* 3️⃣  Hypertrophy training status – first 1-col card */}
      <DashboardCard>
        <TrainingStatusCard />
      </DashboardCard>

      {/* 4️⃣  Other regular 1-col cards */}
      <DashboardCard>
        <TrainingSplitOverview split={["Push", "Pull", "Legs", "Rest"]} />
      </DashboardCard>
      
      <DashboardCard>
        <UpcomingSessionsPreview
          sessions={[
            { id: "s1", dateStr: "Friday", focus: "Push" },
            { id: "s2", dateStr: "Sunday", focus: "Pull + Arms" },
            { id: "s3", dateStr: "Tuesday", focus: "Legs" },
          ]}
        />
      </DashboardCard>
      
      <DashboardCard>
        <FatigueGauge />
      </DashboardCard>
    </>
  );
}