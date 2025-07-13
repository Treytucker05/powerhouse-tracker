// src/lib/supabaseClient.ts
// TypeScript Supabase client with comprehensive database type definitions

import { createClient } from '@supabase/supabase-js';

// ============================================================================
// DATABASE TYPE DEFINITIONS
// ============================================================================

// User and Profile Types
export interface Profile {
  id: string;
  email: string;
  name?: string;
  preferences?: UserPreferences;
  created_at: string;
  updated_at: string;
}

export interface UserPreferences {
  units?: 'metric' | 'imperial';
  theme?: 'dark' | 'light';
  goal_type?: 'strength' | 'hypertrophy' | 'endurance';
  [key: string]: any;
}

// Exercise and Training Types
export interface DatabaseExercise {
  id: string;
  name: string;
  muscle_groups: string[];
  equipment?: string;
  instructions?: string;
  created_at: string;
}

export interface DatabaseProgram {
  id: string;
  user_id: string;
  name: string;
  goal_type: 'strength' | 'hypertrophy' | 'endurance';
  duration_weeks: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DatabaseProgramBlock {
  id: string;
  program_id: string;
  block_number: number;
  name: string;
  duration_weeks: number;
  focus: 'accumulation' | 'intensification' | 'realization' | 'deload';
  created_at: string;
}

export interface DatabaseProgramWeek {
  id: string;
  block_id: string;
  week_number: number;
  is_deload: boolean;
  created_at: string;
}

export interface DatabasePlannedSession {
  id: string;
  week_id: string;
  day_of_week: number; // 0-6 (Sunday-Saturday)
  session_type: SessionType;
  created_at: string;
}

export interface DatabasePlannedExercise {
  id: string;
  session_id: string;
  exercise_id: string;
  target_sets: number;
  target_reps_min: number;
  target_reps_max: number;
  target_rir?: number;
  load_percentage?: number;
  order_index: number;
  created_at: string;
}

export interface DatabaseWorkoutSession {
  id: string;
  user_id: string;
  program_id?: string;
  planned_session_id?: string;
  session_type: SessionType;
  start_time: string;
  end_time?: string;
  notes?: string;
  fatigue_rating?: number; // 1-10
  created_at: string;
}

export interface DatabaseWorkoutSet {
  id: string;
  session_id: string;
  exercise_id: string;
  set_number: number;
  reps: number;
  weight: number;
  rir?: number;
  rest_time?: number; // seconds
  completed_at: string;
  created_at: string;
}

export interface DatabaseVolumeLandmark {
  id: string;
  user_id: string;
  muscle_group: string;
  mv: number; // Maintenance Volume
  mev: number; // Minimum Effective Volume
  mav: number; // Maximum Adaptive Volume
  mrv: number; // Maximum Recoverable Volume
  updated_at: string;
}

export interface DatabaseBodyMetric {
  id: string;
  user_id: string;
  weight?: number;
  body_fat_percentage?: number;
  measurements?: Record<string, number>; // chest, waist, thigh, arm
  recorded_at: string;
  created_at: string;
}

export interface DatabaseActivityData {
  id: string;
  user_id: string;
  date: string; // YYYY-MM-DD
  steps: number;
  calories_burned?: number;
  active_minutes?: number;
  created_at: string;
}

// Utility Types
export type SessionType = 
  | 'push' 
  | 'pull' 
  | 'legs' 
  | 'upper' 
  | 'lower' 
  | 'full_body'
  | 'cardio'
  | 'rest';

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

// Database Schema Definition
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>;
      };
      exercises: {
        Row: DatabaseExercise;
        Insert: Omit<DatabaseExercise, 'id' | 'created_at'>;
        Update: Partial<Omit<DatabaseExercise, 'id' | 'created_at'>>;
      };
      programs: {
        Row: DatabaseProgram;
        Insert: Omit<DatabaseProgram, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<DatabaseProgram, 'id' | 'created_at' | 'updated_at'>>;
      };
      program_blocks: {
        Row: DatabaseProgramBlock;
        Insert: Omit<DatabaseProgramBlock, 'id' | 'created_at'>;
        Update: Partial<Omit<DatabaseProgramBlock, 'id' | 'created_at'>>;
      };
      program_weeks: {
        Row: DatabaseProgramWeek;
        Insert: Omit<DatabaseProgramWeek, 'id' | 'created_at'>;
        Update: Partial<Omit<DatabaseProgramWeek, 'id' | 'created_at'>>;
      };
      planned_sessions: {
        Row: DatabasePlannedSession;
        Insert: Omit<DatabasePlannedSession, 'id' | 'created_at'>;
        Update: Partial<Omit<DatabasePlannedSession, 'id' | 'created_at'>>;
      };
      planned_exercises: {
        Row: DatabasePlannedExercise;
        Insert: Omit<DatabasePlannedExercise, 'id' | 'created_at'>;
        Update: Partial<Omit<DatabasePlannedExercise, 'id' | 'created_at'>>;
      };
      workout_sessions: {
        Row: DatabaseWorkoutSession;
        Insert: Omit<DatabaseWorkoutSession, 'id' | 'created_at'>;
        Update: Partial<Omit<DatabaseWorkoutSession, 'id' | 'created_at'>>;
      };
      workout_sets: {
        Row: DatabaseWorkoutSet;
        Insert: Omit<DatabaseWorkoutSet, 'id' | 'created_at'>;
        Update: Partial<Omit<DatabaseWorkoutSet, 'id' | 'created_at'>>;
      };
      volume_landmarks: {
        Row: DatabaseVolumeLandmark;
        Insert: Omit<DatabaseVolumeLandmark, 'id' | 'updated_at'>;
        Update: Partial<Omit<DatabaseVolumeLandmark, 'id' | 'updated_at'>>;
      };
      body_metrics: {
        Row: DatabaseBodyMetric;
        Insert: Omit<DatabaseBodyMetric, 'id' | 'created_at'>;
        Update: Partial<Omit<DatabaseBodyMetric, 'id' | 'created_at'>>;
      };
      activity_data: {
        Row: DatabaseActivityData;
        Insert: Omit<DatabaseActivityData, 'id' | 'created_at'>;
        Update: Partial<Omit<DatabaseActivityData, 'id' | 'created_at'>>;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      // RPC functions will be defined here
      calculate_volume_metrics: {
        Args: {
          user_id: string;
          start_date: string;
          end_date: string;
          muscle_groups?: string[];
        };
        Returns: {
          muscle_group: string;
          total_sets: number;
          total_reps: number;
          total_volume: number;
          total_tonnage: number;
          volume_load: number;
        }[];
      };
      calculate_fatigue_score: {
        Args: {
          user_id: string;
          muscle_groups: string[];
          time_window_days: number;
        };
        Returns: {
          fatigue_score: number;
          contributing_factors: Record<string, number>;
        };
      };
      get_volume_progression: {
        Args: {
          user_id: string;
          muscle_group: string;
          weeks_back: number;
        };
        Returns: {
          week_start: string;
          total_sets: number;
          total_tonnage: number;
          sessions_count: number;
        }[];
      };
    };
    Enums: {
      session_type: SessionType;
      goal_type: 'strength' | 'hypertrophy' | 'endurance';
      focus_type: 'accumulation' | 'intensification' | 'realization' | 'deload';
    };
  };
}

