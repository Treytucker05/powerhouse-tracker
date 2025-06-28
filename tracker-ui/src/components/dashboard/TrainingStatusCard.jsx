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
import MetricTile from "../ui/MetricTile";
import { Sparkles, Target, Calendar, Activity, Weight, TrendingUp } from "lucide-react";

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

  // Sample data for demonstration
  const sampleData = {
    perMuscle: [
      { muscle: 'Chest', sets: 12, tonnage: 3600, volumeLoad: 14400 },
      { muscle: 'Back', sets: 10, tonnage: 2800, volumeLoad: 11200 },
      { muscle: 'Shoulders', sets: 8, tonnage: 1600, volumeLoad: 6400 },
      { muscle: 'Arms', sets: 6, tonnage: 1200, volumeLoad: 4800 },
      { muscle: 'Legs', sets: 16, tonnage: 4800, volumeLoad: 19200 }
    ]
  };

  // MetricTile data
  const dailyTotals = { sets: 9, tonnage: 1750, volumeLoad: 6900 };
  const totals = {
    Week: { sets: 52, tonnage: 14000, volumeLoad: 56000 },
    Block: { sets: 228, tonnage: 57000, volumeLoad: 230000 },
    Program: { sets: 976, tonnage: 236000, volumeLoad: 952000 }
  };
  const avgRIR = { week: 2.3 };
  const steps = { day: 8450 };
  const body = { weight: 185.2 };
  const oneRM = { bench: 275, squat: 365, deadlift: 425 };

  const formatNumber = (num) => {
    return num.toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* Header: Goal Name Badge + Week/Block/Program Counters */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand/20 border border-brand/30 rounded-full">
            <Target className="w-4 h-4 text-brand" />
            <span className="text-brand font-semibold text-sm">{cycle?.goal || 'Hypertrophy'}</span>
          </div>
          <p className="text-xs text-accent">
            {daysToDeload} days to deload • Fatigue {state?.fatigueScore || 45}%
          </p>
        </div>
        <div className="flex gap-4 text-sm">
          <div className="text-center">
            <div className="text-textHigh font-bold">W{cycle?.currentWeek || 1}/{cycle?.weeks || 6}</div>
            <div className="text-textMed text-xs">Week</div>
          </div>
          <div className="text-center">
            <div className="text-textHigh font-bold">B{cycle?.currentBlock || 1}/4</div>
            <div className="text-textMed text-xs">Block</div>
          </div>
          <div className="text-center">
            <div className="text-textHigh font-bold">P1/1</div>
            <div className="text-textMed text-xs">Program</div>
          </div>
        </div>
      </div>

      {/* Sub-header: Focus Muscles + Day-of-week + Deload Countdown */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 p-4 bg-surface/50 rounded-lg border border-white/10">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-textMed text-sm">Focus:</span>
          {(cycle?.specializations || ['Chest', 'Shoulders']).map((muscle, index) => (
            <span key={muscle} className="inline-flex items-center px-2 py-1 bg-accent/20 text-accent text-xs font-medium rounded">
              {muscle}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1 text-textMed">
            <Calendar className="w-4 h-4" />
            <span>{currentDayName || 'Monday'}</span>
          </div>
          <div className="text-textMed">
            {daysToDeload > 0 ? `${daysToDeload} days to deload` : 'Deload week'}
          </div>
        </div>
      </div>

      {/* Table 1: Per-muscle Sets • Tonnage • Volume-Load */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-textMed text-left border-b border-white/10">
              <th className="pb-3 font-medium">Muscle Group</th>
              <th className="w-20 pb-3 font-medium text-right">Sets</th>
              <th className="w-24 pb-3 font-medium text-right">Tonnage</th>
              <th className="w-28 pb-3 font-medium text-right">Volume-Load</th>
            </tr>
          </thead>
          <tbody>
            {sampleData.perMuscle.map((item, index) => (
              <tr key={item.muscle} className="border-b border-white/5 hover:bg-white/5">
                <td className="py-2 text-textHigh capitalize">{item.muscle}</td>
                <td className="py-2 text-textMed text-right">{item.sets}</td>
                <td className="py-2 text-textMed text-right">{formatNumber(item.tonnage)}</td>
                <td className="py-2 text-textMed text-right">{formatNumber(item.volumeLoad)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Daily Totals */}
      <div className="flex flex-wrap gap-4">
        <MetricTile label="Sets (Day)" value={dailyTotals.sets} />
        <MetricTile label="Tonnage" value={dailyTotals.tonnage.toLocaleString()} unit="lb" />
        <MetricTile label="Vol-Load" value={dailyTotals.volumeLoad.toLocaleString()} unit="lb" />
      </div>

      {/* Week/Block/Program Sets */}
      <div className="flex gap-4">
        {['Week','Block','Program'].map(tf => (
          <MetricTile key={tf} label={`${tf} Sets`} value={totals[tf].sets} />
        ))}
      </div>

      {/* RIR, Steps, Body Weight */}
      <div className="flex gap-4">
        <MetricTile label="Avg RIR (Wk)" value={avgRIR.week} />
        <MetricTile label="Steps (Day)" value={steps.day.toLocaleString()} />
        <MetricTile label="BW" value={body.weight} unit="lb" />
      </div>

      {/* Performance 1RMs */}
      <div className="flex gap-4">
        <MetricTile label="Bench 1RM" value={oneRM.bench} unit="lb" />
        <MetricTile label="Squat 1RM" value={oneRM.squat} unit="lb" />
        <MetricTile label="Dead 1RM" value={oneRM.deadlift} unit="lb" />
      </div>

      {/* Fatigue Gauge Section */}
      <div className="flex flex-col items-center p-6 bg-surface/30 rounded-lg border border-white/10">
        <div className="text-textMed text-sm mb-4">Current Fatigue Level</div>
        <div className="max-w-[200px]">
          <VintageFatigueGauge 
            value={state?.fatigueScore || 45} 
            label="Fatigue Level"
          />
        </div>
      </div>

      {/* Demo Data Button */}
      <button 
        onClick={() => seedMockSets(context)} 
        className="absolute bottom-4 right-4 text-xs bg-white/10 hover:bg-accent px-2 py-1 rounded"
      >
        Load Demo Data
      </button>
    </div>
  );
}