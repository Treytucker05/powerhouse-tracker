/**
 * Feedback Form UI Handler
 * Manages set feedback submission and RP algorithm integration
 */

import trainingState from '../core/trainingState.js';
import { updateChart } from './chartManager.js';
import { scoreStimulus, setProgressionAlgorithm, getVolumeProgression } from '../algorithms/volume.js';
import { validateEffortLevel, getAutoregulationAdvice } from '../algorithms/effort.js';

/**
 * Initialize feedback form interactions
 */
export function initFeedbackForm() {
  const submitButton = document.getElementById('submitFeedbackBtn') || 
                      document.querySelector('#mevCard button');
  
  if (submitButton) {
    submitButton.addEventListener('click', handleFeedbackSubmission);
  }

  // Real-time RIR validation
  const rirInputs = document.querySelectorAll('input[name="actualRIR"]');
  rirInputs.forEach(input => {
    input.addEventListener('input', validateRIRInput);
  });

  // Auto-populate current sets
  const muscleSelect = document.getElementById('muscleSelect');
  if (muscleSelect) {
    muscleSelect.addEventListener('change', updateCurrentSetsFromState);
    updateCurrentSetsFromState();
  }
}

/**
 * Handle feedback form submission
 */
function handleFeedbackSubmission() {
  const formData = collectFeedbackData();
  
  if (!validateFeedbackData(formData)) {
    return;
  }

  // Process with RP algorithms
  const results = processFeedbackWithRP(formData);
  
  // Update training state
  updateTrainingState(formData, results);
  
  // Display results
  displayFeedbackResults(results);
  
  // Update UI
  updateChart();
  updateCurrentSetsFromState();
}

/**
 * Collect feedback data from form
 */
function collectFeedbackData() {
  const muscle = document.getElementById('muscleSelect')?.value;
  const currentSets = parseInt(document.getElementById('currentSets')?.value, 10);
  const mmc = parseInt(document.getElementById('mmc')?.value, 10);
  const pump = parseInt(document.getElementById('pump')?.value, 10);
  const disruption = parseInt(document.getElementById('dis')?.value, 10);
  
  // Get performance rating from radio buttons
  const perfRadio = document.querySelector('input[name="perf"]:checked');
  const performance = perfRadio ? parseInt(perfRadio.value, 10) : 1;
    // Get soreness from weekly section if available
  const soreness = parseInt(document.getElementById('sore')?.value, 10) || 1;
  
  // Get enhanced fatigue detection inputs
  const jointAche = parseInt(document.getElementById('jointAche')?.value, 10) || 0;
  const perfChange = parseInt(document.getElementById('perfChange')?.value, 10) || 0;
  
  // Get actual RIR if provided
  const actualRIRInput = document.getElementById('actualRIR');
  const actualRIR = actualRIRInput ? parseFloat(actualRIRInput.value) : null;
  
  // Check for illness/injury
  const hasIllness = document.getElementById('illness2')?.checked || false;

  return {
    muscle,
    currentSets,
    stimulus: { mmc, pump, disruption },
    performance,
    soreness,
    jointAche,
    perfChange,
    actualRIR,
    hasIllness,
    timestamp: new Date().toISOString()
  };
}

/**
 * Validate feedback data
 */
function validateFeedbackData(data) {
  const errors = [];

  if (!data.muscle) {
    errors.push('Please select a muscle group');
  }

  if (isNaN(data.currentSets) || data.currentSets < 0) {
    errors.push('Please enter a valid number of sets');
  }

  if (isNaN(data.stimulus.mmc) || data.stimulus.mmc < 0 || data.stimulus.mmc > 3) {
    errors.push('Mind-muscle connection must be 0-3');
  }

  if (isNaN(data.stimulus.pump) || data.stimulus.pump < 0 || data.stimulus.pump > 3) {
    errors.push('Pump rating must be 0-3');
  }

  if (isNaN(data.stimulus.disruption) || data.stimulus.disruption < 0 || data.stimulus.disruption > 3) {
    errors.push('Disruption rating must be 0-3');
  }

  if (errors.length > 0) {
    showFeedbackError(errors.join('\n'));
    return false;
  }

  return true;
}

/**
 * Process feedback with RP algorithms
 */
