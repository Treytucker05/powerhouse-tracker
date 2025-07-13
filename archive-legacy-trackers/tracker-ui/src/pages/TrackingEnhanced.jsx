import { useState, useEffect } from "react";
import { useWorkoutSessions } from "../hooks/useWorkoutSessions";
import Drawer from "../components/Drawer";
import SimpleVolumeChart from "../components/dashboard/SimpleVolumeChart";
import TrainingStatusCard from "../components/dashboard/TrainingStatusCard";
import MuscleCard from "../components/dashboard/MuscleCard";
import { TrainingStateProvider } from "../context/trainingStateContext";
import ErrorBoundary from "../components/ErrorBoundary";
import Breadcrumb from "../components/navigation/Breadcrumb";
import SectionDivider from "../components/ui/SectionDivider";
import FloatingActionButton from "../components/ui/FloatingActionButton";
import LoadingSkeleton, { TrackingLoading } from "../components/ui/LoadingSkeleton";
import { ChartBarIcon, PlayIcon, PlusIcon } from '@heroicons/react/24/outline';
import "../components/dashboard/DashboardLayout.css";

export default function Tracking() {
  const _sessions = useWorkoutSessions();
  const [selected, setSelected] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Complete muscle data - matches PowerHouse legacy order and includes all muscle groups
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
    current: {
      'Chest': 12, 'Back': 16, 'Quads': 20, 'Glutes': 14, 'Hamstrings': 12,
      'Shoulders': 10, 'Biceps': 8, 'Triceps': 10, 'Calves': 6, 'Abs': 6,
      'Forearms': 4, 'Neck': 3, 'Traps': 4
    },
    mev: {
      'Chest': 8, 'Back': 10, 'Quads': 10, 'Glutes': 8, 'Hamstrings': 8,
      'Shoulders': 6, 'Biceps': 6, 'Triceps': 6, 'Calves': 8, 'Abs': 4,
      'Forearms': 4, 'Neck': 2, 'Traps': 4
    },
    mav: {
      'Chest': 18, 'Back': 20, 'Quads': 16, 'Glutes': 12, 'Hamstrings': 16,
      'Shoulders': 16, 'Biceps': 12, 'Triceps': 14, 'Calves': 16, 'Abs': 6,
      'Forearms': 4, 'Neck': 3, 'Traps': 4
    },
    mrv: {
      'Chest': 22, 'Back': 25, 'Quads': 20, 'Glutes': 25, 'Hamstrings': 20,
      'Shoulders': 20, 'Biceps': 20, 'Triceps': 18, 'Calves': 22, 'Abs': 25,
      'Forearms': 16, 'Neck': 12, 'Traps': 16
    }
  };

  return (
    <ErrorBoundary>
      <TrainingStateProvider>
        <div className="min-h-screen bg-gray-900 text-white">
          {/* Enhanced Navigation */}
          <div className="sticky top-0 z-40 bg-gray-900/80 backdrop-blur-sm border-b border-gray-700/50">
            <div className="max-w-7xl mx-auto px-4 py-4">
              <Breadcrumb />
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
            {isLoading ? (
              <TrackingLoading />
            ) : (
              <>
                {/* Hero Section */}
                <div className="text-center space-y-4 animate-fade-in-up">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                    Training Tracker
                  </h1>
                  <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                    Monitor your weekly volume and training progress across all muscle groups
                  </p>
                </div>

                {/* Training Status */}
                <div className="animate-slide-in-up">
                  <TrainingStatusCard />
                </div>

                <SectionDivider 
                  title="Weekly Volume"
                  icon={ChartBarIcon}
                  gradient={true}
                />

                {/* Volume Chart */}
                <div className="glass-morphism premium-card animate-slide-in-up">
                  <SimpleVolumeChart data={volumeChartData} />
                </div>

                <SectionDivider 
                  title="Muscle Groups"
                  subtitle="Track volume across all 13 muscle groups with MEV, MAV, and MRV landmarks"
                  gradient={true}
                />

                {/* Muscle Cards Grid */}
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {muscleData.map((muscle, index) => (
                      <div key={index} className="timeline-item premium-card">
                        <MuscleCard
                          muscle={muscle.muscle}
                          sets={muscle.sets}
                          MEV={muscle.MEV}
                          MAV={muscle.MAV}
                          MRV={muscle.MRV}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Floating Action Button */}
          <FloatingActionButton 
            actions={[
              {
                icon: PlayIcon,
                label: 'Start Workout',
                onClick: () => console.log('Start workout')
              },
              {
                icon: PlusIcon,
                label: 'Log Sets',
                onClick: () => console.log('Log sets')
              }
            ]}
            position="bottom-right"
            color="green"
          />
        </div>

        {/* Drawer for detailed view */}
        <Drawer
          isOpen={!!selected}
          onClose={() => setSelected(null)}
          title={selected?.muscle || "Muscle Details"}
        >
          {selected && (
            <div className="space-y-4 p-4">
              <h3 className="text-xl font-bold">{selected.muscle}</h3>
              <p>Current Sets: {selected.sets}</p>
              <p>MEV: {selected.MEV}</p>
              <p>MAV: {selected.MAV}</p>
              <p>MRV: {selected.MRV}</p>
            </div>
          )}
        </Drawer>
      </TrainingStateProvider>
    </ErrorBoundary>
  );
}
