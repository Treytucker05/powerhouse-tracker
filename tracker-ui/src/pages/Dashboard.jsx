import React from 'react';
import TrainingStatusCard from '../components/dashboard/TrainingStatusCard';
import VolumeTrackingChart from '../components/VolumeTrackingChart';
import QuickActionsPanel from '../components/QuickActionsPanel';
import FatigueRecoveryIndicator from '../components/FatigueRecoveryIndicator';
import UpcomingSessionsPreview from '../components/dashboard/UpcomingSessionsPreview';
import TrainingSplitOverview from '../components/dashboard/TrainingSplitOverview';
import DashboardCard from '../components/ui/DashboardCard';
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
    <>
      <DashboardCard>
        <TrainingStatusCard currentWeek={currentWeek} phase={phase} />
      </DashboardCard>
      <DashboardCard>
        <VolumeTrackingChart muscleVolumes={muscleVolumes} />
      </DashboardCard>
      {/* Placeholder split until program builder feeds real data */}
      <DashboardCard>
        <TrainingSplitOverview split={["Push", "Pull", "Legs", "Rest"]} />
      </DashboardCard>
      <DashboardCard>
        <FatigueRecoveryIndicator systemicFatigue={systemicFatigue} muscleVolumes={muscleVolumes} />
      </DashboardCard>
      <DashboardCard>
        <QuickActionsPanel onRefresh={refreshDashboard} />
      </DashboardCard>
      {/* Placeholder upcoming sessions */}
      <DashboardCard>
        <UpcomingSessionsPreview
          sessions={[
            { id: "s1", dateStr: "Fri", focus: "Push" },
            { id: "s2", dateStr: "Sun", focus: "Pull + Arms" },
            { id: "s3", dateStr: "Tue", focus: "Legs" },
          ]}
        />
      </DashboardCard>
    </>
  );
}
