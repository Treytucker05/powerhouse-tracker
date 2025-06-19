/**
 * Workout Management Algorithms
 * Handles live session tracking, set logging, and workout state management
 */

import trainingState from "../core/trainingState.js";

/**
 * Start a new workout session
 * @param {Date|string} now - Current timestamp (optional, defaults to now)
 * @returns {Object} - Workout session data
 */
export function startWorkout(now = new Date()) {
  const timestamp = now instanceof Date ? now.toISOString() : now;
  
  // Initialize workout session
  const workoutSession = {
    id: generateWorkoutId(),
    startTime: timestamp,
    status: 'active',
    exercises: [],
    totalSets: 0,
    totalVolume: 0,
    sessionType: 'standard',
    muscleGroups: [],
    notes: '',
    metadata: {
      week: trainingState.currentWeek || 1,
      mesocycle: trainingState.currentMesocycle || 1,
      programVersion: trainingState.programVersion || '1.0'
    }
  };
  
  // Update training state
  trainingState.currentWorkout = workoutSession;
  trainingState.workoutHistory = trainingState.workoutHistory || [];
  
  // Log session start
  console.log('Workout session started:', {
    id: workoutSession.id,
    startTime: workoutSession.startTime,
    week: workoutSession.metadata.week
  });
  
  return workoutSession;
}

/**
 * Generate unique workout ID
 * @returns {string} - Unique workout identifier
 */
function generateWorkoutId() {
  const date = new Date();
  const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
  const timeStr = date.toTimeString().split(' ')[0].replace(/:/g, ''); // HHMMSS
  const random = Math.random().toString(36).substr(2, 4); // 4 random chars
  
  return `workout_${dateStr}_${timeStr}_${random}`;
}

/**
 * Get current workout session
 * @returns {Object|null} - Current active workout or null
 */
export function getCurrentWorkout() {
  return trainingState.currentWorkout || null;
}

/**
 * Validate workout can be started
 * @returns {Object} - Validation result with isValid and reason
 */
export function validateWorkoutStart() {
  // Check if there's already an active workout
  if (trainingState.currentWorkout && trainingState.currentWorkout.status === 'active') {
    return {
      isValid: false,
      reason: 'Another workout session is already active. Please end the current session first.'
    };
  }
  
  // Check if program is properly configured
  if (!trainingState.volumeLandmarks || Object.keys(trainingState.volumeLandmarks).length === 0) {
    return {
      isValid: false,
      reason: 'Volume landmarks not configured. Please complete Phase 1 setup first.'
    };
  }
  
  return {
    isValid: true,
    reason: 'Ready to start workout'
  };
}

/**
 * Get workout session statistics
 * @param {Object} workout - Workout session object
 * @returns {Object} - Session statistics
 */
export function getWorkoutStats(workout = null) {
  const session = workout || trainingState.currentWorkout;
  
  if (!session) {
    return {
      duration: 0,
      setsCompleted: 0,
      totalVolume: 0,
      averageRIR: 0,
      musclesWorked: []
    };
  }
  
  const now = new Date();
  const startTime = new Date(session.startTime);
  const duration = Math.floor((now - startTime) / 1000 / 60); // minutes
  
  return {
    duration,
    setsCompleted: session.totalSets || 0,
    totalVolume: session.totalVolume || 0,
    averageRIR: calculateAverageRIR(session.exercises),
    musclesWorked: session.muscleGroups || []
  };
}

/**
 * Calculate average RIR across all sets in workout
 * @param {Array} exercises - Array of exercises with sets
 * @returns {number} - Average RIR
 */
function calculateAverageRIR(exercises = []) {
  let totalRIR = 0;
  let totalSets = 0;
  
  exercises.forEach(exercise => {
    if (exercise.sets) {
      exercise.sets.forEach(set => {
        if (set.rir !== undefined) {
          totalRIR += set.rir;
          totalSets++;
        }
      });
    }
  });
  
  return totalSets > 0 ? Math.round((totalRIR / totalSets) * 10) / 10 : 0;
}

/**
 * Log a set for the current workout session
 * @param {Object} session - Workout session object
 * @param {Object} setData - Set data to log
 * @returns {Object} - Updated session with logged set
 */
