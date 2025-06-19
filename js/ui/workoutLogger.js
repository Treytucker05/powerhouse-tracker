/**
 * Workout Logger with RIR Tracking
 * Handles set logging, RIR tracking, and workout session management
 */

import trainingState from "../core/trainingState.js";
import { debugLog } from "../utils/debug.js";

/**
 * Initialize workout logger UI and event handlers
 */
export function initWorkoutLogger() {
  setupRIRInputs();
  setupSetLoggingHandlers();
  loadCurrentWorkout();
}

/**
 * Setup RIR input fields for each exercise
 */
function setupRIRInputs() {
  // Add RIR inputs to existing exercise forms
  const exerciseForms = document.querySelectorAll('.exercise-form, .set-logger');
  
  exerciseForms.forEach(form => {
    addRIRInputToForm(form);
  });
}

/**
 * Add RIR input field to an exercise form
 * @param {HTMLElement} form - Exercise form element
 */
function addRIRInputToForm(form) {
  // Check if RIR input already exists
  if (form.querySelector('.rir-input')) return;
  
  const rirContainer = document.createElement('div');
  rirContainer.className = 'rir-input-container';
  rirContainer.innerHTML = `
    <label for="rir-input" class="rir-label">
      RIR (Reps in Reserve): 
      <span class="rir-help" title="How many more reps could you have done?">?</span>
    </label>
    <div class="rir-input-group">
      <input type="number" 
             class="rir-input" 
             min="0" 
             max="5" 
             step="0.5" 
             placeholder="0-5"
             title="Rate your effort: 0 = failure, 1 = 1 rep left, etc.">
      <div class="rir-scale">
        <span>0=Failure</span>
        <span>1-2=Very Hard</span>
        <span>3-4=Moderate</span>
        <span>5=Easy</span>
      </div>
    </div>
  `;
  
  // Insert before submit button or at end of form
  const submitButton = form.querySelector('button[type="submit"], .submit-btn');
  if (submitButton) {
    form.insertBefore(rirContainer, submitButton);
  } else {
    form.appendChild(rirContainer);
  }
  
  // Add real-time validation
  const rirInput = rirContainer.querySelector('.rir-input');
  rirInput.addEventListener('input', validateRIRInput);
  rirInput.addEventListener('change', handleRIRChange);
}

/**
 * Validate RIR input values
 * @param {Event} event - Input event
 */
function validateRIRInput(event) {
  const input = event.target;
  const value = parseFloat(input.value);
  
  // Remove existing validation classes
  input.classList.remove('valid', 'warning', 'invalid');
  
  if (isNaN(value)) return;
  
  // Validate range
  if (value < 0 || value > 5) {
    input.classList.add('invalid');
    showRIRFeedback(input, 'RIR must be between 0-5', 'error');
    return;
  }
  
  // Check against target RIR for current week
  const targetRIR = trainingState.getTargetRIR();
  const difference = Math.abs(value - targetRIR);
  
  if (difference <= 0.5) {
    input.classList.add('valid');
    showRIRFeedback(input, `Perfect! Target RIR: ${targetRIR}`, 'success');
  } else if (difference <= 1) {
    input.classList.add('warning');
    showRIRFeedback(input, `Close to target (${targetRIR})`, 'warning');
  } else {
    input.classList.add('warning');
    showRIRFeedback(input, `Target RIR: ${targetRIR}, adjust effort next set`, 'info');
  }
}

/**
 * Handle RIR input changes
 * @param {Event} event - Change event
 */
function handleRIRChange(event) {
  const input = event.target;
  const value = parseFloat(input.value);
  const exercise = getExerciseFromForm(input.closest('form, .exercise-container'));
  
  if (!isNaN(value) && exercise) {
    updateExerciseRIR(exercise, value);
  }
}

/**
 * Show RIR feedback to user
 * @param {HTMLElement} input - RIR input element
 * @param {string} message - Feedback message
 * @param {string} type - Feedback type (success, warning, error, info)
 */
function showRIRFeedback(input, message, type) {
  // Remove existing feedback
  const existingFeedback = input.parentNode.querySelector('.rir-feedback');
  if (existingFeedback) {
    existingFeedback.remove();
  }
  
  // Create new feedback element
  const feedback = document.createElement('div');
  feedback.className = `rir-feedback rir-feedback-${type}`;
  feedback.textContent = message;
  
  // Insert after input
  input.parentNode.insertBefore(feedback, input.nextSibling);
  
  // Auto-remove after 3 seconds for non-error messages
  if (type !== 'error') {
    setTimeout(() => {
      if (feedback.parentNode) {
        feedback.remove();
      }
    }, 3000);
  }
}

/**
 * Get exercise name from form element
 * @param {HTMLElement} form - Form or container element
 * @returns {string} - Exercise name
 */
