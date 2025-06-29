// Development seed data for PowerHouse Tracker
// Implements comprehensive seeding using the new database schema

import { supabase } from './supabaseClient';
import type { 
  Exercise,
  SessionType
} from '../types';

// Database table interfaces for seeding
interface DatabaseWorkoutSession {
  id?: string;
  user_id: string;
  program_id?: string;
  session_type: SessionType;
  start_time: string;
  end_time?: string;
  notes?: string;
  fatigue_rating?: number;
}

interface DatabaseWorkoutSet {
  id?: string;
  session_id: string;
  exercise_id: string;
  set_number: number;
  reps: number;
  weight: number;
  rir?: number;
  rest_time?: number;
  completed_at: string;
}

interface DatabaseExercise {
  id?: string;
  name: string;
  muscle_groups: string[];
  equipment?: string;
  instructions?: string;
}

interface DatabaseBodyMetric {
  id?: string;
  user_id: string;
  weight?: number;
  body_fat_percentage?: number;
  measurements?: Record<string, number>;
  recorded_at: string;
}

interface DatabaseActivityData {
  id?: string;
  user_id: string;
  date: string;
  steps?: number;
  calories_burned?: number;
  active_minutes?: number;
}

// ============================================================================
// SEED DATA CONFIGURATIONS
// ============================================================================

interface SeedConfig {
  userId: string;
  weeksBack: number;
  sessionsPerWeek: number;
  setsPerSession: number;
  generateVolumeLandmarks: boolean;
  generateBodyMetrics: boolean;
  generateActivityData: boolean;
}

const DEFAULT_SEED_CONFIG: Partial<SeedConfig> = {
  weeksBack: 8,
  sessionsPerWeek: 4,
  setsPerSession: 20,
  generateVolumeLandmarks: true,
  generateBodyMetrics: true,
  generateActivityData: true,
};

// Sample exercises for seeding
const SAMPLE_EXERCISES: Omit<DatabaseExercise, 'id'>[] = [
  { name: 'Barbell Bench Press', muscle_groups: ['chest', 'triceps', 'shoulders'], equipment: 'Barbell', instructions: 'Press barbell from chest to full extension' },
  { name: 'Incline Dumbbell Press', muscle_groups: ['chest', 'triceps', 'shoulders'], equipment: 'Dumbbells', instructions: 'Press dumbbells on incline bench' },
  { name: 'Dumbbell Flyes', muscle_groups: ['chest'], equipment: 'Dumbbells', instructions: 'Fly dumbbells in arc motion' },
  { name: 'Pull-ups', muscle_groups: ['back', 'biceps'], equipment: 'Pull-up Bar', instructions: 'Pull body up to bar' },
  { name: 'Barbell Rows', muscle_groups: ['back', 'biceps'], equipment: 'Barbell', instructions: 'Row barbell to lower chest' },
  { name: 'Lat Pulldowns', muscle_groups: ['back', 'biceps'], equipment: 'Cable Machine', instructions: 'Pull cable bar to chest' },
  { name: 'Overhead Press', muscle_groups: ['shoulders', 'triceps'], equipment: 'Barbell', instructions: 'Press barbell overhead' },
  { name: 'Lateral Raises', muscle_groups: ['shoulders'], equipment: 'Dumbbells', instructions: 'Raise dumbbells to sides' },
  { name: 'Barbell Curls', muscle_groups: ['biceps'], equipment: 'Barbell', instructions: 'Curl barbell to chest' },
  { name: 'Close-Grip Bench Press', muscle_groups: ['triceps', 'chest'], equipment: 'Barbell', instructions: 'Bench press with narrow grip' },
  { name: 'Squats', muscle_groups: ['quads', 'glutes'], equipment: 'Barbell', instructions: 'Squat with barbell on back' },
  { name: 'Romanian Deadlifts', muscle_groups: ['hamstrings', 'glutes'], equipment: 'Barbell', instructions: 'Deadlift with stiff legs' },
  { name: 'Leg Press', muscle_groups: ['quads', 'glutes'], equipment: 'Machine', instructions: 'Press weight with legs' },
  { name: 'Calf Raises', muscle_groups: ['calves'], equipment: 'Machine', instructions: 'Raise up on toes' },
  { name: 'Planks', muscle_groups: ['abs'], equipment: 'Bodyweight', instructions: 'Hold plank position' },
];

