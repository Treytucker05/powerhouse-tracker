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

  const formatNumber = (num) => {
    return num.toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold text-white mb-2">
            {cycle?.goal || 'Hypertrophy'}
          </h2>
          {cycle?.specializations?.length > 0 && (
            <p className="text-accent text-sm font-medium">
              Focus: {cycle.specializations.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(" • ")}
            </p>
          )}
        </div>
        <div className="text-left lg:text-right flex-shrink-0">
          <div className="text-white font-semibold text-sm">
            Week {cycle?.currentWeek || 1}/{cycle?.weeks || 6} • Day {cycle?.currentDay || 1}
          </div>
          <div className="text-gray-400 text-xs">
            {currentDayName}
          </div>
          <div className="text-gray-400 text-xs">
            {daysToDeload > 0 ? `${daysToDeload} days to deload` : 'Deload week'}
          </div>
        </div>
      </div>

      <div className="grid gap-4 px-4 pb-4">
        {/* Training Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-2 text-gray-300 font-semibold">Muscle Group</th>
                <th className="text-right py-3 px-2 text-gray-300 font-semibold">Sets</th>
                <th className="text-right py-3 px-2 text-gray-300 font-semibold">Tonnage (lb)</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(vol.sets)
                .sort((a, b) => vol.tonnage[b] - vol.tonnage[a])
                .map((muscle, index) => (
                  <tr key={muscle} className={`border-b border-gray-800 ${index % 2 === 0 ? 'bg-gray-900/30' : ''}`}>
                    <td className="py-2 px-2 text-white capitalize">{muscle}</td>
                    <td className="py-2 px-2 text-gray-300 text-right">{vol.sets[muscle]}</td>
                    <td className="py-2 px-2 text-gray-300 text-right">{formatNumber(vol.tonnage[muscle])}</td>
                  </tr>
                ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-gray-600 bg-gray-800/40">
                <td className="py-3 px-2 text-white font-bold">Total</td>
                <td className="py-3 px-2 text-white font-bold text-right">{agg.totalSets}</td>
                <td className="py-3 px-2 text-white font-bold text-right">{formatNumber(agg.totalTon)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-800/30 rounded-lg border border-gray-700">
            <div className="text-gray-400 text-xs mb-1">Week</div>
            <div className="text-xl font-bold text-white">{agg.totalSets}</div>
            <div className="text-xs text-gray-400">sets</div>
            <div className="text-sm font-semibold text-white mt-1">{formatNumber(agg.totalTon)}</div>
            <div className="text-xs text-gray-400">lb</div>
          </div>
          <div className="text-center p-4 bg-gray-800/30 rounded-lg border border-gray-700">
            <div className="text-gray-400 text-xs mb-1">Month</div>
            <div className="text-xl font-bold text-white">{monthlyAgg.sets}</div>
            <div className="text-xs text-gray-400">sets</div>
            <div className="text-sm font-semibold text-white mt-1">{formatNumber(monthlyAgg.tonnage)}</div>
            <div className="text-xs text-gray-400">lb</div>
          </div>
          <div className="text-center p-4 bg-gray-800/30 rounded-lg border border-gray-700">
            <div className="text-gray-400 text-xs mb-1">Program</div>
            <div className="text-xl font-bold text-white">{programAgg.sets}</div>
            <div className="text-xs text-gray-400">sets</div>
            <div className="text-sm font-semibold text-white mt-1">{formatNumber(programAgg.tonnage)}</div>
            <div className="text-xs text-gray-400">lb</div>
          </div>
        </div>

        {/* RIR and Fatigue */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700">
              <div className="text-gray-400 text-xs mb-2">Weekly Average RIR</div>
              <div className="text-2xl font-bold text-white">{weeklyRIR ?? "--"}</div>
              <div className="text-xs text-gray-400">reps in reserve</div>
            </div>
            <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700">
              <div className="text-gray-400 text-xs mb-2">Mesocycle Average RIR</div>
              <div className="text-2xl font-bold text-white">{mesocycleRIR ?? "--"}</div>
              <div className="text-xs text-gray-400">reps in reserve</div>
            </div>
          </div>
          
          <div className="flex flex-col space-y-4">
            <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700 flex items-center justify-center">
              <div className="max-w-[220px] max-h-[160px] mx-auto object-contain">
                <VintageFatigueGauge 
                  value={state?.fatigueScore || 45} 
                  label="Fatigue Level"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => context?.refreshDashboard?.() || console.log('Refresh clicked')}
          className="flex-1 px-4 py-2 bg-transparent border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800/50 transition-colors"
        >
          Refresh
        </button>
        {import.meta.env.DEV && (
          <button
            onClick={() => seedMockSets(context)}
            className="flex-1 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/80 transition-colors"
          >
            Load sample data
          </button>
        )}
      </div>
    </div>
  );
}