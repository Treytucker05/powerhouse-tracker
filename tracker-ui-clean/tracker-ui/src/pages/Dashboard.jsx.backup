import { TrainingStateProvider } from "../context/trainingStateContext";
import ErrorBoundary from "../components/ErrorBoundary";
import Header from "../components/dashboard/Header";
import NavBar from "../components/dashboard/NavBar";
import QuickActions from "../components/dashboard/QuickActions";
import WeekOverview from "../components/dashboard/WeekOverview";
import VolumeHeatmap from "../components/dashboard/VolumeHeatmap";
import ProgressMetrics from "../components/dashboard/ProgressMetrics";
import DeloadIndicator from "../components/dashboard/DeloadIndicator";
import RecentWorkouts from "../components/dashboard/RecentWorkouts";
import CardWrapper from "../components/dashboard/CardWrapper";
import "../components/dashboard/DashboardLayout.css";

export default function Dashboard() {
  return (
    <ErrorBoundary>
      <TrainingStateProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <Header />
          <NavBar />
          <main className="container grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 py-6">
            <CardWrapper className="col-span-1">
              <WeekOverview />
            </CardWrapper>
            <CardWrapper className="col-span-1">
              <QuickActions />
            </CardWrapper>
            <CardWrapper className="lg:col-span-2 xl:col-span-3">
              <VolumeHeatmap />
            </CardWrapper>
            <CardWrapper className="col-span-1">
              <ProgressMetrics />
            </CardWrapper>
            <CardWrapper className="col-span-1">
              <DeloadIndicator />
            </CardWrapper>
            <CardWrapper className="col-span-1 md:col-span-2 lg:col-span-1">
              <RecentWorkouts />
            </CardWrapper>
          </main>
        </div>
      </TrainingStateProvider>
    </ErrorBoundary>
  );
}
