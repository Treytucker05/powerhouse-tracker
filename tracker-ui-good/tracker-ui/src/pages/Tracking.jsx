import { useState, useEffect } from "react";
import { useWorkoutSessions } from "../hooks/useWorkoutSessions";
import Drawer from "../components/Drawer";
import SimpleVolumeChart from "../components/dashboard/SimpleVolumeChart";
import TrainingStatusCard from "../components/dashboard/TrainingStatusCard";
import MuscleCard from "../components/dashboard/MuscleCard";
import { TrainingStateProvider } from "../context/TrainingStateContext.jsx";
import ErrorBoundary from "../components/ErrorBoundary";
import Breadcrumb from "../components/navigation/Breadcrumb";
import SectionDivider from "../components/ui/SectionDivider";
import FloatingActionButton from "../components/ui/FloatingActionButton";
import LoadingSkeleton, { TrackingLoading } from "../components/ui/LoadingSkeleton";
import { ChartBarIcon, PlayIcon, PlusIcon } from '@heroicons/react/24/outline';
import "../components/dashboard/DashboardLayout.css";

export default function Tracking() {
  const _sessions = useWorkoutSessions();
  const [_selected, _setSelected] = useState(null);
  const [_isLoading, setIsLoading] = useState(true);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);// Complete muscle data - matches PowerHouse legacy order and includes all muscle groups
  const muscleData = [
    { muscle: 'Chest', sets: 12, MEV: 8, MAV: 18, MRV: 22 },
    { muscle: 'Back', sets: 16, MEV: 10, MAV: 20, MRV: 25 },
    { muscle: 'Quads', sets: 20, MEV: 10, MAV: 20, MRV: 25 },
    { muscle: 'Glutes', sets: 14, MEV: 8, MAV: 12, MRV: 16 },
    { muscle: 'Hamstrings', sets: 12, MEV: 8, MAV: 16, MRV: 20 },
    { muscle: 'Shoulders', sets: 10, MEV: 6, MAV: 16, MRV: 20 },
    { muscle: 'Biceps', sets: 8, MEV: 6, MAV: 12, MRV: 16 },
    { muscle: 'Triceps', sets: 10, MEV: 6, MAV: 14, MRV: 18 },
    { muscle: 'Calves', sets: 6, MEV: 8, MAV: 16, MRV: 20 },
    { muscle: 'Abs', sets: 6, MEV: 4, MAV: 6, MRV: 16 },
    { muscle: 'Forearms', sets: 4, MEV: 4, MAV: 4, MRV: 12 },
    { muscle: 'Neck', sets: 3, MEV: 2, MAV: 3, MRV: 8 },
    { muscle: 'Traps', sets: 4, MEV: 4, MAV: 4, MRV: 12 }
  ];
  // Sample data for the volume chart - matches the legacy PowerHouse muscle order and landmarks  
  const volumeChartData = {
    'Chest': 14,
    'Back': 16,
    'Quads': 12,
    'Glutes': 8,
    'Hamstrings': 10,
    'Shoulders': 12,
    'Biceps': 8,
    'Triceps': 10,
    'Calves': 12,
    'Abs': 10,
    'Forearms': 6,
    'Neck': 4,
    'Traps': 8,
    mev: {
      'Chest': 6, 'Back': 10, 'Quads': 10, 'Glutes': 2, 'Hamstrings': 6,
      'Shoulders': 8, 'Biceps': 6, 'Triceps': 6, 'Calves': 8, 'Abs': 6,
      'Forearms': 4, 'Neck': 2, 'Traps': 4
    },
    mrv: {
      'Chest': 22, 'Back': 25, 'Quads': 20, 'Glutes': 25, 'Hamstrings': 20,
      'Shoulders': 20, 'Biceps': 20, 'Triceps': 18, 'Calves': 22, 'Abs': 25,
      'Forearms': 16, 'Neck': 12, 'Traps': 16
    }
  };

  return (
    <ErrorBoundary>
      <TrainingStateProvider>        <div className="space-y-8 max-w-7xl">
        {/* Training Status Card */}
        <TrainingStatusCard />

        {/* Weekly Volume Tracker Chart */}
        <SimpleVolumeChart data={volumeChartData} />

        {/* Muscle Volume Cards Grid */}
        <div className="card-powerhouse">
          <h2 className="text-2xl font-bold text-red-600 mb-4">💪 Muscle Volume Tracking</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {muscleData.map((muscle, index) => (
              <MuscleCard
                key={index}
                muscle={muscle.muscle}
                sets={muscle.sets}
                MEV={muscle.MEV}
                MAV={muscle.MAV}
                MRV={muscle.MRV}
              />
            ))}
          </div>
        </div>
      </div>
      </TrainingStateProvider>
    </ErrorBoundary>
  );
}
