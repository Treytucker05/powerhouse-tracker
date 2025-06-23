import { useState } from "react";
import useWorkoutSessions from "../lib/useWorkoutSessions";
import useSessionSets from "../lib/useSessionSets";
import Drawer from "../components/Drawer";
import VolumeHeatmap from "../components/dashboard/VolumeHeatmap";
import VolumeTrackingChart from "../components/dashboard/VolumeTrackingChart";
import CardWrapper from "../components/dashboard/CardWrapper";
import WeekOverview from "../components/dashboard/WeekOverview";
import QuickActions from "../components/dashboard/QuickActions";
import ProgressMetrics from "../components/dashboard/ProgressMetrics";
import DeloadIndicator from "../components/dashboard/DeloadIndicator";
import RecentWorkouts from "../components/dashboard/RecentWorkouts";
import Header from "../components/dashboard/Header";
import NavBar from "../components/dashboard/NavBar";
import { TrainingStateProvider } from "../context/trainingStateContext";
import ErrorBoundary from "../components/ErrorBoundary";
import "../components/dashboard/DashboardLayout.css";

export default function Tracking() {
  const sessions = useWorkoutSessions();
  const [selected, setSelected] = useState(null);
  const sets = useSessionSets(selected?.id);

  return (
    <ErrorBoundary>
      <TrainingStateProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <Header />
          <NavBar />
          <main className="container mx-auto px-4 py-6 space-y-8">
            {/* Volume Tracking Graph */}
            <CardWrapper>
              <VolumeTrackingChart />
            </CardWrapper>

            {/* Dashboard Widgets Grid */}
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <CardWrapper className="col-span-1">
                <WeekOverview />
              </CardWrapper>
              <CardWrapper className="col-span-1">
                <QuickActions />
              </CardWrapper>
              <CardWrapper className="col-span-1 md:col-span-2 lg:col-span-1">
                <ProgressMetrics />
              </CardWrapper>
              <CardWrapper className="col-span-1">
                <DeloadIndicator />
              </CardWrapper>
            </div>

            {/* Volume Heatmap */}
            <CardWrapper>
              <VolumeHeatmap />
            </CardWrapper>

            {/* Recent Workouts */}
            <CardWrapper>
              <RecentWorkouts />
            </CardWrapper>

            {/* Workout Sessions Table */}
            <CardWrapper>
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Recent Workout Sessions</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700 text-left">
                      <th className="p-3 text-sm font-medium text-gray-500 dark:text-gray-400">Date</th>
                      <th className="p-3 text-sm font-medium text-gray-500 dark:text-gray-400">Duration</th>
                      <th className="p-3 text-sm font-medium text-gray-500 dark:text-gray-400">Focus</th>
                      <th className="p-3 text-sm font-medium text-gray-500 dark:text-gray-400">Sets</th>
                      <th className="p-3 text-sm font-medium text-gray-500 dark:text-gray-400">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sessions.map(s => {
                      const duration = s.end_time 
                        ? Math.round((new Date(s.end_time) - new Date(s.start_time)) / (1000 * 60))
                        : null;
                      
                      return (
                        <tr key={s.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                            onClick={() => setSelected(s)}>
                          <td className="p-3 text-sm text-gray-900 dark:text-gray-100">
                            {new Date(s.start_time).toLocaleDateString()}
                          </td>
                          <td className="p-3 text-sm text-gray-900 dark:text-gray-100">
                            {duration ? `${duration} min` : "—"}
                          </td>
                          <td className="p-3 text-sm text-gray-500 dark:text-gray-400">
                            {s.focus || "General"}
                          </td>
                          <td className="p-3 text-sm text-gray-500 dark:text-gray-400">
                            {s.total_sets || "—"}
                          </td>
                          <td className="p-3 text-sm text-gray-500 dark:text-gray-400">
                            {s.notes ?? "—"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardWrapper>

            <Drawer open={!!selected} onClose={() => setSelected(null)}>
              <h3 className="text-xl font-bold mb-2">Workout Details</h3>
              {selected && (
                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    {new Date(selected.start_time).toLocaleDateString()} - {selected.focus || "General Training"}
                  </div>
                  <div className="text-xs text-blue-700 dark:text-blue-300">
                    {selected.notes && `Notes: ${selected.notes}`}
                  </div>
                </div>
              )}
              
              {sets.length === 0 && <p>No sets recorded for this session.</p>}
              {sets.length > 0 && (
                <table className="min-w-full border">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-700 text-left">
                      <th className="p-2">#</th>
                      <th className="p-2">Exercise</th>
                      <th className="p-2">Weight</th>
                      <th className="p-2">Reps</th>
                      <th className="p-2">RIR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sets.map(st => (
                      <tr key={st.id} className="border-t border-slate-200 dark:border-slate-600">
                        <td className="p-2">{st.set_number}</td>
                        <td className="p-2">{st.exercise}</td>
                        <td className="p-2">{st.weight} kg</td>
                        <td className="p-2">{st.reps}</td>
                        <td className="p-2">{st.rir ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </Drawer>
          </main>
        </div>
      </TrainingStateProvider>
    </ErrorBoundary>
  );
}