// ============================================================================
// SUPABASE CLIENT CONFIGURATION
// ============================================================================

// Environment variable validation
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:');
  console.error('- VITE_SUPABASE_URL:', supabaseUrl ? '✓' : '✗');
  console.error('- VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✓' : '✗');
  throw new Error('Missing required Supabase environment variables. Please check your .env file.');
}

// Create typed Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'x-client-info': 'powerhouse-tracker'
    }
  }
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get the current authenticated user ID
 */
const getCurrentUserId = async (): Promise<string | null> => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Error getting current user:', error);
      return null;
    }
    return user?.id || null;
  } catch (error) {
    console.error('Error in getCurrentUserId:', error);
    return null;
  }
};

/**
 * Get the current authenticated user profile
 */
const getCurrentUserProfile = async (): Promise<Profile | null> => {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error getting user profile:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getCurrentUserProfile:', error);
    return null;
  }
};

/**
 * Check if user is authenticated
 */
/**
 * Check if user is authenticated
 */
const isAuthenticated = async (): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return !!user;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};

/**
 * Sign out the current user
 */
/**
 * Sign out the current user
 */
const signOut = async (): Promise<void> => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in signOut:', error);
    throw error;
  }
};

/**
 * Type-safe table access helpers
 */
/**
 * Type-safe table access helpers
 */
const tables = {
  profiles: () => supabase.from('profiles'),
  exercises: () => supabase.from('exercises'),
  programs: () => supabase.from('programs'),
  programBlocks: () => supabase.from('program_blocks'),
  programWeeks: () => supabase.from('program_weeks'),
  plannedSessions: () => supabase.from('planned_sessions'),
  plannedExercises: () => supabase.from('planned_exercises'),
  workoutSessions: () => supabase.from('workout_sessions'),
  workoutSets: () => supabase.from('workout_sets'),
  volumeLandmarks: () => supabase.from('volume_landmarks'),
  bodyMetrics: () => supabase.from('body_metrics'),
  activityData: () => supabase.from('activity_data'),
} as const;

/**
 * Type-safe RPC function helpers
 */
const rpc = {
  calculateVolumeMetrics: (params: Database['public']['Functions']['calculate_volume_metrics']['Args']) =>
    supabase.rpc('calculate_volume_metrics', params),
  
  calculateFatigueScore: (params: Database['public']['Functions']['calculate_fatigue_score']['Args']) =>
    supabase.rpc('calculate_fatigue_score', params),
  
  getVolumeProgression: (params: Database['public']['Functions']['get_volume_progression']['Args']) =>
    supabase.rpc('get_volume_progression', params),
} as const;

// Create an extended client with helper functions
const extendedSupabase = Object.assign(supabase, {
  getCurrentUserId,
  getCurrentUserProfile,
  isAuthenticated,
  signOut,
  tables,
  rpc,
});

// Export the extended client as the default and only export
export default extendedSupabase;

// Export types for external use
export type PowerHouseSupabaseClient = typeof extendedSupabase;
export type Tables = Database['public']['Tables'];
export type Functions = Database['public']['Functions'];
export type Enums = Database['public']['Enums'];
