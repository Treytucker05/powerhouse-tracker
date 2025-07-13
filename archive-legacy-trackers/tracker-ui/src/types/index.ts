/// <reference path="./declarations.d.ts" />

// src/types/index.ts
// Core PowerHouse Tracker TypeScript Interfaces

export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  units: 'metric' | 'imperial';
  theme: 'dark' | 'light';
  goal_type: 'strength' | 'hypertrophy' | 'endurance';
}

// Workout & Exercise Types
export interface Exercise {
  id: string;
  name: string;
  muscle_groups: MuscleGroup[];
  equipment?: string;
  instructions?: string;
}

export interface WorkoutSet {
  id: string;
  exercise_id: string;
  set_number: number;
  reps: number;
  weight: number; // in kg or lbs based on user preference
  rir?: number; // Reps in Reserve
  rest_time?: number; // seconds
  completed_at: string;
}

export interface WorkoutSession {
  id: string;
  user_id: string;
  program_id?: string;
  session_type: SessionType;
  start_time: string;
  end_time?: string;
  exercises: Exercise[];
  sets: WorkoutSet[];
  notes?: string;
  fatigue_rating?: number; // 1-10 scale
}

// Volume & Tonnage Types
export type MuscleGroup = 
  | 'chest' 
  | 'back' 
  | 'shoulders' 
  | 'biceps' 
  | 'triceps' 
  | 'quads' 
  | 'hamstrings' 
  | 'glutes' 
  | 'calves' 
  | 'abs';

export type TimeFrame = 'day' | 'week' | 'block' | 'program';

export interface VolumeData {
  muscle: MuscleGroup;
  sets: number;
  reps: number;
  volume: number; // Sets × Reps
  tonnage: number; // Sets × Reps × Weight
  volume_load: number; // Comprehensive workload metric
}

export interface VolumeLandmarks {
  mv: number;  // Maintenance Volume
  mev: number; // Minimum Effective Volume
  mav: number; // Maximum Adaptive Volume
  mrv: number; // Maximum Recoverable Volume
}

export interface MuscleVolumeData {
  muscle: MuscleGroup;
  current_volume: number;
  landmarks: VolumeLandmarks;
  fatigue_level: 'low' | 'moderate' | 'high';
}

// Programming & Periodization Types
export interface Program {
  id: string;
  name: string;
  user_id: string;
  goal_type: 'strength' | 'hypertrophy' | 'endurance';
  duration_weeks: number;
  created_at: string;
  blocks: ProgramBlock[];
}

export interface ProgramBlock {
  id: string;
  program_id: string;
  block_number: number;
  name: string;
  duration_weeks: number;
  focus: 'accumulation' | 'intensification' | 'realization' | 'deload';
  weeks: ProgramWeek[];
}

export interface ProgramWeek {
  id: string;
  block_id: string;
  week_number: number;
  is_deload: boolean;
  planned_sessions: PlannedSession[];
}

export interface PlannedSession {
  id: string;
  week_id: string;
  day_of_week: number; // 0-6 (Sunday-Saturday)
  session_type: SessionType;
  planned_exercises: PlannedExercise[];
}

export interface PlannedExercise {
  exercise_id: string;
  target_sets: number;
  target_reps_min: number;
  target_reps_max: number;
  target_rir: number;
  load_percentage?: number; // % of 1RM
}

export type SessionType = 
  | 'push' 
  | 'pull' 
  | 'legs' 
  | 'upper' 
  | 'lower' 
  | 'full_body'
  | 'cardio'
  | 'rest';

// Dashboard Metrics Types
export interface DashboardMetrics {
  current_week: number;
  current_block: number;
  days_until_deload: number;
  weekly_volume: VolumeData[];
  fatigue_score: number; // 0-100
  adherence_rate: number; // 0-100 percentage
  progression_trend: 'improving' | 'stable' | 'declining';
}

export interface PerformanceMetrics {
  estimated_1rm: Record<string, number>; // exercise_id -> 1RM estimate
  strength_ratios: {
    bench_squat: number;
    deadlift_squat: number;
    overhead_bench: number;
  };
  power_metrics?: {
    bar_speed: number; // m/s
    peak_power: number; // watts
  };
}

export interface BodyMetrics {
  weight: number;
  body_fat_percentage?: number;
  measurements: {
    chest?: number;
    waist?: number;
    thigh?: number;
    arm?: number;
  };
  recorded_at: string;
}

export interface ActivityData {
  date: string;
  steps: number;
  calories_burned?: number;
  active_minutes?: number;
}

// API Response Types
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  page_size: number;
  has_more: boolean;
}

// Supabase RPC Function Types
export interface VolumeQueryParams {
  user_id: string;
  timeframe: TimeFrame;
  start_date?: string;
  end_date?: string;
  muscle_groups?: MuscleGroup[];
}

export interface FatigueCalculationParams {
  user_id: string;
  muscle_groups: MuscleGroup[];
  time_window_days: number;
}

// State Management Types
export interface TrainingState {
  currentSession: WorkoutSession | null;
  volumeLandmarks: Record<MuscleGroup, VolumeLandmarks>;
  dashboardMetrics: DashboardMetrics | null;
  isLoading: boolean;
  error: string | null;
  // Legacy state properties from context
  fatigueScore?: number;
  loggedSets?: WorkoutSet[];
  currentMesocycle?: any;
  mrvTable?: Record<string, number>;
}

export interface TrainingActions {
  startSession: (sessionType: SessionType) => void;
  endSession: () => void;
  addSet: (set: Omit<WorkoutSet, 'id'>) => void;
  updateVolumeLandmarks: (muscle: MuscleGroup, landmarks: VolumeLandmarks) => void;
  loadDashboardData: () => Promise<void>;
}

// Training State Context Type
export interface TrainingStateContextType {
  state: TrainingState;
  dispatch?: React.Dispatch<any>;
  refreshDashboard?: () => void;
  [key: string]: any;
}

// Session Compliance Type
export interface SessionCompliance {
  completed: number;
  scheduled: number;
  percentage: number;
}

// Component Props Types
export interface DashboardCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  headerAction?: React.ReactNode;
}

export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
  color?: string;
}

export interface FatigueGaugeProps {
  value: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  animated?: boolean;
}

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type CreateInput<T> = Omit<T, 'id' | 'created_at' | 'updated_at'>;
export type UpdateInput<T> = Partial<CreateInput<T>> & { id: string };