// Volume landmarks for different experience levels
const VOLUME_LANDMARKS = {
  beginner: {
    chest: { mv: 6, mev: 8, mav: 14, mrv: 18 },
    back: { mv: 8, mev: 10, mav: 18, mrv: 22 },
    shoulders: { mv: 6, mev: 8, mav: 14, mrv: 18 },
    biceps: { mv: 4, mev: 6, mav: 12, mrv: 16 },
    triceps: { mv: 4, mev: 6, mav: 12, mrv: 16 },
    quads: { mv: 8, mev: 10, mav: 18, mrv: 22 },
    hamstrings: { mv: 6, mev: 8, mav: 14, mrv: 18 },
    glutes: { mv: 6, mev: 8, mav: 14, mrv: 18 },
    calves: { mv: 6, mev: 8, mav: 14, mrv: 18 },
    abs: { mv: 4, mev: 6, mav: 12, mrv: 16 },
  },
  intermediate: {
    chest: { mv: 8, mev: 10, mav: 18, mrv: 22 },
    back: { mv: 10, mev: 12, mav: 20, mrv: 25 },
    shoulders: { mv: 8, mev: 10, mav: 16, mrv: 20 },
    biceps: { mv: 6, mev: 8, mav: 14, mrv: 18 },
    triceps: { mv: 6, mev: 8, mav: 14, mrv: 18 },
    quads: { mv: 10, mev: 12, mav: 20, mrv: 25 },
    hamstrings: { mv: 8, mev: 10, mav: 16, mrv: 20 },
    glutes: { mv: 8, mev: 10, mav: 16, mrv: 20 },
    calves: { mv: 8, mev: 10, mav: 16, mrv: 20 },
    abs: { mv: 6, mev: 8, mav: 14, mrv: 18 },
  },
  advanced: {
    chest: { mv: 10, mev: 12, mav: 20, mrv: 25 },
    back: { mv: 12, mev: 14, mav: 22, mrv: 28 },
    shoulders: { mv: 10, mev: 12, mav: 18, mrv: 22 },
    biceps: { mv: 8, mev: 10, mav: 16, mrv: 20 },
    triceps: { mv: 8, mev: 10, mav: 16, mrv: 20 },
    quads: { mv: 12, mev: 14, mav: 22, mrv: 28 },
    hamstrings: { mv: 10, mev: 12, mav: 18, mrv: 22 },
    glutes: { mv: 10, mev: 12, mav: 18, mrv: 22 },
    calves: { mv: 10, mev: 12, mav: 18, mrv: 22 },
    abs: { mv: 8, mev: 10, mav: 16, mrv: 20 },
  },
} as const;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Generate random number within range
 */
const randomBetween = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Generate random weight based on exercise and progression
 */
const generateWeight = (exerciseName: string, weekNumber: number): number => {
  const baseWeights: Record<string, number> = {
    'Barbell Bench Press': 185,
    'Incline Dumbbell Press': 70,
    'Dumbbell Flyes': 35,
    'Pull-ups': 0, // bodyweight
    'Barbell Rows': 155,
    'Lat Pulldowns': 140,
    'Overhead Press': 115,
    'Lateral Raises': 25,
    'Barbell Curls': 85,
    'Close-Grip Bench Press': 155,
    'Squats': 225,
    'Romanian Deadlifts': 185,
    'Leg Press': 315,
    'Calf Raises': 200,
    'Planks': 0, // bodyweight
  };

  const baseWeight = baseWeights[exerciseName] || 135;
  const progression = 1 + (weekNumber * 0.025); // 2.5% increase per week
  const variation = 0.9 + Math.random() * 0.2; // ±10% variation
  
  return Math.round(baseWeight * progression * variation);
};

/**
 * Generate realistic rep count based on exercise
 */
const generateReps = (exerciseName: string): number => {
  const repRanges: Record<string, [number, number]> = {
    'Barbell Bench Press': [6, 8],
    'Incline Dumbbell Press': [8, 12],
    'Dumbbell Flyes': [10, 15],
    'Pull-ups': [6, 12],
    'Barbell Rows': [6, 8],
    'Lat Pulldowns': [8, 12],
    'Overhead Press': [6, 8],
    'Lateral Raises': [12, 15],
    'Barbell Curls': [8, 12],
    'Close-Grip Bench Press': [8, 10],
    'Squats': [6, 8],
    'Romanian Deadlifts': [8, 10],
    'Leg Press': [10, 15],
    'Calf Raises': [15, 20],
    'Planks': [30, 60], // seconds, but we'll treat as reps
  };

  const [min, max] = repRanges[exerciseName] || [8, 12];
  return randomBetween(min, max);
};

