import { TrainingStateProvider } from "../context/trainingStateContext";
import Header from "../components/dashboard/Header";
import NavBar from "../components/dashboard/NavBar";
import QuickActions from "../components/dashboard/QuickActions";
import WeekOverview from "../components/dashboard/WeekOverview";
import VolumeHeatmap from "../components/dashboard/VolumeHeatmap";
import ProgressMetrics from "../components/dashboard/ProgressMetrics";
import DeloadIndicator from "../components/dashboard/DeloadIndicator";
import RecentWorkouts from "../components/dashboard/RecentWorkouts";

export default function Dashboard() {
  return (
    <TrainingStateProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <NavBar />
        <main className="max-w-7xl mx-auto p-4 grid gap-4 lg:grid-cols-3 auto-rows-min">
          <WeekOverview />
          <QuickActions />
          <VolumeHeatmap className="lg:col-span-2" />
          <ProgressMetrics />
          <DeloadIndicator />
          <RecentWorkouts />
        </main>
      </div>
    </TrainingStateProvider>
  );
}
