// Renaissance Periodization Constants
// Shared across all Program Design components with correct database field names

// Valid goal types matching database constraint
export const GOAL_TYPES = [
  { value: 'hypertrophy', label: 'Hypertrophy' },
  { value: 'strength', label: 'Strength' },
  { value: 'powerbuilding', label: 'Powerbuilding' },
  { value: 'endurance', label: 'Endurance' }
];

// Phase focus mapping - maps phase names to valid database focus values
export const PHASE_FOCUS_MAPPING = {
  accumulation: 'accumulation',
  intensification: 'intensification', 
  realization: 'realization',
  deload: 'deload',
  maintenance: 'maintenance'
};

// Macrocycle Templates with correct database field names
export const MACROCYCLE_TEMPLATES = {
  hypertrophy_12: {
    name: '12-Week Hypertrophy Focus',
    duration_weeks: 12,
    goal_type: 'hypertrophy',
    description: 'Maximize muscle growth with progressive volume overload',
    blocks: [
      { block_type: 'accumulation', duration_weeks: 4, focus: 'accumulation' },
      { block_type: 'deload', duration_weeks: 1, focus: 'deload' },
      { block_type: 'accumulation', duration_weeks: 4, focus: 'accumulation' },
      { block_type: 'deload', duration_weeks: 1, focus: 'deload' },
      { block_type: 'maintenance', duration_weeks: 2, focus: 'maintenance' }
    ]
  },
  strength_16: {
    name: '16-Week Strength Focus',
    duration_weeks: 16,
    goal_type: 'strength',
    description: 'Build maximal strength through progressive intensity',
    blocks: [
      { block_type: 'accumulation', duration_weeks: 6, focus: 'accumulation' },
      { block_type: 'realization', duration_weeks: 4, focus: 'realization' },
      { block_type: 'intensification', duration_weeks: 2, focus: 'intensification' },
      { block_type: 'deload', duration_weeks: 1, focus: 'deload' },
      { block_type: 'maintenance', duration_weeks: 3, focus: 'maintenance' }
    ]
  },
  powerbuilding_20: {
    name: '20-Week Powerbuilding',
    duration_weeks: 20,
    goal_type: 'powerbuilding',
    description: 'Combine strength and size gains',
    blocks: [
      { block_type: 'accumulation', duration_weeks: 6, focus: 'accumulation' },
      { block_type: 'deload', duration_weeks: 1, focus: 'deload' },
      { block_type: 'intensification', duration_weeks: 5, focus: 'intensification' },
      { block_type: 'deload', duration_weeks: 1, focus: 'deload' },
      { block_type: 'realization', duration_weeks: 4, focus: 'realization' },
      { block_type: 'deload', duration_weeks: 1, focus: 'deload' },
      { block_type: 'maintenance', duration_weeks: 2, focus: 'maintenance' }
    ]
  },
  hypertrophy_8: {
    name: '8-Week Hypertrophy Block',
    duration_weeks: 8,
    goal_type: 'hypertrophy',
    description: 'Short-term muscle building focus',
    blocks: [
      { block_type: 'accumulation', duration_weeks: 3, focus: 'accumulation' },
      { block_type: 'accumulation', duration_weeks: 3, focus: 'accumulation' },
      { block_type: 'deload', duration_weeks: 1, focus: 'deload' },
      { block_type: 'maintenance', duration_weeks: 1, focus: 'maintenance' }
    ]
  },
  strength_12: {
    name: '12-Week Strength Block',
    duration_weeks: 12,
    goal_type: 'strength',
    description: 'Focused strength development cycle',
    blocks: [
      { block_type: 'accumulation', duration_weeks: 4, focus: 'accumulation' },
      { block_type: 'intensification', duration_weeks: 4, focus: 'intensification' },
      { block_type: 'realization', duration_weeks: 2, focus: 'realization' },
      { block_type: 'deload', duration_weeks: 1, focus: 'deload' },
      { block_type: 'maintenance', duration_weeks: 1, focus: 'maintenance' }
    ]
  }
};

// Base Volume Landmarks for MEV/MRV calculations
export const BASE_VOLUME_LANDMARKS = {
  chest: { mv: 4, mev: 8, mrv: 24 },
  back: { mv: 6, mev: 10, mrv: 25 },
  shoulders: { mv: 6, mev: 8, mrv: 24 },
  biceps: { mv: 4, mev: 8, mrv: 20 },
  triceps: { mv: 4, mev: 6, mrv: 18 },
  quads: { mv: 6, mev: 10, mrv: 25 },
  hamstrings: { mv: 4, mev: 8, mrv: 20 },
  glutes: { mv: 4, mev: 6, mrv: 16 },
  calves: { mv: 6, mev: 8, mrv: 20 },
  abs: { mv: 4, mev: 6, mrv: 16 }
};

// RIR (Reps in Reserve) Schemes
export const RIR_SCHEMES = {
  4: [4, 3, 2, 1],
  5: [4, 3, 2, 1, 0],
  6: [5, 4, 3, 2, 1, 0]
};