function getExerciseFromForm(form) {
  // Try multiple ways to get exercise name
  const exerciseSelect = form.querySelector('select[name="muscle"], #muscleSelect');
  const exerciseInput = form.querySelector('input[name="exercise"]');
  const exerciseLabel = form.querySelector('.exercise-label, .muscle-label');
  
  if (exerciseSelect && exerciseSelect.value) {
    return exerciseSelect.value;
  } else if (exerciseInput && exerciseInput.value) {
    return exerciseInput.value;
  } else if (exerciseLabel) {
    return exerciseLabel.textContent.trim();
  }
  
  return 'Unknown Exercise';
}

/**
 * Update exercise RIR in current workout session
 * @param {string} exercise - Exercise/muscle name
 * @param {number} rir - RIR value
 */
function updateExerciseRIR(exercise, rir) {
  const currentWorkout = getCurrentWorkout();
  
  if (!currentWorkout.exercises[exercise]) {
    currentWorkout.exercises[exercise] = {
      sets: [],
      averageRIR: 0,
      targetRIR: trainingState.getTargetRIR()
    };
  }
  
  // Add RIR to current set (assume latest set)
  const exerciseData = currentWorkout.exercises[exercise];
  if (exerciseData.sets.length > 0) {
    exerciseData.sets[exerciseData.sets.length - 1].rir = rir;
  } else {
    // Create a new set with just RIR data
    exerciseData.sets.push({
      setNumber: 1,
      rir: rir,
      timestamp: new Date().toISOString()
    });
  }
  
  // Calculate average RIR for exercise
  const rirValues = exerciseData.sets
    .filter(set => set.rir !== undefined)
    .map(set => set.rir);
  
  if (rirValues.length > 0) {
    exerciseData.averageRIR = rirValues.reduce((sum, rir) => sum + rir, 0) / rirValues.length;
  }
  
  // Save workout data
  saveCurrentWorkout(currentWorkout);
  
  debugLog(`Updated RIR for ${exercise}: ${rir} (avg: ${exerciseData.averageRIR.toFixed(1)})`);
}

/**
 * Log a complete set with all data
 * @param {Object} setData - Complete set data
 */
export function logSet(setData) {
  const {
    exercise,
    muscle,
    weight,
    reps,
    rir,
    notes = '',
    rpe = null
  } = setData;
  
  const currentWorkout = getCurrentWorkout();
  const exerciseKey = muscle || exercise;
  
  if (!currentWorkout.exercises[exerciseKey]) {
    currentWorkout.exercises[exerciseKey] = {
      sets: [],
      averageRIR: 0,
      targetRIR: trainingState.getTargetRIR(),
      volume: 0
    };
  }
  
  const exerciseData = currentWorkout.exercises[exerciseKey];
  const setNumber = exerciseData.sets.length + 1;
  
  // Create set record
  const setRecord = {
    setNumber,
    weight: weight || 0,
    reps: reps || 0,
    rir: rir || null,
    rpe: rpe || (rir !== null ? Math.max(1, 10 - rir) : null),
    notes,
    timestamp: new Date().toISOString(),
    week: trainingState.weekNo,
    block: trainingState.blockNo
  };
  
  exerciseData.sets.push(setRecord);
  
  // Update volume tracking
  exerciseData.volume = exerciseData.sets.length;
  
  // Update average RIR
  const rirValues = exerciseData.sets
    .filter(set => set.rir !== null && set.rir !== undefined)
    .map(set => set.rir);
  
  if (rirValues.length > 0) {
    exerciseData.averageRIR = rirValues.reduce((sum, rir) => sum + rir, 0) / rirValues.length;
  }
  
  // Save workout
  saveCurrentWorkout(currentWorkout);
  
  // Update training state if muscle group specified
  if (muscle) {
    trainingState.addSets(muscle, 1);
  }
  
  debugLog(`Logged set for ${exerciseKey}: ${weight}kg x ${reps} @ RIR ${rir}`);
  
  return setRecord;
}

/**
 * Get current workout session
 * @returns {Object} - Current workout data
 */
function getCurrentWorkout() {
  const workoutKey = `workout-${trainingState.blockNo}-${trainingState.weekNo}`;
  const stored = localStorage.getItem(workoutKey);
  
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.warn('Error parsing stored workout:', error);
    }
  }
  
  // Create new workout session
  return {
    date: new Date().toISOString().split('T')[0],
    week: trainingState.weekNo,
    block: trainingState.blockNo,
    exercises: {},
    startTime: new Date().toISOString(),
    endTime: null
  };
}

/**
 * Save current workout session
 * @param {Object} workout - Workout data to save
 */
function saveCurrentWorkout(workout) {
  const workoutKey = `workout-${workout.block}-${workout.week}`;
  localStorage.setItem(workoutKey, JSON.stringify(workout));
  
  // Also save to recent workouts list
  updateRecentWorkouts(workout);
}

/**
 * Update recent workouts list
 * @param {Object} workout - Workout to add to recent list
 */
