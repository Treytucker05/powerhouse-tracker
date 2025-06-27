import { useTrainingState } from "../../context/trainingStateContext";
import {
  getCurrentCycle,
  getWeeklySetTonnageByMuscle,
  getAggregateVolume,
  getDaysToDeload,
  getMonthlyAggregates,
  getProgramAggregates,
  getSessionCompliance,
  getMesocycleRIR,
  getWeeklyRIR,
  getCurrentDayName,
} from "../../lib/selectors/dashboardSelectors";
import { seedMockSets } from "../../lib/dev/mockSetSeeder";
import FatigueGauge from "./FatigueGauge";

export default function TrainingStatusCard() {
  const context = useTrainingState();
  const state = context.state;
  const cycle = getCurrentCycle(state);
  const vol = getWeeklySetTonnageByMuscle(state);
  const agg = getAggregateVolume(vol);

  // Debug logging
  console.log('TrainingStatusCard state:', {
    fatigueScore: state?.fatigueScore,
    loggedSets: state?.loggedSets?.length || 0,
    cycleData: state?.cycleData,
    vol: vol
  });

  /* Helpers */
  const showDeloadBanner =
    state.fatigueScore >= 85 ||
    Object.values(vol.sets).some(
      (sets, i) => sets >= state.mrvTable[Object.keys(vol.sets)[i]] * 0.9
    );
  
  const daysToDeload = getDaysToDeload(state);
  const monthlyAgg = getMonthlyAggregates(state);
  const programAgg = getProgramAggregates(state);
  const compliance = getSessionCompliance(state);
  const weeklyRIR = getWeeklyRIR(state);
  const mesocycleRIR = getMesocycleRIR(state);
  const currentDayName = getCurrentDayName(state);

  return (
    <div className="premium-card h-full flex flex-col p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between mb-6 gap-2">
        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-semibold text-white mb-4 truncate text-left">{cycle?.goal || 'Training Program'}</h2>
          {cycle?.specializations?.length > 0 && (
            <p className="text-sm text-gray-300 truncate mb-2">
              Focus: {cycle.specializations.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(" • ")}
            </p>
          )}
        </div>
        <div className="text-right text-sm flex-shrink-0">
          <div className="text-white font-medium truncate mb-1">Week {cycle?.currentWeek || 1}/{cycle?.weeks || 6} • Day {cycle?.currentDay || 1} ({currentDayName})</div>
          <div className="text-gray-300 truncate">
            {daysToDeload > 0 ? `${daysToDeload} days to deload` : 'Deload week'}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto mb-4">
        <table className="w-full text-sm min-w-0">
          <thead>
            <tr className="text-gray-300 border-b border-gray-600">
              <th className="text-left pb-3 font-medium">Muscle</th>
              <th className="text-right pb-3 font-medium">Sets</th>
              <th className="text-right pb-3 font-medium">Tonnage&nbsp;(lb)</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(vol.sets)
              .sort((a, b) => vol.tonnage[b] - vol.tonnage[a])
              .map((m) => (
                <tr key={m} className="border-b border-gray-700 hover:bg-gray-800/30 transition-colors">
                  <td className="capitalize truncate py-2 text-white">{m}</td>
                  <td className="text-right py-2 text-gray-300">{vol.sets[m]}</td>
                  <td className="text-right py-2 text-gray-300">{vol.tonnage[m].toLocaleString()}</td>
                </tr>
              ))}
          </tbody>
          <tfoot>
            <tr className="font-medium text-white border-t border-gray-600">
              <td className="pt-3">Total</td>
              <td className="text-right pt-3">{agg.totalSets}</td>
              <td className="text-right pt-3">{agg.totalTon.toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Aggregate Volume & Load */}
      <div className="grid grid-cols-3 gap-3 mb-4 text-xs">
        <div className="text-center p-3 bg-gray-800/30 border border-primary-red/20 rounded-lg backdrop-blur-sm">
          <div className="font-bold text-white text-sm">Week</div>
          <div className="text-xs text-gray-400 mt-1">{agg.totalSets} sets</div>
          <div className="text-xs text-gray-400">{agg.totalTon.toLocaleString()} lb</div>
          <div className="text-xs text-accent-red font-medium">{compliance.completed}/{compliance.scheduled} sessions</div>
        </div>
        <div className="text-center p-3 bg-gray-800/30 border border-primary-red/20 rounded-lg backdrop-blur-sm">
          <div className="font-bold text-white text-sm">Month</div>
          <div className="text-xs text-gray-400 mt-1">{monthlyAgg.sets} sets</div>
          <div className="text-xs text-gray-400">{monthlyAgg.tonnage.toLocaleString()} lb</div>
          <div className="text-xs text-accent-red font-medium">{monthlyAgg.sessions}/{monthlyAgg.plannedSessions} sessions</div>
        </div>
        <div className="text-center p-3 bg-gray-800/30 border border-primary-red/20 rounded-lg backdrop-blur-sm">
          <div className="font-bold text-white text-sm">Program</div>
          <div className="text-xs text-gray-400 mt-1">{programAgg.sets} sets</div>
          <div className="text-xs text-gray-400">{programAgg.tonnage.toLocaleString()} lb</div>
          <div className="text-xs text-accent-red font-medium">{programAgg.sessions}/{programAgg.plannedSessions} sessions</div>
        </div>
      </div>

      {/* Intensity & Effort */}
      <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
        <div className="p-2 bg-gray-800/50 rounded-lg border border-primary-red/10">
          <span className="text-gray-400">Average RIR — Week:</span>
          <span className="text-accent-red ml-2 font-bold">{weeklyRIR ?? "--"}</span>
        </div>
        <div className="p-2 bg-gray-800/50 rounded-lg border border-primary-red/10">
          <span className="text-gray-400">Average RIR — Mesocycle:</span>
          <span className="text-accent-red ml-2 font-bold">{mesocycleRIR ?? "--"}</span>
        </div>
      </div>

      {/* Fatigue & Compliance */}
      <div className="flex justify-between items-center text-xs mb-4 p-3 bg-gray-800/30 rounded-lg border border-primary-red/20">
        <div className="flex flex-col items-center">
          <FatigueGauge pct={state?.fatigueScore || 0} />
          <span className="mt-2 text-xs text-gray-400 font-medium">Fatigue</span>
        </div>
        <div className="text-right space-y-1">
          <p className="text-gray-400">Avg RIR (wk): <span className="text-accent-red font-bold">{weeklyRIR ?? "--"}</span></p>
          <p className="text-gray-400">Adherence: <span className="text-accent-red font-bold">{compliance.percentage}%</span></p>
        </div>
      </div>

      {/* Deload banner */}
      {showDeloadBanner && (
        <div className="mt-4 p-3 bg-gradient-to-r from-dark-red/40 to-primary-red/40 text-white rounded-lg border border-accent-red/50" style={{ boxShadow: '0 0 20px rgba(220, 38, 38, 0.4)' }}>
          <div className="flex items-center">
            <span className="mr-2 text-lg">🔔</span>
            <span className="font-semibold">High fatigue detected — consider deload soon!</span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => context?.refreshDashboard?.() || console.log('Refresh clicked')}
          className="btn-premium-outline flex-1 text-xs py-2"
        >
          Refresh
        </button>

        {/* Dev-only mock data button */}
        {import.meta.env.DEV && (
          <button
            onClick={() => seedMockSets(context)}
            className="btn-premium flex-1 text-xs py-2"
          >
            Load sample data
          </button>
        )}
      </div>
    </div>
  );
}
