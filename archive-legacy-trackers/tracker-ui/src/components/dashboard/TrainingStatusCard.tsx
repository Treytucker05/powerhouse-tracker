import React from 'react';
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
import type { 
  TrainingState, 
  TrainingStateContextType 
} from "../../types";

// Component-specific interfaces
interface CycleData {
  goal?: string;
  specializations?: string[];
  currentWeek?: number;
  weeks?: number;
  currentDay?: number;
}

interface VolumeAggregates {
  sets: Record<string, number>;
  tonnage: Record<string, number>;
}

interface AggregateVolume {
  totalSets: number;
  totalTon: number;
}

interface MonthlyAggregates {
  sets: number;
  tonnage: number;
  sessions: number;
  plannedSessions: number;
}

interface ProgramAggregates {
  sets: number;
  tonnage: number;
  sessions: number;
  plannedSessions: number;
}

interface ComplianceData {
  completed: number;
  scheduled: number;
  percentage: number;
}

// Props interface for the component
export interface TrainingStatusCardProps {
  className?: string;
}

const TrainingStatusCard: React.FC<TrainingStatusCardProps> = ({ className = "" }) => {
  const context: TrainingStateContextType | null = useTrainingState();
  
  if (!context) {
    return (
      <div className={`training-status-card overflow-safe ${className}`}>
        <div className="text-white">Loading training data...</div>
      </div>
    );
  }

  const state: TrainingState = context.state;
  const cycle: CycleData = getCurrentCycle(state);
  const vol: VolumeAggregates = getWeeklySetTonnageByMuscle(state) || { sets: {}, tonnage: {} };
  const agg: AggregateVolume = getAggregateVolume(vol);

  // Debug logging with proper typing
  console.log('TrainingStatusCard state:', {
    fatigueScore: state?.fatigueScore,
    loggedSets: state?.loggedSets?.length || 0,
    cycleData: state?.currentMesocycle,
    vol: vol
  });

  /* Helper functions with proper typing */
  const showDeloadBanner: boolean =
    (state?.fatigueScore ?? 0) >= 85 ||
    Object.values(vol.sets).some(
      (sets: number, i: number) => sets >= (state?.mrvTable?.[Object.keys(vol.sets)[i]] ?? 0) * 0.9
    );
  
  const daysToDeload: number = getDaysToDeload(state);
  const monthlyAgg: MonthlyAggregates = getMonthlyAggregates(state);
  const programAgg: ProgramAggregates = getProgramAggregates(state);
  const compliance: ComplianceData = getSessionCompliance(state);
  const weeklyRIR: string | null = getWeeklyRIR(state);
  const mesocycleRIR: string | null = getMesocycleRIR(state);
  const currentDayName: string = getCurrentDayName(state);

  // Helper function to format numbers with commas
  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };

  return (
    <div className={`training-status-card overflow-safe ${className}`}>
      {/* Enhanced Header with Better Typography Hierarchy */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start spacing-responsive-lg gap-4 lg:gap-6">
        <div className="min-w-0 flex-1">
          {/* Main Program Title - More Prominent */}
          <h1 className="responsive-text-4xl font-bold text-white spacing-responsive-md leading-tight">
            {cycle?.goal || 'Hypertrophy'}
          </h1>
          {/* Subtitle - Smaller and Secondary */}
          {cycle?.specializations && cycle.specializations.length > 0 && (
            <p className="responsive-text-lg text-gray-300 font-medium">
              Focus: {cycle.specializations.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(" • ")}
            </p>
          )}
        </div>
        {/* Program Progress - Better Alignment */}
        <div className="text-left lg:text-right flex-shrink-0 space-y-1 lg:space-y-2">
          <div className="text-white font-bold responsive-text-lg leading-tight">
            Week {cycle?.currentWeek || 1}/{cycle?.weeks || 6} • Day {cycle?.currentDay || 1}
          </div>
          <div className="text-gray-300 font-medium text-sm lg:text-base">
            {currentDayName}
          </div>
          <div className="text-gray-400 text-xs lg:text-sm font-medium">
            {daysToDeload > 0 ? `${daysToDeload} days to deload` : 'Deload week'}
          </div>
        </div>
      </div>

      {/* Professional Training Data Table */}
      <div className="spacing-responsive-lg">
        <div className="responsive-table-container bg-gray-800/20 border border-gray-700/50">
          <table className="responsive-table">
            <thead>
              <tr className="bg-gray-800/50 border-b-2 border-gray-600">
                <th className="text-left padding-responsive-md text-white font-bold responsive-text-lg tracking-wide">
                  Muscle Group
                </th>
                <th className="text-right padding-responsive-md text-white font-bold responsive-text-lg tracking-wide">
                  Sets
                </th>
                <th className="text-right padding-responsive-md text-white font-bold responsive-text-lg tracking-wide">
                  Tonnage (lb)
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(vol.sets)
                .sort((a: string, b: string) => vol.tonnage[b] - vol.tonnage[a])
                .map((muscle: string, index: number) => (
                  <tr 
                    key={muscle} 
                    className={`border-b border-gray-700/40 hover:bg-gray-800/30 transition-colors duration-200 ${
                      index % 2 === 0 ? 'bg-gray-800/10' : 'bg-transparent'
                    }`}
                  >
                    <td className="padding-responsive-sm text-white font-medium responsive-text-lg capitalize">
                      {muscle}
                    </td>
                    <td className="padding-responsive-sm text-gray-300 font-semibold responsive-text-lg text-right tabular-nums">
                      {vol.sets[muscle]}
                    </td>
                    <td className="padding-responsive-sm text-gray-300 font-semibold responsive-text-lg text-right tabular-nums">
                      {formatNumber(vol.tonnage[muscle])}
                    </td>
                  </tr>
                ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-800/40 border-t-2 border-gray-600">
                <td className="padding-responsive-md text-white font-bold responsive-text-lg">
                  Total
                </td>
                <td className="padding-responsive-md text-white font-bold responsive-text-lg text-right tabular-nums">
                  {agg.totalSets}
                </td>
                <td className="padding-responsive-md text-white font-bold responsive-text-lg text-right tabular-nums">
                  {formatNumber(agg.totalTon)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Visual Separator */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent spacing-responsive-lg"></div>

      {/* Aggregate Volume & Load */}
      <div className="grid-responsive-3 spacing-responsive-lg">
        <div className="text-center padding-responsive-md bg-gray-800/30 border border-primary-red/20 rounded-lg backdrop-blur-sm min-w-0">
          <div className="text-gray-400 text-xs lg:text-sm font-medium mb-2">Week</div>
          <div className="responsive-text-3xl font-bold text-white mb-1">{agg.totalSets}</div>
          <div className="text-xs text-gray-400 mb-2">sets</div>
          <div className="responsive-text-lg font-semibold text-white mb-1">{formatNumber(agg.totalTon)}</div>
          <div className="text-xs text-gray-400 mb-2">lb</div>
          <div className="text-xs lg:text-sm text-accent-red font-medium">{compliance.completed}/{compliance.scheduled} sessions</div>
        </div>
        <div className="text-center padding-responsive-md bg-gray-800/30 border border-primary-red/20 rounded-lg backdrop-blur-sm min-w-0">
          <div className="text-gray-400 text-xs lg:text-sm font-medium mb-2">Month</div>
          <div className="responsive-text-3xl font-bold text-white mb-1">{monthlyAgg.sets}</div>
          <div className="text-xs text-gray-400 mb-2">sets</div>
          <div className="responsive-text-lg font-semibold text-white mb-1">{formatNumber(monthlyAgg.tonnage)}</div>
          <div className="text-xs text-gray-400 mb-2">lb</div>
          <div className="text-xs lg:text-sm text-accent-red font-medium">{monthlyAgg.sessions}/{monthlyAgg.plannedSessions} sessions</div>
        </div>
        <div className="text-center padding-responsive-md bg-gray-800/30 border border-primary-red/20 rounded-lg backdrop-blur-sm min-w-0">
          <div className="text-gray-400 text-xs lg:text-sm font-medium mb-2">Program</div>
          <div className="responsive-text-3xl font-bold text-white mb-1">{programAgg.sets}</div>
          <div className="text-xs text-gray-400 mb-2">sets</div>
          <div className="responsive-text-lg font-semibold text-white mb-1">{formatNumber(programAgg.tonnage)}</div>
          <div className="text-xs text-gray-400 mb-2">lb</div>
          <div className="text-xs lg:text-sm text-accent-red font-medium">{programAgg.sessions}/{programAgg.plannedSessions} sessions</div>
        </div>
      </div>

      {/* Intensity & Effort */}
      <div className="grid-responsive-2 spacing-responsive-lg">
        <div className="padding-responsive-md bg-gray-800/30 rounded-lg border border-primary-red/20 min-w-0">
          <div className="text-gray-400 text-xs lg:text-sm font-medium mb-2">Weekly Average RIR</div>
          <div className="responsive-text-3xl font-bold text-white">{weeklyRIR ?? "--"}</div>
          <div className="text-xs text-gray-400 mt-1">reps in reserve</div>
        </div>
        <div className="padding-responsive-md bg-gray-800/30 rounded-lg border border-primary-red/20 min-w-0">
          <div className="text-gray-400 text-xs lg:text-sm font-medium mb-2">Mesocycle Average RIR</div>
          <div className="responsive-text-3xl font-bold text-white">{mesocycleRIR ?? "--"}</div>
          <div className="text-xs text-gray-400 mt-1">reps in reserve</div>
        </div>
      </div>

      {/* Fatigue & Compliance */}
      <div className="grid-responsive-2 spacing-responsive-lg">
        {/* Fatigue Card */}
        <div className="padding-responsive-md bg-gray-800/30 rounded-lg border border-primary-red/20 flex items-center justify-center min-w-0">
          <div className="gauge-container">
            <VintageFatigueGauge 
              value={state?.fatigueScore || 45} 
              label="Fatigue Level"
            />
          </div>
        </div>

        {/* Compliance & Performance Card */}
        <div className="padding-responsive-md bg-gray-800/30 rounded-lg border border-primary-red/20 min-w-0">
          <div className="text-gray-400 text-xs lg:text-sm font-medium mb-3">Performance Metrics</div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-xs lg:text-sm">Session Adherence</span>
              <span className="responsive-text-lg font-bold text-accent-red">{compliance.percentage}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-accent-red to-primary-red h-2 rounded-full transition-all duration-300"
                style={{ width: `${compliance.percentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-gray-300 text-xs lg:text-sm">Weekly RIR</span>
              <span className="responsive-text-lg font-bold text-white">{weeklyRIR ?? "--"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Deload banner */}
      {showDeloadBanner && (
        <div className="padding-responsive-md bg-gradient-to-r from-dark-red/40 to-primary-red/40 text-white rounded-lg border border-accent-red/50 spacing-responsive-md" style={{ boxShadow: '0 0 20px rgba(220, 38, 38, 0.4)' }}>
          <div className="flex items-center">
            <span className="mr-3 text-lg">🔔</span>
            <span className="font-semibold">High fatigue detected — consider deload soon!</span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex-responsive-column mt-auto spacing-responsive-md">
        <button
          onClick={() => context?.refreshDashboard?.() || console.log('Refresh clicked')}
          className="btn-responsive btn-premium-outline flex-1 min-w-0"
          type="button"
        >
          Refresh
        </button>

        {/* Dev-only mock data button */}
        {import.meta.env.DEV && (
          <button
            onClick={() => seedMockSets(context)}
            className="btn-responsive btn-premium flex-1 min-w-0"
            type="button"
          >
            Load sample data
          </button>
        )}
      </div>
    </div>
  );
};

export default TrainingStatusCard;