/**
 * Generate RIR (Reps in Reserve) based on week in mesocycle
 */
const generateRIR = (weekInMesocycle: number): number => {
  // Start higher RIR early in mesocycle, decrease as it progresses
  if (weekInMesocycle <= 2) return randomBetween(3, 4);
  if (weekInMesocycle <= 4) return randomBetween(2, 3);
  if (weekInMesocycle <= 6) return randomBetween(1, 2);
  return randomBetween(0, 1); // Peak intensity
};

// ============================================================================
// SEEDING FUNCTIONS
// ============================================================================

/**
 * Seed exercises into the database
 */
export const seedExercises = async (): Promise<Exercise[]> => {
  console.log('🏋️ Seeding exercises...');
  
  try {
    const { data, error } = await supabase
      .from('exercises')
      .upsert(SAMPLE_EXERCISES, { onConflict: 'name' })
      .select();

    if (error) throw error;

    console.log(`✅ Seeded ${data.length} exercises`);
    return data as Exercise[];
  } catch (error) {
    console.error('❌ Failed to seed exercises:', error);
    throw error;
  }
};

/**
 * Seed volume landmarks for a user
 */
export const seedVolumeLandmarks = async (
  userId: string, 
  experienceLevel: 'beginner' | 'intermediate' | 'advanced' = 'intermediate'
): Promise<void> => {
  console.log(`📊 Seeding volume landmarks for ${experienceLevel} user...`);
  
  try {
    const landmarks = VOLUME_LANDMARKS[experienceLevel];
    const landmarkData = Object.entries(landmarks).map(([muscle, values]) => ({
      user_id: userId,
      muscle_group: muscle,
      ...values,
    }));

    const { error } = await supabase
      .from('volume_landmarks')
      .upsert(landmarkData, { onConflict: 'user_id,muscle_group' });

    if (error) throw error;

    console.log(`✅ Seeded volume landmarks for ${Object.keys(landmarks).length} muscle groups`);
  } catch (error) {
    console.error('❌ Failed to seed volume landmarks:', error);
    throw error;
  }
};

/**
 * Seed realistic workout sessions and sets
 */
