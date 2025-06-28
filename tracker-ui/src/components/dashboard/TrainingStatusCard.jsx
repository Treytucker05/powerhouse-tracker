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
import VintageFatigueGauge from "./VintageFatigueGauge";

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
    <div className="premium-card h-full flex flex-col p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-8 gap-4">
        <div className="min-w-0 flex-1">
          <h2 className="text-3xl font-bold text-white mb-3 truncate text-left">{cycle?.goal || 'Training Program'}</h2>
          {cycle?.specializations?.length > 0 && (
            <p className="text-base text-gray-300 truncate mb-4 font-medium">
              Focus: {cycle.specializations.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(" • ")}
            </p>
          )}
        </div>
        <div className="text-right flex-shrink-0 sm:mt-1">
          <div className="text-white font-semibold truncate mb-2 text-base">
            Week {cycle?.currentWeek || 1}/{cycle?.weeks || 6} • Day {cycle?.currentDay || 1}
          </div>
          <div className="text-gray-300 truncate font-medium text-sm mb-1">
            {currentDayName}
          </div>
          <div className="text-gray-400 truncate text-sm">
            {daysToDeload > 0 ? `${daysToDeload} days to deload` : 'Deload week'}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto mb-8 px-2">
        <table className="w-full text-sm min-w-0">
          <thead>
            <tr className="text-white border-b-2 border-gray-600">
              <th className="text-left pb-4 pr-6 font-semibold text-base">Muscle Group</th>
              <th className="text-right pb-4 px-4 font-semibold text-base">Sets</th>
              <th className="text-right pb-4 pl-4 font-semibold text-base">Tonnage (lb)</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(vol.sets)
              .sort((a, b) => vol.tonnage[b] - vol.tonnage[a])
              .map((m) => (
                <tr key={m} className="border-b border-gray-700 hover:bg-gray-800/30 transition-colors">
                  <td className="capitalize py-3 pr-6 text-white font-medium">{m}</td>
                  <td className="text-right py-3 px-4 text-gray-300">{vol.sets[m]}</td>
                  <td className="text-right py-3 pl-4 text-gray-300 font-medium">{vol.tonnage[m].toLocaleString()}</td>
                </tr>
              ))}
          </tbody>
          <tfoot>
            <tr className="font-semibold text-white border-t-2 border-gray-600">
              <td className="pt-4 pr-6">Total</td>
              <td className="text-right pt-4 px-4">{agg.totalSets}</td>
              <td className="text-right pt-4 pl-4">{agg.totalTon.toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Visual Separator */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent mb-8"></div>

      {/* Aggregate Volume & Load */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="text-center p-6 bg-gray-800/30 border border-primary-red/20 rounded-lg backdrop-blur-sm">
          <div className="text-gray-400 text-sm font-medium mb-2">Week</div>
          <div className="text-2xl font-bold text-white mb-1">{agg.totalSets}</div>
          <div className="text-xs text-gray-400 mb-2">sets</div>
          <div className="text-lg font-semibold text-white mb-1">{agg.totalTon.toLocaleString()}</div>
          <div className="text-xs text-gray-400 mb-2">lb</div>
          <div className="text-sm text-accent-red font-medium">{compliance.completed}/{compliance.scheduled} sessions</div>
        </div>
        <div className="text-center p-6 bg-gray-800/30 border border-primary-red/20 rounded-lg backdrop-blur-sm">
          <div className="text-gray-400 text-sm font-medium mb-2">Month</div>
          <div className="text-2xl font-bold text-white mb-1">{monthlyAgg.sets}</div>
          <div className="text-xs text-gray-400 mb-2">sets</div>
          <div className="text-lg font-semibold text-white mb-1">{monthlyAgg.tonnage.toLocaleString()}</div>
          <div className="text-xs text-gray-400 mb-2">lb</div>
          <div className="text-sm text-accent-red font-medium">{monthlyAgg.sessions}/{monthlyAgg.plannedSessions} sessions</div>
        </div>
        <div className="text-center p-6 bg-gray-800/30 border border-primary-red/20 rounded-lg backdrop-blur-sm">
          <div className="text-gray-400 text-sm font-medium mb-2">Program</div>
          <div className="text-2xl font-bold text-white mb-1">{programAgg.sets}</div>
          <div className="text-xs text-gray-400 mb-2">sets</div>
          <div className="text-lg font-semibold text-white mb-1">{programAgg.tonnage.toLocaleString()}</div>
          <div className="text-xs text-gray-400 mb-2">lb</div>
          <div className="text-sm text-accent-red font-medium">{programAgg.sessions}/{programAgg.plannedSessions} sessions</div>
        </div>
      </div>

      {/* Intensity & Effort */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="p-6 bg-gray-800/30 rounded-lg border border-primary-red/20">
          <div className="text-gray-400 text-sm font-medium mb-2">Weekly Average RIR</div>
          <div className="text-2xl font-bold text-white">{weeklyRIR ?? "--"}</div>
          <div className="text-xs text-gray-400 mt-1">reps in reserve</div>
        </div>
        <div className="p-6 bg-gray-800/30 rounded-lg border border-primary-red/20">
          <div className="text-gray-400 text-sm font-medium mb-2">Mesocycle Average RIR</div>
          <div className="text-2xl font-bold text-white">{mesocycleRIR ?? "--"}</div>
          <div className="text-xs text-gray-400 mt-1">reps in reserve</div>
        </div>
      </div>

      {/* Fatigue & Compliance */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Fatigue Card */}
        <div className="p-6 bg-gray-800/30 rounded-lg border border-primary-red/20 flex items-center justify-center">
          <VintageFatigueGauge 
            value={state?.fatigueScore || 45} 
            label="Fatigue Level"
          />
        </div>

        {/* Compliance & Performance Card */}
        <div className="p-6 bg-gray-800/30 rounded-lg border border-primary-red/20">
          <div className="text-gray-400 text-sm font-medium mb-3">Performance Metrics</div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-sm">Session Adherence</span>
              <span className="text-lg font-bold text-accent-red">{compliance.percentage}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-accent-red to-primary-red h-2 rounded-full transition-all duration-300"
                style={{ width: `${compliance.percentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-gray-300 text-sm">Weekly RIR</span>
              <span className="text-lg font-bold text-white">{weeklyRIR ?? "--"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Deload banner */}
      {showDeloadBanner && (
        <div className="p-4 bg-gradient-to-r from-dark-red/40 to-primary-red/40 text-white rounded-lg border border-accent-red/50 mb-6" style={{ boxShadow: '0 0 20px rgba(220, 38, 38, 0.4)' }}>
          <div className="flex items-center">
            <span className="mr-3 text-lg">🔔</span>
            <span className="font-semibold">High fatigue detected — consider deload soon!</span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 mt-auto pt-4">
        <button
          onClick={() => context?.refreshDashboard?.() || console.log('Refresh clicked')}
          className="btn-premium-outline flex-1 text-sm py-3"
        >
          Refresh
        </button>

        {/* Dev-only mock data button */}
        {import.meta.env.DEV && (
          <button
            onClick={() => seedMockSets(context)}
            className="btn-premium flex-1 text-sm py-3"
          >
            Load sample data
          </button>
        )}
      </div>
    </div>
  );
}