export function logSet(session, setData) {
  if (!session) {
    throw new Error('No active workout session provided');
  }
  
  if (session.status !== 'active') {
    throw new Error('Cannot log set - workout session is not active');
  }
  
  // Validate required set data
  if (!setData || typeof setData !== 'object') {
    throw new Error('Invalid set data provided');
  }
  
  const { exercise, weight, reps, rir, notes = '' } = setData;
  
  if (!exercise || typeof exercise !== 'string') {
    throw new Error('Exercise name is required');
  }
  
  if (weight === undefined || weight === null || weight < 0) {
    throw new Error('Valid weight is required');
  }
  
  if (reps === undefined || reps === null || reps < 0) {
    throw new Error('Valid reps count is required');
  }
  
  if (rir !== undefined && rir !== null && (rir < 0 || rir > 10)) {
    throw new Error('RIR must be between 0 and 10');
  }
    // Create set record
  const setRecord = {
    id: generateSetId(),
    timestamp: new Date().toISOString(),
    exercise,
    weight: Number(weight),
    reps: Number(reps),
    rir: rir !== undefined && rir !== null ? Number(rir) : null,
    notes: notes.toString(),
    setNumber: 1 // Will be updated below
  };
  
  // Find or create exercise in session
  let exerciseRecord = session.exercises.find(ex => ex.name === exercise);
  
  if (!exerciseRecord) {
    exerciseRecord = {
      name: exercise,
      sets: [],
      totalSets: 0,
      totalVolume: 0,
      muscleGroups: getMuscleGroupsForExercise(exercise)
    };
    session.exercises.push(exerciseRecord);
  }
  
  // Set the set number
  setRecord.setNumber = exerciseRecord.sets.length + 1;
  
  // Add set to exercise
  exerciseRecord.sets.push(setRecord);
  exerciseRecord.totalSets = exerciseRecord.sets.length;
  exerciseRecord.totalVolume = exerciseRecord.sets.reduce((total, set) => total + (set.weight * set.reps), 0);
  
  // Update session totals
  session.totalSets = session.exercises.reduce((total, ex) => total + ex.totalSets, 0);
  session.totalVolume = session.exercises.reduce((total, ex) => total + ex.totalVolume, 0);
  
  // Update muscle groups worked
  const allMuscleGroups = session.exercises.flatMap(ex => ex.muscleGroups || []);
  session.muscleGroups = [...new Set(allMuscleGroups)]; // Remove duplicates
  
  // Update training state
  trainingState.currentWorkout = session;
  
  console.log('Set logged:', {
    exercise: setRecord.exercise,
    setNumber: setRecord.setNumber,
    weight: setRecord.weight,
    reps: setRecord.reps,
    rir: setRecord.rir,
    volume: setRecord.weight * setRecord.reps
  });
  
  return session;
}

/**
 * Generate unique set ID
 * @returns {string} - Unique set identifier
 */
function generateSetId() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 4);
  return `set_${timestamp}_${random}`;
}

/**
 * Get muscle groups for a given exercise (simplified mapping)
 * @param {string} exercise - Exercise name
 * @returns {Array} - Array of muscle groups
 */
function getMuscleGroupsForExercise(exercise) {
  const exerciseName = exercise.toLowerCase();
  
  // Simple exercise to muscle group mapping
  const muscleMap = {
    // Chest
    'bench press': ['chest', 'triceps'],
    'incline bench': ['chest', 'triceps'],
    'dumbbell press': ['chest', 'triceps'],
    'chest fly': ['chest'],
    'dips': ['chest', 'triceps'],
    
    // Back
    'deadlift': ['back', 'glutes', 'hamstrings'],
    'pull-up': ['back', 'biceps'],
    'pulldown': ['back', 'biceps'],
    'row': ['back', 'biceps'],
    'barbell row': ['back', 'biceps'],
    
    // Legs
    'squat': ['quadriceps', 'glutes'],
    'leg press': ['quadriceps', 'glutes'],
    'leg curl': ['hamstrings'],
    'leg extension': ['quadriceps'],
    'calf raise': ['calves'],
    
    // Shoulders
    'shoulder press': ['shoulders', 'triceps'],
    'lateral raise': ['shoulders'],
    'rear delt fly': ['shoulders'],
    
    // Arms
    'bicep curl': ['biceps'],
    'tricep extension': ['triceps'],
    'hammer curl': ['biceps']
  };
  
  // Find matching exercise pattern
  for (const [pattern, muscles] of Object.entries(muscleMap)) {
    if (exerciseName.includes(pattern)) {
      return muscles;
    }
  }
  
  // Default to generic categorization
  if (exerciseName.includes('press') || exerciseName.includes('bench')) {
    return ['chest', 'triceps'];
  } else if (exerciseName.includes('pull') || exerciseName.includes('row')) {
    return ['back', 'biceps'];
  } else if (exerciseName.includes('squat') || exerciseName.includes('leg')) {
    return ['legs'];
  } else if (exerciseName.includes('curl')) {
    return ['biceps'];
  } else {
    return ['other'];
  }
}