function processFeedbackWithRP(data) {
  // Get stimulus score
  const stimulusResult = scoreStimulus(data.stimulus);
  
  // Get set progression recommendation
  const progressionResult = setProgressionAlgorithm(data.soreness, data.performance);
  
  // Get volume progression (combines both algorithms)
  const volumeProgression = getVolumeProgression(data.muscle, {
    stimulus: data.stimulus,
    soreness: data.soreness,
    performance: data.performance,
    hasIllness: data.hasIllness
  });

  // Validate RIR if provided
  let rirValidation = null;
  if (data.actualRIR !== null) {
    rirValidation = validateEffortLevel(data.actualRIR);
  }

  return {
    stimulus: stimulusResult,
    progression: progressionResult,
    volumeProgression,
    rirValidation,
    recommendedAction: determineRecommendedAction(stimulusResult, progressionResult)
  };
}

/**
 * Determine recommended action from algorithm results
 */
function determineRecommendedAction(stimulusResult, progressionResult) {
  // Progression algorithm takes priority for set changes
  let setChange = progressionResult.setChange;
  let advice = progressionResult.advice;
  
  // But consider stimulus quality for additional context
  if (stimulusResult.action === 'reduce_sets' && progressionResult.action === 'add_sets') {
    advice += ' (But consider technique - stimulus was high)';
  }
  
  if (stimulusResult.action === 'add_sets' && progressionResult.action === 'maintain') {
    advice += ' (Stimulus was low - focus on connection)';
  }

  return {
    setChange,
    advice,
    primaryReason: 'RP Set Progression Algorithm',
    secondaryFactor: `Stimulus Score: ${stimulusResult.score}/9`
  };
}

/**
 * Update training state with feedback results
 */
function updateTrainingState(data, results) {
  const { muscle } = data;
  const { setChange } = results.recommendedAction;
  
  // Apply set change if not a recovery session
  if (setChange !== -99) {
    trainingState.addSets(muscle, setChange);
  }
  
  // Track if this was a recovery session
  if (results.progression.action === 'recovery') {
    trainingState.recoverySessionsThisWeek++;
    
    // Check if this muscle needs to be counted for deload consideration
    if (results.volumeProgression.volumeStatus === 'maximum') {
      trainingState.totalMusclesNeedingRecovery++;
    }
  }
  
  // Store feedback for trend analysis
  storeFeedbackForTrends(data, results);
}

/**
 * Store feedback data for trend analysis
 */
function storeFeedbackForTrends(data, results) {
  const key = `feedback-${data.muscle}-${trainingState.weekNo}`;
  const feedbackData = {
    ...data,
    results,
    weekNo: trainingState.weekNo,
    blockNo: trainingState.blockNo
  };
  
  localStorage.setItem(key, JSON.stringify(feedbackData));
}

/**
 * Display feedback results
 */
function displayFeedbackResults(results) {
  const output = document.getElementById('mevOut');
  if (!output) return;

  const { stimulus, volumeProgression, rirValidation } = results;
  
  let resultHTML = `
    <div class="feedback-results">
      <div class="main-recommendation">
        <h4>${volumeProgression.muscle} Recommendation</h4>
        <p class="advice">${volumeProgression.advice}</p>
        <p class="sets-info">
          Current: ${volumeProgression.currentSets} sets → 
          Next week: ${volumeProgression.projectedSets} sets
          ${volumeProgression.setChange !== 0 ? `(${volumeProgression.setChange > 0 ? '+' : ''}${volumeProgression.setChange})` : ''}
        </p>
      </div>
      
      <div class="algorithm-details">
        <div class="stimulus-score">
          <strong>Stimulus Quality:</strong> ${stimulus.score}/9 
          <span class="stimulus-${stimulus.action}">(${stimulus.action.replace('_', ' ')})</span>
        </div>
        <div class="volume-status">
          <strong>Volume Status:</strong> ${volumeProgression.volumeStatus}
        </div>
        <div class="target-rir">
          <strong>Target RIR:</strong> ${volumeProgression.targetRIR}
        </div>
      </div>
    </div>
  `;
  
  // Add RIR validation if provided
  if (rirValidation) {
    resultHTML += `
      <div class="rir-feedback ${rirValidation.urgency}">
        <strong>Effort Check:</strong> ${rirValidation.feedback}
        <br><em>${rirValidation.recommendation}</em>
      </div>
    `;
  }
  
  // Add deload warning if needed
  if (volumeProgression.deloadRecommended) {
    resultHTML += `
      <div class="deload-warning">
        ⚠️ <strong>Deload Recommended</strong> - Consider reducing volume this week
      </div>
    `;
  }
  
  output.innerHTML = resultHTML;
  output.className = getResultClass(determineResultType(results));
}