function updateRecentWorkouts(workout) {
  const recentKey = 'recent-workouts';
  let recent = [];
  
  try {
    const stored = localStorage.getItem(recentKey);
    if (stored) {
      recent = JSON.parse(stored);
    }
  } catch (error) {
    console.warn('Error parsing recent workouts:', error);
  }
  
  // Add/update current workout
  const workoutId = `${workout.block}-${workout.week}`;
  const existingIndex = recent.findIndex(w => `${w.block}-${w.week}` === workoutId);
  
  const workoutSummary = {
    id: workoutId,
    date: workout.date,
    week: workout.week,
    block: workout.block,
    exerciseCount: Object.keys(workout.exercises).length,
    totalSets: Object.values(workout.exercises).reduce((total, ex) => total + ex.sets.length, 0),
    averageRIR: calculateWorkoutAverageRIR(workout),
    lastModified: new Date().toISOString()
  };
  
  if (existingIndex >= 0) {
    recent[existingIndex] = workoutSummary;
  } else {
    recent.unshift(workoutSummary);
  }
  
  // Keep only last 20 workouts
  recent = recent.slice(0, 20);
  
  localStorage.setItem(recentKey, JSON.stringify(recent));
}

/**
 * Calculate average RIR for entire workout
 * @param {Object} workout - Workout data
 * @returns {number} - Average RIR across all exercises
 */
function calculateWorkoutAverageRIR(workout) {
  const allRIRValues = [];
  
  Object.values(workout.exercises).forEach(exercise => {
    exercise.sets.forEach(set => {
      if (set.rir !== null && set.rir !== undefined) {
        allRIRValues.push(set.rir);
      }
    });
  });
  
  if (allRIRValues.length === 0) return null;
  
  return allRIRValues.reduce((sum, rir) => sum + rir, 0) / allRIRValues.length;
}

/**
 * Load current workout data on page load
 */
function loadCurrentWorkout() {
  const currentWorkout = getCurrentWorkout();
  
  // Pre-fill any existing exercise data
  Object.keys(currentWorkout.exercises).forEach(exercise => {
    const exerciseData = currentWorkout.exercises[exercise];
    displayExerciseProgress(exercise, exerciseData);
  });
}

/**
 * Display exercise progress in UI
 * @param {string} exercise - Exercise name
 * @param {Object} exerciseData - Exercise data
 */
function displayExerciseProgress(exercise, exerciseData) {
  // Find relevant UI elements and update them
  const exerciseElements = document.querySelectorAll(`[data-exercise="${exercise}"], [data-muscle="${exercise}"]`);
  
  exerciseElements.forEach(element => {
    const progressInfo = element.querySelector('.exercise-progress, .set-progress');
    if (progressInfo) {
      progressInfo.innerHTML = `
        <div class="sets-completed">${exerciseData.sets.length} sets logged</div>
        <div class="average-rir">Avg RIR: ${exerciseData.averageRIR.toFixed(1)}</div>
        <div class="target-rir">Target: ${exerciseData.targetRIR}</div>
      `;
    }
  });
}

/**
 * Setup set logging event handlers
 */
function setupSetLoggingHandlers() {
  // Handle set logging forms
  document.addEventListener('submit', (event) => {
    if (event.target.classList.contains('set-form') || 
        event.target.querySelector('.rir-input')) {
      event.preventDefault();
      handleSetFormSubmission(event.target);
    }
  });
}

/**
 * Handle set form submission
 * @param {HTMLFormElement} form - Set logging form
 */
function handleSetFormSubmission(form) {
  const formData = new FormData(form);
  const rirInput = form.querySelector('.rir-input');
  
  const setData = {
    exercise: getExerciseFromForm(form),
    muscle: formData.get('muscle') || getExerciseFromForm(form),
    weight: parseFloat(formData.get('weight')) || 0,
    reps: parseInt(formData.get('reps')) || 0,
    rir: rirInput ? parseFloat(rirInput.value) : null,
    notes: formData.get('notes') || ''
  };
  
  // Validate required fields
  if (!setData.muscle) {
    alert('Please select a muscle group');
    return;
  }
  
  // Log the set
  const setRecord = logSet(setData);
  
  // Show success feedback
  showSetLoggedFeedback(form, setRecord);
  
  // Clear form (except muscle selection)
  form.querySelectorAll('input[type="number"], input[type="text"], textarea').forEach(input => {
    if (!input.name || input.name !== 'muscle') {
      input.value = '';
    }
  });
}

/**
 * Show feedback when set is logged
 * @param {HTMLFormElement} form - Form element
 * @param {Object} setRecord - Logged set data
 */
function showSetLoggedFeedback(form, setRecord) {
  const feedback = document.createElement('div');
  feedback.className = 'set-logged-feedback success';
  feedback.innerHTML = `
    ✅ Set ${setRecord.setNumber} logged: ${setRecord.weight}kg × ${setRecord.reps}
    ${setRecord.rir !== null ? ` @ RIR ${setRecord.rir}` : ''}
  `;
  
  form.appendChild(feedback);
  
  setTimeout(() => {
    feedback.remove();
  }, 3000);
}

// Initialize on DOM ready
if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initWorkoutLogger);
  } else {
    initWorkoutLogger();
  }
}
