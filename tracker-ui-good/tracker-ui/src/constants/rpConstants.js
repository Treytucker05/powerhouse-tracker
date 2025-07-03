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
  },
  endurance_16: {
    name: '16-Week Endurance Base',
    duration_weeks: 16,
    goal_type: 'endurance',
    description: 'Build aerobic base and muscular endurance',
    blocks: [
      { block_type: 'accumulation', duration_weeks: 6, focus: 'accumulation' },
      { block_type: 'deload', duration_weeks: 1, focus: 'deload' },
      { block_type: 'accumulation', duration_weeks: 6, focus: 'accumulation' },
      { block_type: 'deload', duration_weeks: 1, focus: 'deload' },
      { block_type: 'maintenance', duration_weeks: 2, focus: 'maintenance' }
    ]
  },
  powerbuilding_12: {
    name: '12-Week Powerbuilding',
    duration_weeks: 12,
    goal_type: 'powerbuilding',
    description: 'Balanced strength and hypertrophy development',
    blocks: [
      { block_type: 'accumulation', duration_weeks: 4, focus: 'accumulation' },
      { block_type: 'deload', duration_weeks: 1, focus: 'deload' },
      { block_type: 'intensification', duration_weeks: 3, focus: 'intensification' },
      { block_type: 'realization', duration_weeks: 2, focus: 'realization' },
      { block_type: 'deload', duration_weeks: 1, focus: 'deload' },
      { block_type: 'maintenance', duration_weeks: 1, focus: 'maintenance' }
    ]
  },
  strength_8: {
    name: '8-Week Strength Peak',
    duration_weeks: 8,
    goal_type: 'strength',
    description: 'Short peaking cycle for competition',
    blocks: [
      { block_type: 'accumulation', duration_weeks: 3, focus: 'accumulation' },
      { block_type: 'intensification', duration_weeks: 3, focus: 'intensification' },
      { block_type: 'realization', duration_weeks: 1, focus: 'realization' },
      { block_type: 'deload', duration_weeks: 1, focus: 'deload' }
    ]
  }
};

// Base Volume Landmarks for MEV/MRV calculations (Updated 2024-25 Research)
export const BASE_VOLUME_LANDMARKS = {
  chest: { mv: 4, mev: 6, mrv: 24, mav: 16 },
  back: { mv: 8, mev: 10, mrv: 25, mav: 18 },
  shoulders: { mv: 2, mev: 8, mrv: 24, mav: 16 },
  biceps: { mv: 4, mev: 8, mrv: 20, mav: 14 },
  triceps: { mv: 4, mev: 6, mrv: 18, mav: 12 },
  quads: { mv: 6, mev: 8, mrv: 20, mav: 18 },
  hamstrings: { mv: 4, mev: 8, mrv: 20, mav: 14 },
  glutes: { mv: 4, mev: 6, mrv: 16, mav: 12 },
  calves: { mv: 6, mev: 8, mrv: 20, mav: 14 },
  abs: { mv: 4, mev: 6, mrv: 16, mav: 12 }
};

// RIR (Reps in Reserve) Schemes (Updated 2024-25 Research - Start at 4 RIR)
export const RIR_SCHEMES = {
  4: [4, 3, 2, 1],
  5: [4, 3, 2, 1, 0],
  6: [4, 3, 2, 1, 0, 0]
};

// Phase Duration Base Values (Research-Based Algorithm)
export const PHASE_DURATION_BASE = {
  foundation: { min: 3, max: 6, base: 4 },
  hypertrophy: { min: 4, max: 8, base: 6 },
  strength: { min: 4, max: 6, base: 5 },
  peak: { min: 1, max: 3, base: 2 }
};