/**
 * Determine result type for styling
 */
function determineResultType(results) {
  if (results.volumeProgression.deloadRecommended) return 'warning';
  if (results.progression.action === 'recovery') return 'danger';
  if (results.volumeProgression.setChange > 0) return 'success';
  return 'info';
}

/**
 * Get result class for styling
 */
function getResultClass(type) {
  const baseClass = 'result active';
  switch(type) {
    case 'success': return `${baseClass} success`;
    case 'warning': return `${baseClass} warning`;
    case 'danger': return `${baseClass} danger`;
    default: return baseClass;
  }
}

/**
 * Update current sets from training state
 */
function updateCurrentSetsFromState() {
  const muscleSelect = document.getElementById('muscleSelect');
  const currentSetsInput = document.getElementById('currentSets');
  
  if (!muscleSelect || !currentSetsInput) return;
  
  const muscle = muscleSelect.value;
  const currentSets = trainingState.currentWeekSets[muscle] || 0;
  currentSetsInput.value = currentSets;
}

/**
 * Validate RIR input in real-time
 */
function validateRIRInput(event) {
  const input = event.target;
  const value = parseFloat(input.value);
  const targetRIR = trainingState.getTargetRIR();
  
  if (isNaN(value)) return;
  
  const validation = validateEffortLevel(value, targetRIR);
  
  // Visual feedback
  input.classList.remove('rir-good', 'rir-warning', 'rir-danger');
  
  if (validation.isWithinTolerance) {
    input.classList.add('rir-good');
  } else if (validation.urgency === 'medium') {
    input.classList.add('rir-warning');
  } else {
    input.classList.add('rir-danger');
  }
  
  // Show tooltip with feedback
  showRIRTooltip(input, validation);
}

/**
 * Show RIR validation tooltip
 */
function showRIRTooltip(input, validation) {
  // Remove existing tooltip
  const existingTooltip = input.parentNode.querySelector('.rir-tooltip');
  if (existingTooltip) {
    existingTooltip.remove();
  }
  
  // Create new tooltip
  const tooltip = document.createElement('div');
  tooltip.className = `rir-tooltip ${validation.urgency}`;
  tooltip.textContent = validation.feedback;
  
  // Position tooltip
  Object.assign(tooltip.style, {
    position: 'absolute',
    bottom: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '8px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
    color: 'white',
    zIndex: '1000',
    whiteSpace: 'nowrap',
    marginBottom: '5px'
  });
  
  // Color based on urgency
  const colors = {
    normal: '#4CAF50',
    medium: '#ff9800',
    high: '#f44336'
  };
  tooltip.style.backgroundColor = colors[validation.urgency] || colors.normal;
  
  // Add to DOM
  input.parentNode.style.position = 'relative';
  input.parentNode.appendChild(tooltip);
  
  // Remove after delay
  setTimeout(() => {
    if (tooltip.parentNode) {
      tooltip.parentNode.removeChild(tooltip);
    }
  }, 3000);
}

/**
 * Show feedback error
 */
function showFeedbackError(message) {
  const output = document.getElementById('mevOut');
  if (output) {
    output.innerHTML = `<div class="error-message">❌ ${message}</div>`;
    output.className = 'result danger active';
  }
}

/**
 * Add autoregulation features to feedback form
 */
export function addAutoregulationFeatures() {
  const feedbackForm = document.getElementById('mevCard');
  if (!feedbackForm) return;

  const autoregHTML = `
    <div class="autoregulation-section">
      <h4>Real-time Autoregulation</h4>
      <div class="input-group">
        <label for="actualRIR">Actual RIR this set:</label>
        <input type="number" id="actualRIR" min="0" max="10" step="0.5" placeholder="e.g. 2.5">
        <div class="helper-text">How many reps could you have done? (Target: ${trainingState.getTargetRIR()})</div>
      </div>
      <div class="input-group">
        <label for="setNumber">Set number:</label>
        <input type="number" id="setNumber" min="1" value="1">
      </div>
    </div>
  `;
  
  // Insert before submit button
  const submitButton = feedbackForm.querySelector('button');
  if (submitButton) {
    submitButton.insertAdjacentHTML('beforebegin', autoregHTML);
  }
}

export {
  handleFeedbackSubmission,
  updateCurrentSetsFromState,
  validateRIRInput
};
