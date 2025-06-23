import { useState } from "react";
import useWorkoutSessions from "../lib/useWorkoutSessions";
import useSessionSets from "../lib/useSessionSets";
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
  const sets = useSessionSets(selected?.id);

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
  ];  return (
    <ErrorBoundary>
      <TrainingStateProvider>
        <div className="space-y-8 max-w-7xl">
          {/* Training Status Card */}
          <TrainingStatusCard />

          {/* Weekly Volume Tracker Chart */}
          <SimpleVolumeChart />

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