// Training Age and Goal Modifiers for Phase Duration
export const PHASE_DURATION_MODIFIERS = {
  trainingAge: {
    beginner: 1.2,    // Longer phases for adaptation
    intermediate: 1.0, // Base duration
    advanced: 0.8     // Shorter phases due to faster adaptation
  },
  goal: {
    hypertrophy: 1.1,   // Slightly longer for volume accumulation
    strength: 1.0,      // Base duration
    powerbuilding: 0.9, // Slightly shorter for variety
    endurance: 1.2      // Longer for aerobic adaptations
  },
  recoveryScore: {
    poor: 0.8,      // Shorter phases if recovery is compromised
    average: 1.0,   // Base duration
    good: 1.1,      // Can handle longer phases
    excellent: 1.2  // Extended phases for advanced athletes
  }
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

// Calculate Phase Duration Algorithm (2024-25 Research)
export const calculatePhaseDuration = (phase, trainingAge = 'intermediate', goal = 'hypertrophy', recoveryScore = 'average') => {
  const baseConfig = PHASE_DURATION_BASE[phase];
  if (!baseConfig) return 4; // Default fallback

  const trainingMod = PHASE_DURATION_MODIFIERS.trainingAge[trainingAge] || 1.0;
  const goalMod = PHASE_DURATION_MODIFIERS.goal[goal] || 1.0;
  const recoveryMod = PHASE_DURATION_MODIFIERS.recoveryScore[recoveryScore] || 1.0;

  const calculatedDuration = Math.round(baseConfig.base * trainingMod * goalMod * recoveryMod);

  // Ensure within min/max bounds
  return Math.max(baseConfig.min, Math.min(baseConfig.max, calculatedDuration));
};

// Updated RIR Progression with Compound/Isolation Modifiers (2024-25 Research)
export const calculateRIRProgression = (weeks, exerciseType = 'compound') => {
  const scheme = RIR_SCHEMES[Math.min(weeks, 6)] || RIR_SCHEMES[4];

  // Compound exercises get +0.5 RIR modifier for safety
  const compoundModifier = exerciseType === 'compound' ? 0.5 : 0;

  return scheme.map((rir, index) => ({
    week: index + 1,
    targetRIR: rir + compoundModifier,
    baseRIR: rir,
    exerciseType,
    intensity: calculateIntensityFromRIR(rir + compoundModifier)
  }));
};

// Calculate training intensity from RIR (research-based formula)
export const calculateIntensityFromRIR = (rir) => {
  // Research-based RIR to %1RM conversion
  const rirToIntensity = {
    0: '95-100%',
    0.5: '92-97%',
    1: '87-92%',
    1.5: '85-90%',
    2: '80-85%',
    2.5: '77-82%',
    3: '75-80%',
    3.5: '72-77%',
    4: '70-75%',
    4.5: '67-72%',
    5: '65-70%'
  };

  return rirToIntensity[rir] || '70-75%';
};

// Deload Trigger Logic (2024-25 Research)
export const shouldDeload = (metrics) => {
  const {
    currentVolume = 0,
    mrvThreshold = 0,
    fatigueScore = 0,
    performanceDrop = 0,
    weeksSinceDeload = 0,
    sleepQuality = 5,
    motivationLevel = 5,
    jointPain = 0
  } = metrics;

  let deloadTriggers = [];
  let urgencyScore = 0;

  // 1. Volume-based triggers
  if (currentVolume >= mrvThreshold * 0.95) {
    deloadTriggers.push('Approaching MRV threshold');
    urgencyScore += 3;
  }

  if (currentVolume >= mrvThreshold) {
    deloadTriggers.push('MRV breached');
    urgencyScore += 5;
  }

  // 2. Fatigue-based triggers (1-10 scale)
  if (fatigueScore >= 8) {
    deloadTriggers.push('High fatigue score');
    urgencyScore += 4;
  }

  // 3. Performance-based triggers (% drop from baseline)
  if (performanceDrop >= 10) {
    deloadTriggers.push('Significant performance drop (≥10%)');
    urgencyScore += 4;
  }

  if (performanceDrop >= 15) {
    deloadTriggers.push('Major performance decline (≥15%)');
    urgencyScore += 6;
  }

  // 4. Time-based triggers
  if (weeksSinceDeload >= 6) {
    deloadTriggers.push('Extended training period (≥6 weeks)');
    urgencyScore += 2;
  }

  if (weeksSinceDeload >= 8) {
    deloadTriggers.push('Overdue deload (≥8 weeks)');
    urgencyScore += 4;
  }

  // 5. Recovery quality indicators
  if (sleepQuality <= 3) {
    deloadTriggers.push('Poor sleep quality');
    urgencyScore += 2;
  }

  if (motivationLevel <= 3) {
    deloadTriggers.push('Low training motivation');
    urgencyScore += 2;
  }

  if (jointPain >= 7) {
    deloadTriggers.push('High joint pain/discomfort');
    urgencyScore += 3;
  }

  // Determine deload recommendation
  const shouldDeloadNow = urgencyScore >= 5;
  const shouldConsiderDeload = urgencyScore >= 3;

  return {
    shouldDeload: shouldDeloadNow,
    shouldConsider: shouldConsiderDeload,
    urgencyScore,
    triggers: deloadTriggers,
    recommendation: urgencyScore >= 8 ? 'URGENT' :
      urgencyScore >= 5 ? 'RECOMMENDED' :
        urgencyScore >= 3 ? 'CONSIDER' : 'NOT_NEEDED'
  };
};

// Default export for convenience
export default {
  GOAL_TYPES,
  PHASE_FOCUS_MAPPING,
  MACROCYCLE_TEMPLATES,
  BASE_VOLUME_LANDMARKS,
  RIR_SCHEMES,
  PHASE_DURATION_BASE,
  PHASE_DURATION_MODIFIERS,
  HIGH_SFR_EXERCISES,
  calculateVolumeProgression,
  calculatePhaseDuration,
  calculateRIRProgression,
  calculateIntensityFromRIR,
  shouldDeload
};