import React from 'react';
import TrainingStatusCard from '../components/dashboard/TrainingStatusCard';
import VolumeTrackingChart from '../components/dashboard/VolumeTrackingChart';
import QuickActions from '../components/dashboard/QuickActions';
import TrainingStatus from '../components/dashboard/TrainingStatus';
// Fallback stubs for components not yet implemented in new structure
const UpcomingSessionsPreview = () => null;
const FatigueRecoveryIndicator = () => null;
import { useDashboardState } from '../lib/state/trainingState';

export default function Dashboard() {
  const {
    currentWeek,
    phase,
    systemicFatigue,
    muscleVolumes,
    refreshDashboard,
  } = useDashboardState();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-6">
        <TrainingStatusCard currentWeek={currentWeek} phase={phase} />
        <QuickActions onRefresh={refreshDashboard} />
        <UpcomingSessionsPreview />
      </div>
      <div className="space-y-6">
        <VolumeTrackingChart muscleVolumes={muscleVolumes} />
        <TrainingStatus />
        <FatigueRecoveryIndicator systemicFatigue={systemicFatigue} muscleVolumes={muscleVolumes} />
      </div>
    </div>
  );
}
