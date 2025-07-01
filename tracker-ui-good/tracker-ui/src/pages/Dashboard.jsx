import React from 'react';
import TrainingStatusCard from '../components/TrainingStatusCard';
import VolumeTrackingChart from '../components/VolumeTrackingChart';
import QuickActionsPanel from '../components/QuickActionsPanel';
import FatigueRecoveryIndicator from '../components/FatigueRecoveryIndicator';
import UpcomingSessionsPreview from '../components/UpcomingSessionsPreview';
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
        <QuickActionsPanel onRefresh={refreshDashboard} />
        <UpcomingSessionsPreview />
      </div>
      <div className="space-y-6">
        <VolumeTrackingChart muscleVolumes={muscleVolumes} />
        <FatigueRecoveryIndicator systemicFatigue={systemicFatigue} muscleVolumes={muscleVolumes} />
      </div>
    </div>
  );
}
