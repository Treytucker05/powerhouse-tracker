import { useTrainingState } from "../../context/trainingStateContext";
import {
  getCurrentCycle,
  getWeeklySetTonnageByMuscle,
  getAggregateVolume,
} from "../../lib/selectors/dashboardSelectors";

export default function TrainingStatusCard() {
  const state = useTrainingState();
  const cycle = getCurrentCycle(state);
  const vol = getWeeklySetTonnageByMuscle(state);
  const agg = getAggregateVolume(vol);

  return (
    <div className="border rounded-lg p-4 text-gray-100">
      {/* Header */}
      <div className="flex justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold">{cycle.goal}</h2>
          {cycle.specializations.length > 0 && (
            <p className="text-sm text-red-500">
              Focus: {cycle.specializations.join(", ")}
            </p>
          )}
        </div>
        <div className="text-right text-sm">
          Week {cycle.currentWeek}/{cycle.weeks} • Day {cycle.currentDay}
        </div>
      </div>

      {/* Table */}
      <table className="w-full text-sm mb-4">
        <thead>
          <tr className="text-gray-400">
            <th className="text-left">Muscle</th>
            <th className="text-right">Sets</th>
            <th className="text-right">Tonnage&nbsp;(lb)</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(vol.tonnage)
            .sort((a, b) => vol.tonnage[b] - vol.tonnage[a])
            .map((m) => (
              <tr key={m}>
                <td>{m}</td>
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

      {/* Fatigue + metrics */}
      <div className="flex justify-between text-sm">
        <span>Systemic Fatigue: {state.fatigueScore}%</span>
        <span>Avg&nbsp;RIR: {state.avgRIR ?? "--"}</span>
        <span>Adherence: {state.adherencePct ?? "--"}%</span>
      </div>

      {/* Deload banner */}
      {state.fatigueScore >= 85 && (
        <div className="mt-3 p-2 bg-red-700/30 text-red-200 rounded">
          🔔 High fatigue detected — consider deload soon!
        </div>
      )}

      {/* Refresh */}
      <button
        onClick={state.refreshDashboard}
        className="mt-4 px-3 py-1 bg-gray-800 rounded text-sm"
      >
        Refresh
      </button>
    </div>
  );
}