export const seedWorkoutData = async (
  userId: string,
  config: Partial<SeedConfig> = {}
): Promise<void> => {
  const finalConfig: SeedConfig = { ...DEFAULT_SEED_CONFIG, userId, ...config } as SeedConfig;
  
  console.log(`🏃 Seeding ${finalConfig.weeksBack} weeks of workout data...`);
  
  try {
    // Get exercises to use
    const { data: exercises } = await supabase
      .from('exercises')
      .select('*')
      .limit(15);

    if (!exercises?.length) {
      throw new Error('No exercises found. Seed exercises first.');
    }

    const sessionTypes: SessionType[] = ['push', 'pull', 'legs', 'upper'];
    const sessions: DatabaseWorkoutSession[] = [];
    const allSets: DatabaseWorkoutSet[] = [];

    // Generate sessions for each week
    for (let week = 0; week < finalConfig.weeksBack; week++) {
      const weekStartDate = new Date();
      weekStartDate.setDate(weekStartDate.getDate() - (week * 7));

      for (let session = 0; session < finalConfig.sessionsPerWeek; session++) {
        const sessionDate = new Date(weekStartDate);
        sessionDate.setDate(sessionDate.getDate() + (session * 2)); // Space sessions out

        const sessionType = sessionTypes[session % sessionTypes.length];
        const sessionId = `session_${week}_${session}_${Date.now()}`;

        // Create session
        const workoutSession: DatabaseWorkoutSession = {
          user_id: userId,
          program_id: undefined,
          session_type: sessionType,
          start_time: sessionDate.toISOString(),
          end_time: new Date(sessionDate.getTime() + 90 * 60 * 1000).toISOString(), // 90 min sessions
          notes: `${sessionType} session - Week ${week + 1}`,
          fatigue_rating: randomBetween(3, 8),
        };

        sessions.push(workoutSession);

        // Generate sets for this session
        const sessionExercises = exercises
          .filter(ex => {
            // Filter exercises based on session type
            switch (sessionType) {
              case 'push':
                return ex.muscle_groups.some((m: string) => ['chest', 'shoulders', 'triceps'].includes(m));
              case 'pull':
                return ex.muscle_groups.some((m: string) => ['back', 'biceps'].includes(m));
              case 'legs':
                return ex.muscle_groups.some((m: string) => ['quads', 'hamstrings', 'glutes', 'calves'].includes(m));
              case 'upper':
                return ex.muscle_groups.some((m: string) => ['chest', 'back', 'shoulders', 'biceps', 'triceps'].includes(m));
              default:
                return true;
            }
          })
          .slice(0, randomBetween(4, 6)); // 4-6 exercises per session

        sessionExercises.forEach((exercise, exerciseIndex) => {
          const setsCount = randomBetween(3, 5);
          
          for (let setNum = 1; setNum <= setsCount; setNum++) {
            const setDate = new Date(sessionDate.getTime() + (exerciseIndex * 10 + setNum * 2) * 60 * 1000);
            
            const workoutSet: DatabaseWorkoutSet = {
              session_id: sessionId, // This will need to be updated after session insertion
              exercise_id: exercise.id,
              set_number: setNum,
              reps: generateReps(exercise.name),
              weight: generateWeight(exercise.name, finalConfig.weeksBack - week),
              rir: generateRIR(week % 8 + 1), // 8-week mesocycles
              rest_time: randomBetween(120, 240), // 2-4 minutes rest
              completed_at: setDate.toISOString(),
            };

            allSets.push(workoutSet);
          }
        });
      }
    }

    // Insert sessions first
    console.log(`📝 Inserting ${sessions.length} workout sessions...`);
    const { data: insertedSessions, error: sessionError } = await supabase
      .from('workout_sessions')
      .insert(sessions)
      .select();

    if (sessionError) throw sessionError;

    // Map session IDs and insert sets
    if (insertedSessions) {
      const sessionMap = new Map();
      insertedSessions.forEach((session, index) => {
        const originalId = `session_${Math.floor(index / finalConfig.sessionsPerWeek)}_${index % finalConfig.sessionsPerWeek}_${Date.now()}`;
        sessionMap.set(originalId, session.id);
      });

      // Update set session IDs
      const setsWithCorrectIds = allSets.map(set => ({
        ...set,
        session_id: sessionMap.get(set.session_id) || set.session_id,
      }));

      console.log(`💪 Inserting ${setsWithCorrectIds.length} workout sets...`);
      const { error: setsError } = await supabase
        .from('workout_sets')
        .insert(setsWithCorrectIds);

      if (setsError) throw setsError;
    }

    console.log(`✅ Seeded ${sessions.length} sessions and ${allSets.length} sets`);
  } catch (error) {
    console.error('❌ Failed to seed workout data:', error);
    throw error;
  }
};

/**
 * Seed body metrics over time
 */
export const seedBodyMetrics = async (userId: string, weeksBack: number = 8): Promise<void> => {
  console.log('📏 Seeding body metrics...');
  
  try {
    const metrics: DatabaseBodyMetric[] = [];
    const startWeight = 180; // Starting weight in lbs
    
    for (let week = 0; week < weeksBack; week++) {
      const date = new Date();
      date.setDate(date.getDate() - (week * 7));
      
      // Simulate gradual weight change and body fat reduction
      const weightChange = (weeksBack - week) * 0.5; // 0.5 lbs per week
      const bodyFatChange = (weeksBack - week) * 0.1; // 0.1% per week
      
      metrics.push({
        user_id: userId,
        weight: startWeight + weightChange + randomBetween(-1, 1),
        body_fat_percentage: 15 - bodyFatChange + Math.random(),
        measurements: {
          chest: 42 + Math.random(),
          waist: 32 - (bodyFatChange * 0.1),
          thigh: 24 + Math.random() * 0.5,
          arm: 16 + Math.random() * 0.3,
        },
        recorded_at: date.toISOString(),
      });
    }

    const { error } = await supabase
      .from('body_metrics')
      .insert(metrics);

    if (error) throw error;

    console.log(`✅ Seeded ${metrics.length} body metric entries`);
  } catch (error) {
    console.error('❌ Failed to seed body metrics:', error);
    throw error;
  }
};

