import { useState } from "react";
import { useWorkoutSessions } from "../hooks/useWorkoutSessions";
import Drawer from "../components/Drawer";
import SimpleVolumeChart from "../components/dashboard/SimpleVolumeChart";
import TrainingStatusCard from "../components/dashboard/TrainingStatusCard";
import MuscleCard from "../components/dashboard/MuscleCard";
import { TrainingStateProvider } from "../context/trainingStateContext";
import ErrorBoundary from "../components/ErrorBoundary";
import "../components/dashboard/DashboardLayout.css";

export default function Tracking() {
  const sessions = useWorkoutSessions();
  const [selected, setSelected] = useState(null);
  // Sample muscle data - in a real app this would come from your data store
  const muscleData = [
    { muscle: 'Chest', sets: 12, MEV: 8, MAV: 18, MRV: 22 },
    { muscle: 'Back', sets: 16, MEV: 10, MAV: 20, MRV: 25 },
    { muscle: 'Shoulders', sets: 10, MEV: 6, MAV: 16, MRV: 20 },
    { muscle: 'Biceps', sets: 8, MEV: 6, MAV: 12, MRV: 16 },
    { muscle: 'Triceps', sets: 10, MEV: 6, MAV: 14, MRV: 18 },
    { muscle: 'Quads', sets: 20, MEV: 10, MAV: 20, MRV: 25 },
    { muscle: 'Hamstrings', sets: 12, MEV: 8, MAV: 16, MRV: 20 },
    { muscle: 'Glutes', sets: 14, MEV: 8, MAV: 12, MRV: 16 },
    { muscle: 'Calves', sets: 6, MEV: 8, MAV: 16, MRV: 20 }
  ];

  // Sample data for the volume chart - matches the legacy PowerHouse muscle order
  const volumeChartData = {
    'Chest': 12,
    'Shoulders': 10,
    'Biceps': 8,
    'Triceps': 10,
    'Lats': 16,
    'Mid-Traps': 8,
    'Rear Delts': 6,
    'Abs': 4,
    'Glutes': 14,
    'Quads': 20,
    'Hamstrings': 12,
    'Calves': 6,
    'Forearms': 4,
    mev: {
      'Chest': 8, 'Shoulders': 6, 'Biceps': 6, 'Triceps': 6, 'Lats': 10,
      'Mid-Traps': 6, 'Rear Delts': 4, 'Abs': 6, 'Glutes': 8, 'Quads': 10,
      'Hamstrings': 8, 'Calves': 8, 'Forearms': 4
    },
    mrv: {
      'Chest': 22, 'Shoulders': 20, 'Biceps': 16, 'Triceps': 18, 'Lats': 25,
      'Mid-Traps': 18, 'Rear Delts': 16, 'Abs': 20, 'Glutes': 16, 'Quads': 25,
      'Hamstrings': 20, 'Calves': 20, 'Forearms': 16
    }
  };return (
    <ErrorBoundary>
      <TrainingStateProvider>
        <div className="space-y-8 max-w-7xl">
          {/* Training Status Card */}
          <TrainingStatusCard />          {/* Weekly Volume Tracker Chart */}
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
