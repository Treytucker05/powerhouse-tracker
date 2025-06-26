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
    <div className="border rounded-lg p-3 text-gray-100 w-full max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between mb-3 gap-2">
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-semibold truncate">{cycle?.goal || 'Training Program'}</h2>
          {cycle?.specializations?.length > 0 && (
            <p className="text-xs text-red-500 truncate">
              Focus: {cycle.specializations.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(" • ")}
            </p>
          )}
        </div>
        <div className="text-right text-xs flex-shrink-0">
          <div className="truncate">Week {cycle?.currentWeek || 1}/{cycle?.weeks || 6} • Day {cycle?.currentDay || 1} ({currentDayName})</div>
          <div className="text-xs text-gray-400 mt-1 truncate">
            {daysToDeload > 0 ? `${daysToDeload} days to deload` : 'Deload week'}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto mb-3">
        <table className="w-full text-xs min-w-0">
          <thead>
            <tr className="text-gray-400">
              <th className="text-left">Muscle</th>
              <th className="text-right">Sets</th>
              <th className="text-right">Tonnage&nbsp;(lb)</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(vol.sets)
              .sort((a, b) => vol.tonnage[b] - vol.tonnage[a])
              .map((m) => (
                <tr key={m}>
                  <td className="capitalize truncate">{m}</td>
                  <td className="text-right">{vol.sets[m]}</td>
                  <td className="text-right">{vol.tonnage[m].toLocaleString()}</td>
                </tr>
              ))}
          </tbody>
          <tfoot>
            <tr className="font-semibold">
              <td>Total</td>
              <td className="text-right">{agg.totalSets}</td>
              <td className="text-right">{agg.totalTon.toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Aggregate Volume & Load */}
      <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
        <div className="text-center p-2 bg-gray-800/50 rounded">
          <div className="font-semibold text-white">Week</div>
          <div className="text-xs text-gray-400">{agg.totalSets} sets</div>
          <div className="text-xs text-gray-400">{agg.totalTon.toLocaleString()} lb</div>
          <div className="text-xs text-gray-400">{compliance.completed}/{compliance.scheduled} sessions</div>
        </div>
        <div className="text-center p-2 bg-gray-800/50 rounded">
          <div className="font-semibold text-white">Month</div>
          <div className="text-xs text-gray-400">{monthlyAgg.sets} sets</div>
          <div className="text-xs text-gray-400">{monthlyAgg.tonnage.toLocaleString()} lb</div>
          <div className="text-xs text-gray-400">{monthlyAgg.sessions}/{monthlyAgg.plannedSessions} sessions</div>
        </div>
        <div className="text-center p-2 bg-gray-800/50 rounded">
          <div className="font-semibold text-white">Program</div>
          <div className="text-xs text-gray-400">{programAgg.sets} sets</div>
          <div className="text-xs text-gray-400">{programAgg.tonnage.toLocaleString()} lb</div>
          <div className="text-xs text-gray-400">{programAgg.sessions}/{programAgg.plannedSessions} sessions</div>
        </div>
      </div>

      {/* Intensity & Effort */}
      <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
        <div>
          <span className="text-gray-400">Average RIR — Week:</span>
          <span className="text-white ml-1">{weeklyRIR ?? "--"}</span>
        </div>
        <div>
          <span className="text-gray-400">Average RIR — Mesocycle:</span>
          <span className="text-white ml-1">{mesocycleRIR ?? "--"}</span>
        </div>
      </div>

      {/* Fatigue & Compliance */}
      <div className="flex justify-between items-center text-xs mb-2">
        <div className="flex flex-col items-center">
          <FatigueGauge pct={state?.fatigueScore || 0} />
          <span className="mt-1 text-xs text-gray-400">Fatigue</span>
        </div>
        <div className="text-right">
          <p>Avg RIR (wk): <span className="text-white">{weeklyRIR ?? "--"}</span></p>
          <p>Adherence: <span className="text-white">{compliance.percentage}%</span></p>
        </div>
      </div>

      {/* Deload banner */}
      {showDeloadBanner && (
        <div className="mt-3 p-2 bg-red-700/30 text-red-200 rounded">
          🔔 High fatigue detected — consider deload soon!
        </div>
      )}

      {/* Refresh */}
      <button
        onClick={() => context?.refreshDashboard?.() || console.log('Refresh clicked')}
        className="mt-2 px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded text-xs text-white"
      >
        Refresh
      </button>

      {/* Dev-only mock data button */}
      {import.meta.env.DEV && (
        <button
          onClick={() => seedMockSets(context)}
          className="mt-1 ml-2 px-2 py-1 bg-red-800/80 hover:bg-red-700/90 rounded text-xs text-white"
        >
          Load sample data
        </button>
      )}
    </div>
  );
}
