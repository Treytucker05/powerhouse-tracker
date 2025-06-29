import React from 'react';
import TrainingStatusCard from '../components/dashboard/TrainingStatusCard';
import VolumeTrackingChart from '../components/VolumeTrackingChart';
import QuickActionsPanel from '../components/QuickActionsPanel';
import FatigueRecoveryIndicator from '../components/FatigueRecoveryIndicator';
import UpcomingSessionsPreview from '../components/dashboard/UpcomingSessionsPreview';
import TrainingSplitOverview from '../components/dashboard/TrainingSplitOverview';
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
        {/* Placeholder split until program builder feeds real data */}
        <TrainingSplitOverview split={["Push", "Pull", "Legs", "Rest"]} />
        <QuickActionsPanel onRefresh={refreshDashboard} />
        {/* Placeholder upcoming sessions */}
        <UpcomingSessionsPreview
          sessions={[
            { id: "s1", dateStr: "Fri", focus: "Push" },
            { id: "s2", dateStr: "Sun", focus: "Pull + Arms" },
            { id: "s3", dateStr: "Tue", focus: "Legs" },
          ]}
        />
      </div>
      <div className="space-y-6">
        <VolumeTrackingChart muscleVolumes={muscleVolumes} />
        <FatigueRecoveryIndicator systemicFatigue={systemicFatigue} muscleVolumes={muscleVolumes} />
      </div>
    </div>
  );
}