// High SFR (Stimulus-to-Fatigue Ratio) Exercises
export const HIGH_SFR_EXERCISES = {
  chest: [
    { name: 'Incline Dumbbell Press', sfr: 8.2, plane: 'sagittal', type: 'compound' },
    { name: 'Cable Flyes', sfr: 7.8, plane: 'transverse', type: 'isolation' },
    { name: 'Machine Chest Press', sfr: 7.5, plane: 'sagittal', type: 'compound' },
    { name: 'Dumbbell Flyes', sfr: 7.3, plane: 'transverse', type: 'isolation' },
    { name: 'Cable Crossovers', sfr: 7.0, plane: 'transverse', type: 'isolation' }
  ],
  back: [
    { name: 'Chest Supported Row', sfr: 8.5, plane: 'sagittal', type: 'compound' },
    { name: 'Lat Pulldown', sfr: 8.0, plane: 'sagittal', type: 'compound' },
    { name: 'Cable Row', sfr: 7.8, plane: 'sagittal', type: 'compound' },
    { name: 'T-Bar Row', sfr: 7.5, plane: 'sagittal', type: 'compound' },
    { name: 'High Cable Row', sfr: 7.2, plane: 'sagittal', type: 'compound' }
  ],
  shoulders: [
    { name: 'Lateral Raises', sfr: 8.8, plane: 'frontal', type: 'isolation' },
    { name: 'Rear Delt Flyes', sfr: 8.5, plane: 'transverse', type: 'isolation' },
    { name: 'Overhead Press', sfr: 7.8, plane: 'sagittal', type: 'compound' },
    { name: 'Cable Lateral Raises', sfr: 8.2, plane: 'frontal', type: 'isolation' },
    { name: 'Face Pulls', sfr: 7.9, plane: 'transverse', type: 'isolation' }
  ],
  biceps: [
    { name: 'Cable Curls', sfr: 8.7, plane: 'sagittal', type: 'isolation' },
    { name: 'Hammer Curls', sfr: 8.3, plane: 'sagittal', type: 'isolation' },
    { name: 'Preacher Curls', sfr: 8.1, plane: 'sagittal', type: 'isolation' },
    { name: 'Incline Dumbbell Curls', sfr: 7.9, plane: 'sagittal', type: 'isolation' }
  ],
  triceps: [
    { name: 'Cable Overhead Extension', sfr: 8.6, plane: 'sagittal', type: 'isolation' },
    { name: 'Cable Pushdowns', sfr: 8.4, plane: 'sagittal', type: 'isolation' },
    { name: 'Overhead Dumbbell Extension', sfr: 8.0, plane: 'sagittal', type: 'isolation' },
    { name: 'Close Grip Bench Press', sfr: 7.7, plane: 'sagittal', type: 'compound' }
  ],
  quads: [
    { name: 'Hack Squat', sfr: 8.8, plane: 'sagittal', type: 'compound' },
    { name: 'Leg Press', sfr: 8.5, plane: 'sagittal', type: 'compound' },
    { name: 'Smith Machine Squat', sfr: 8.0, plane: 'sagittal', type: 'compound' },
    { name: 'Bulgarian Split Squat', sfr: 7.8, plane: 'sagittal', type: 'compound' },
    { name: 'Leg Extension', sfr: 7.5, plane: 'sagittal', type: 'isolation' }
  ],
  hamstrings: [
    { name: 'Romanian Deadlift', sfr: 8.9, plane: 'sagittal', type: 'compound' },
    { name: 'Leg Curls', sfr: 8.6, plane: 'sagittal', type: 'isolation' },
    { name: 'Stiff Leg Deadlift', sfr: 8.3, plane: 'sagittal', type: 'compound' },
    { name: 'Good Mornings', sfr: 7.8, plane: 'sagittal', type: 'compound' }
  ],
  glutes: [
    { name: 'Hip Thrusts', sfr: 9.2, plane: 'sagittal', type: 'isolation' },
    { name: 'Bulgarian Split Squat', sfr: 8.5, plane: 'sagittal', type: 'compound' },
    { name: 'Romanian Deadlift', sfr: 8.3, plane: 'sagittal', type: 'compound' },
    { name: 'Cable Kickbacks', sfr: 8.0, plane: 'sagittal', type: 'isolation' }
  ],
  calves: [
    { name: 'Standing Calf Raises', sfr: 8.8, plane: 'sagittal', type: 'isolation' },
    { name: 'Seated Calf Raises', sfr: 8.5, plane: 'sagittal', type: 'isolation' },
    { name: 'Leg Press Calf Raises', sfr: 8.2, plane: 'sagittal', type: 'isolation' }
  ],
  abs: [
    { name: 'Cable Crunches', sfr: 8.7, plane: 'sagittal', type: 'isolation' },
    { name: 'Hanging Leg Raises', sfr: 8.4, plane: 'sagittal', type: 'isolation' },
    { name: 'Ab Wheel', sfr: 8.1, plane: 'sagittal', type: 'isolation' },
    { name: 'Plank Variations', sfr: 7.8, plane: 'sagittal', type: 'isolation' }
  ]
};

// Utility function for volume progression calculation
export const calculateVolumeProgression = (muscle, weeks, trainingAge = 'intermediate') => {
  const landmarks = { ...BASE_VOLUME_LANDMARKS[muscle] };
  
  // Adjust for training age
  const multipliers = {
    beginner: { mev: 0.7, mrv: 0.8 },
    intermediate: { mev: 1.0, mrv: 1.0 },
    advanced: { mev: 1.3, mrv: 1.1 }
  };
  
  const mult = multipliers[trainingAge];
  landmarks.mev = Math.round(landmarks.mev * mult.mev);
  landmarks.mrv = Math.round(landmarks.mrv * mult.mrv);
  
  // Linear progression formula
  const progression = [];
  for (let week = 1; week <= weeks; week++) {
    const sets = landmarks.mev + (landmarks.mrv - landmarks.mev) * (week - 1) / (weeks - 1);
    progression.push(Math.round(sets));
  }
  
  return { landmarks, progression };
};

// Default export for convenience
export default {
  GOAL_TYPES,
  PHASE_FOCUS_MAPPING,
  MACROCYCLE_TEMPLATES,
  BASE_VOLUME_LANDMARKS,
  RIR_SCHEMES,
  HIGH_SFR_EXERCISES,
  calculateVolumeProgression
};