/**
 * Seed daily activity data
 */
export const seedActivityData = async (userId: string, daysBack: number = 56): Promise<void> => {
  console.log('📱 Seeding activity data...');
  
  try {
    const activities: DatabaseActivityData[] = [];
    
    for (let day = 0; day < daysBack; day++) {
      const date = new Date();
      date.setDate(date.getDate() - day);
      
      activities.push({
        user_id: userId,
        date: date.toISOString().split('T')[0], // YYYY-MM-DD format
        steps: randomBetween(8000, 15000),
        calories_burned: randomBetween(2200, 3200),
        active_minutes: randomBetween(60, 120),
      });
    }

    const { error } = await supabase
      .from('activity_data')
      .insert(activities);

    if (error) throw error;

    console.log(`✅ Seeded ${activities.length} days of activity data`);
  } catch (error) {
    console.error('❌ Failed to seed activity data:', error);
    throw error;
  }
};

// ============================================================================
// MAIN SEEDING FUNCTIONS
// ============================================================================

/**
 * Comprehensive seed function for development
 */
export const seedDemo = async (userId?: string, config: Partial<SeedConfig> = {}): Promise<void> => {
  // Only seed in development mode
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    console.log('🌱 Starting comprehensive demo data seeding...');
  } else {
    console.warn('🚫 Seeding disabled in production');
    return;
  }
  
  try {
    // Get current user if not provided
    let targetUserId = userId;
    if (!targetUserId) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('No authenticated user found');
      }
      targetUserId = user.id;
    }

    const finalConfig: SeedConfig = { 
      ...DEFAULT_SEED_CONFIG, 
      userId: targetUserId, 
      ...config 
    } as SeedConfig;

    console.log(`👤 Seeding data for user: ${targetUserId}`);

    // Seed in sequence
    await seedExercises();
    
    if (finalConfig.generateVolumeLandmarks) {
      await seedVolumeLandmarks(targetUserId, 'intermediate');
    }
    
    await seedWorkoutData(targetUserId, finalConfig);
    
    if (finalConfig.generateBodyMetrics) {
      await seedBodyMetrics(targetUserId, finalConfig.weeksBack);
    }
    
    if (finalConfig.generateActivityData) {
      await seedActivityData(targetUserId, finalConfig.weeksBack * 7);
    }

    console.log('🎉 Demo data seeding completed successfully!');
    console.log(`📊 Generated ${finalConfig.weeksBack} weeks of realistic training data`);
    
  } catch (error) {
    console.error('❌ Failed to seed demo data:', error);
    throw error;
  }
};

/**
 * Quick seed for testing (minimal data)
 */
export const seedQuick = async (userId?: string): Promise<void> => {
  return seedDemo(userId, {
    weeksBack: 2,
    sessionsPerWeek: 3,
    setsPerSession: 15,
    generateBodyMetrics: false,
    generateActivityData: false,
  });
};

/**
 * Clear all seeded data for a user
 */
export const clearSeedData = async (userId?: string): Promise<void> => {
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    console.warn('🚫 Data clearing disabled in production');
    return;
  }

  console.log('🧹 Clearing seeded data...');
  
  try {
    let targetUserId = userId;
    if (!targetUserId) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('No authenticated user found');
      }
      targetUserId = user.id;
    }

    // Delete in reverse order of dependencies
    await supabase.from('workout_sets').delete().eq('session_id', 
      supabase.from('workout_sessions').select('id').eq('user_id', targetUserId)
    );
    
    await supabase.from('workout_sessions').delete().eq('user_id', targetUserId);
    await supabase.from('volume_landmarks').delete().eq('user_id', targetUserId);
    await supabase.from('body_metrics').delete().eq('user_id', targetUserId);
    await supabase.from('activity_data').delete().eq('user_id', targetUserId);

    console.log('✅ Cleared all seeded data');
  } catch (error) {
    console.error('❌ Failed to clear seed data:', error);
    throw error;
  }
};

// Export all seeding functions
export default {
  seedDemo,
  seedQuick,
  seedExercises,
  seedVolumeLandmarks,
  seedWorkoutData,
  seedBodyMetrics,
  seedActivityData,
  clearSeedData,
};
