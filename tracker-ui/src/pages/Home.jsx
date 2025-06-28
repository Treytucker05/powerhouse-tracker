import React from 'react';
import SimpleVolumeChart from '../components/dashboard/SimpleVolumeChart';
import TrainingStatusCard from '../components/dashboard/TrainingStatusCard';
import TrainingSplitOverview from '../components/dashboard/TrainingSplitOverview';
import UpcomingSessionsPreview from '../components/dashboard/UpcomingSessionsPreview';
import FatigueGauge from '../components/dashboard/FatigueGauge';
import VolumeTonnageCard from '../components/dashboard/VolumeTonnageCard';
import DashboardCard from '../components/ui/DashboardCard';
import HeroHeader from '../components/ui/HeroHeader';
import StatTile from '../components/ui/StatTile';
import { HeartPulse, Droplets, Flame, Dumbbell, BarChart3, Layers3 } from 'lucide-react';

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

  // Sample daily totals data
  const dailyTotals = {
    sets: 12,
    tonnage: 2450,
    volumeLoad: 8950
  };

  // Sample volume state data for VolumeTonnageCard - with distinct differences per timeframe
  const volumeState = {
    day: [
      { muscle: 'Chest', sets: 4, tonnage: 1200, volumeLoad: 4800 },
      { muscle: 'Triceps', sets: 2, tonnage: 400, volumeLoad: 1200 },
      { muscle: 'Abs', sets: 3, tonnage: 150, volumeLoad: 900 }
    ],
    dayTotal: { sets: 9, tonnage: 1750, volumeLoad: 6900 },
    
    week: [
      { muscle: 'Chest', sets: 12, tonnage: 3600, volumeLoad: 14400 },
      { muscle: 'Back', sets: 10, tonnage: 2800, volumeLoad: 11200 },
      { muscle: 'Shoulders', sets: 8, tonnage: 1600, volumeLoad: 6400 },
      { muscle: 'Arms', sets: 6, tonnage: 1200, volumeLoad: 4800 },
      { muscle: 'Legs', sets: 16, tonnage: 4800, volumeLoad: 19200 }
    ],
    weekTotal: { sets: 52, tonnage: 14000, volumeLoad: 56000 },
    
    block: [
      { muscle: 'Chest', sets: 48, tonnage: 14400, volumeLoad: 57600 },
      { muscle: 'Back', sets: 40, tonnage: 11200, volumeLoad: 44800 },
      { muscle: 'Shoulders', sets: 32, tonnage: 6400, volumeLoad: 25600 },
      { muscle: 'Arms', sets: 24, tonnage: 4800, volumeLoad: 19200 },
      { muscle: 'Legs', sets: 64, tonnage: 19200, volumeLoad: 76800 },
      { muscle: 'Core', sets: 20, tonnage: 1000, volumeLoad: 6000 }
    ],
    blockTotal: { sets: 228, tonnage: 57000, volumeLoad: 230000 },
    
    program: [
      { muscle: 'Chest', sets: 192, tonnage: 57600, volumeLoad: 230400 },
      { muscle: 'Back', sets: 160, tonnage: 44800, volumeLoad: 179200 },
      { muscle: 'Shoulders', sets: 128, tonnage: 25600, volumeLoad: 102400 },
      { muscle: 'Arms', sets: 96, tonnage: 19200, volumeLoad: 76800 },
      { muscle: 'Legs', sets: 256, tonnage: 76800, volumeLoad: 307200 },
      { muscle: 'Core', sets: 80, tonnage: 4000, volumeLoad: 24000 },
      { muscle: 'Calves', sets: 64, tonnage: 8000, volumeLoad: 32000 }
    ],
    programTotal: { sets: 976, tonnage: 236000, volumeLoad: 952000 }
  };

  return (
    <>
      {/* 1️⃣  Hero header – transparent card spans grid */}
      <DashboardCard className="border-none shadow-none
                               bg-transparent p-0 pointer-events-none">
        <HeroHeader />
      </DashboardCard>

      {/* 1.5️⃣  Training metrics snapshot */}
      <div className="flex flex-wrap gap-4 sm:flex-nowrap">
        <StatTile icon={<Dumbbell />} label="Sets (Day)" value={dailyTotals.sets} unit="" />
        <StatTile icon={<BarChart3 />} label="Tonnage (Day)" value={dailyTotals.tonnage} unit="lb" />
        <StatTile icon={<Layers3 />} label="Volume-Load (Day)" value={dailyTotals.volumeLoad} unit="lb" />
      </div>

      {/* 1.6️⃣  Health/Activity tiles */}
      <div className="flex flex-wrap gap-4">
        <StatTile icon={<HeartPulse />} label="Heart"  value="120" unit="bpm" />
        <StatTile icon={<Droplets />}   label="Water"  value="3.5" unit="L" />
        <StatTile icon={<Flame />}      label="Calories" value="2.2k" unit="cal" />
      </div>

      {/* 1.7️⃣  Volume & Tonnage breakdown by timeframe */}
      <VolumeTonnageCard data={volumeState} />

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