/**
 * Undo the last set logged in the current workout session
 * @param {Object} session - Workout session object
 * @returns {Object} - Updated session with last set removed
 */
export function undoLastSet(session) {
  if (!session) {
    throw new Error('No workout session provided');
  }
  
  if (session.status !== 'active') {
    throw new Error('Cannot undo set - workout session is not active');
  }
  
  if (!session.exercises || session.exercises.length === 0) {
    throw new Error('No exercises found in current session');
  }
  
  // Find the exercise with the most recent set (highest timestamp)
  let latestExercise = null;
  let latestSetIndex = -1;
  let latestTimestamp = null;
  
  session.exercises.forEach((exercise, exerciseIndex) => {
    if (exercise.sets && exercise.sets.length > 0) {
      exercise.sets.forEach((set, setIndex) => {
        const setTimestamp = new Date(set.timestamp);
        if (!latestTimestamp || setTimestamp > latestTimestamp) {
          latestTimestamp = setTimestamp;
          latestExercise = exerciseIndex;
          latestSetIndex = setIndex;
        }
      });
    }
  });
  
  if (latestExercise === null || latestSetIndex === -1) {
    throw new Error('No sets found to undo');
  }
  
  // Get reference to the exercise and the set to be removed
  const exercise = session.exercises[latestExercise];
  const removedSet = exercise.sets[latestSetIndex];
  
  // Remove the set
  exercise.sets.splice(latestSetIndex, 1);
  
  // Update set numbers for remaining sets in this exercise
  exercise.sets.forEach((set, index) => {
    set.setNumber = index + 1;
  });
  
  // Recalculate exercise totals
  exercise.totalSets = exercise.sets.length;
  exercise.totalVolume = exercise.sets.reduce((total, set) => total + (set.weight * set.reps), 0);
  
  // If no sets remain in this exercise, remove the exercise entirely
  if (exercise.sets.length === 0) {
    session.exercises.splice(latestExercise, 1);
  }
  
  // Recalculate session totals
  session.totalSets = session.exercises.reduce((total, ex) => total + ex.totalSets, 0);
  session.totalVolume = session.exercises.reduce((total, ex) => total + ex.totalVolume, 0);
  
  // Update muscle groups worked
  const allMuscleGroups = session.exercises.flatMap(ex => ex.muscleGroups || []);
  session.muscleGroups = [...new Set(allMuscleGroups)]; // Remove duplicates
  
  // Update training state
  trainingState.currentWorkout = session;
  
  console.log('Set undone:', {
    exercise: removedSet.exercise,
    setNumber: removedSet.setNumber,
    weight: removedSet.weight,
    reps: removedSet.reps,
    rir: removedSet.rir,
    volume: removedSet.weight * removedSet.reps
  });
  
  return {
    session,
    removedSet
  };
}

/**
 * Finish the current workout session
 * @param {Object|null} session - Workout session to finish (default trainingState.currentWorkout)
 * @param {Object} state - Training state object (default trainingState)
 * @returns {Object} - Finished workout session
 */
export function finishWorkout(session = null, state = trainingState) {
  const workout = session || state.currentWorkout;
  if (!workout) {
    throw new Error('No active workout session');
  }
  if (workout.status !== 'active') {
    throw new Error('Workout session is not active');
  }

  workout.status = 'completed';
  workout.endTime = new Date().toISOString();

  state.workoutHistory = state.workoutHistory || [];
  state.workoutHistory.push(workout);
  state.currentWorkout = null;

  console.log('Workout session finished:', workout.id);

  return workout;
}
