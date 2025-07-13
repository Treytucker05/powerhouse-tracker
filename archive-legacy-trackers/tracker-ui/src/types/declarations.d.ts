// Type declarations for JavaScript modules

declare module '../../context/trainingStateContext' {
  import { TrainingStateContextType } from '../types';
  export function useTrainingState(): TrainingStateContextType | null;
  export function useAI(): string;
}

declare module '../../lib/selectors/dashboardSelectors' {
  export function getCurrentCycle(state: any): any;
  export function getWeeklySetTonnageByMuscle(state: any): { sets: Record<string, number>; tonnage: Record<string, number> };
  export function getAggregateVolume(vol: any): { totalSets: number; totalTon: number };
  export function getDaysToDeload(state: any): number;
  export function getMonthlyAggregates(state: any): { sets: number; tonnage: number; sessions: number; plannedSessions: number };
  export function getProgramAggregates(state: any): { sets: number; tonnage: number; sessions: number; plannedSessions: number };
  export function getSessionCompliance(state: any): { completed: number; scheduled: number; percentage: number };
  export function getMesocycleRIR(state: any): string | null;
  export function getWeeklyRIR(state: any): string | null;
  export function getCurrentDayName(state: any): string;
}

declare module '../../lib/dev/mockSetSeeder' {
  export function seedMockSets(context: any): void;
}

declare module './VintageFatigueGauge' {
  import React from 'react';
  interface VintageFatigueGaugeProps {
    value: number;
    label: string;
  }
  const VintageFatigueGauge: React.FC<VintageFatigueGaugeProps>;
  export default VintageFatigueGauge;
}

declare module '../ui/DashboardCard' {
  import React from 'react';
  interface DashboardCardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
  }
  const DashboardCard: React.FC<DashboardCardProps>;
  export default DashboardCard;
}
