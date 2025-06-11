/**
 * Renaissance Periodization Effort Management
 * Handles RIR (Reps In Reserve) calculations and effort progression
 */

import trainingState from '../core/trainingState.js';

/**
 * Calculate target RIR based on meso progression
 * @param {number} weekNumber - Current week (1-based)
 * @param {number} mesoLength - Total weeks in mesocycle
 * @param {number} startRIR - Starting RIR (default 3)
 * @param {number} endRIR - Ending RIR (default 0.5)
 * @returns {Object} - RIR calculation result
 */
function calculateTargetRIR(weekNumber = null, mesoLength = null, startRIR = 3, endRIR = 0.5) {
  const week = weekNumber || trainingState.weekNo;
  const mesoLen = mesoLength || trainingState.mesoLen;
  
  if (week > mesoLen) {
    return {
      targetRIR: startRIR,
      warning: 'Week exceeds mesocycle length',
      progression: 0
    };
  }
  
  // Linear progression from start to end RIR
  const progressionRate = (startRIR - endRIR) / (mesoLen - 1);
  const targetRIR = startRIR - (progressionRate * (week - 1));
  const clampedRIR = Math.max(endRIR, Math.min(startRIR, targetRIR));
  
  // Calculate progression percentage
  const progression = ((week - 1) / (mesoLen - 1)) * 100;
    let intensityLevel = 'moderate';
  let advice = '';
  
  if (clampedRIR >= 2.5) {
    intensityLevel = 'low';
    advice = 'Focus on form and mind-muscle connection';
  } else if (clampedRIR >= 2.0) {
    intensityLevel = 'moderate';
    advice = 'Balanced effort - challenge without excessive fatigue';
  } else if (clampedRIR >= 1.0) {
    intensityLevel = 'high';
    advice = 'High effort - monitor recovery closely';
  } else {
    intensityLevel = 'maximum';
    advice = 'Maximum effort - deload approaching';
  }
  
  return {
    targetRIR: Math.round(clampedRIR * 2) / 2, // Round to nearest 0.5
    intensityLevel,
    advice,
    progression: Math.round(progression),
    week,
    mesoLength: mesoLen
  };
}

/**
 * Validate actual RIR against target
 * @param {number} actualRIR - Actual RIR reported
 * @param {number} targetRIR - Target RIR for the week
 * @param {number} tolerance - Acceptable deviation (default ±1)
 * @returns {Object} - Validation result
 */
function validateEffortLevel(actualRIR, targetRIR = null, tolerance = 1) {
  const target = targetRIR || trainingState.getTargetRIR();
  const deviation = Math.abs(actualRIR - target);
  const isWithinTolerance = deviation <= tolerance;
  
  let feedback = '';
  let recommendation = '';
  let urgency = 'normal';
  
  if (isWithinTolerance) {
    feedback = `On target (${actualRIR} vs ${target} RIR)`;
    recommendation = 'Continue current effort level';
    urgency = 'normal';
  } else if (actualRIR > target) {
    const difference = actualRIR - target;
    feedback = `Too easy (${difference} RIR above target)`;
    recommendation = difference > 2 ? 'Increase weight significantly' : 'Increase weight moderately';
    urgency = difference > 2 ? 'high' : 'medium';
  } else {
    const difference = target - actualRIR;
    feedback = `Too hard (${difference} RIR below target)`;
    recommendation = difference > 2 ? 'Reduce weight significantly' : 'Reduce weight slightly';
    urgency = difference > 2 ? 'high' : 'medium';
  }
  
  return {
    actualRIR,
    targetRIR: target,
    deviation,
    isWithinTolerance,
    feedback,
    recommendation,
    urgency
  };
}

/**
 * Calculate effort progression for next session
 * @param {string} muscle - Muscle group
 * @param {Object} lastSession - Last session data
 * @returns {Object} - Effort progression recommendation
 */
function getEffortProgression(muscle, lastSession) {
  const currentRIR = trainingState.getTargetRIR();
  const volumeStatus = trainingState.getVolumeStatus(muscle);
  
  let weightRecommendation = 'maintain';
  let rirAdjustment = 0;
  let advice = '';
  
  // Base progression on last session performance
  if (lastSession.actualRIR < lastSession.targetRIR - 1.5) {
    // Too hard last time
    weightRecommendation = 'decrease';
    rirAdjustment = 0.5;
    advice = 'Reduce weight to hit target RIR';
  } else if (lastSession.actualRIR > lastSession.targetRIR + 1.5) {
    // Too easy last time
    weightRecommendation = 'increase';
    rirAdjustment = -0.5;
    advice = 'Increase weight to hit target RIR';
  } else {
    // On target
    if (volumeStatus === 'maximum') {
      advice = 'Maintain weight - at volume limit';
    } else {
      advice = 'Good effort level - continue progression';
    }
  }
  
  // Adjust based on volume status
  if (volumeStatus === 'maximum' && weightRecommendation === 'increase') {
    weightRecommendation = 'maintain';
    advice = 'At MRV - avoid adding intensity stress';
  }
  
  const projectedRIR = Math.max(0, currentRIR + rirAdjustment);
  
  return {
    muscle,
    currentTargetRIR: currentRIR,
    projectedRIR,
    weightRecommendation,
    advice,
    volumeStatus
  };
}

/**
 * Calculate autoregulation recommendations
 * @param {Object} sessionFeedback - Real-time session feedback
 * @returns {Object} - Autoregulation advice
 */
function getAutoregulationAdvice(sessionFeedback) {
  const { actualRIR, plannedRIR, setNumber, totalPlannedSets, muscle } = sessionFeedback;
  const deviation = actualRIR - plannedRIR;
  
  let advice = '';
  let action = 'continue';
  let weightAdjustment = 0; // Percentage
  
  // Early sets (first 1/3)
  if (setNumber <= Math.ceil(totalPlannedSets / 3)) {
    if (deviation > 1.5) {
      advice = 'Weight too light - increase by 5-10%';
      action = 'increase_weight';
      weightAdjustment = 7.5;
    } else if (deviation < -1.5) {
      advice = 'Weight too heavy - decrease by 5-10%';
      action = 'decrease_weight';
      weightAdjustment = -7.5;
    } else {
      advice = 'Weight appropriate - continue';
    }
  }
  // Middle sets (middle 1/3)
  else if (setNumber <= Math.ceil(totalPlannedSets * 2 / 3)) {
    if (deviation > 2) {
      advice = 'Still too easy - increase weight';
      action = 'increase_weight';
      weightAdjustment = 5;
    } else if (deviation < -2) {
      advice = 'Too fatiguing - consider stopping early';
      action = 'consider_stopping';
      weightAdjustment = 0;
    } else {
      advice = 'Good progression - continue';
    }
  }
  // Final sets (last 1/3)
  else {
    if (deviation < -1) {
      advice = 'Very fatiguing - consider stopping to preserve recovery';
      action = 'consider_stopping';
    } else if (deviation > 2) {
      advice = 'Could push harder - add 1-2 sets if recovering well';
      action = 'consider_adding_sets';
    } else {
      advice = 'Appropriate fatigue for final sets';
    }
  }
  
  return {
    setNumber,
    totalPlannedSets,
    actualRIR,
    plannedRIR,
    deviation,
    advice,
    action,
    weightAdjustment
  };
}

/**
 * Generate weekly effort summary
 * @returns {Object} - Weekly effort analysis
 */
function getWeeklyEffortSummary() {
  const currentWeek = trainingState.weekNo;
  const mesoLength = trainingState.mesoLen;
  const targetRIR = trainingState.getTargetRIR();
  
  const weeklyAdvice = [];
  
  // Week-specific advice
  if (currentWeek === 1) {
    weeklyAdvice.push('Focus on technique and mind-muscle connection');
    weeklyAdvice.push('Establish baseline weights for the mesocycle');
  } else if (currentWeek === mesoLength) {
    weeklyAdvice.push('Peak intensity week - push close to failure');
    weeklyAdvice.push('Prepare for upcoming deload');
  } else if (currentWeek > mesoLength * 0.75) {
    weeklyAdvice.push('High intensity phase - monitor recovery closely');
    weeklyAdvice.push('Focus on performance over volume additions');
  } else {
    weeklyAdvice.push('Progressive overload phase - gradually increase demands');
    weeklyAdvice.push('Balance volume and intensity progression');
  }
  
  return {
    currentWeek,
    mesoLength,
    targetRIR,
    weeklyAdvice,
    phaseDescription: getPhaseDescription(currentWeek, mesoLength)
  };
}

/**
 * Get phase description based on week
 * @param {number} week - Current week
 * @param {number} mesoLength - Total meso length
 * @returns {string} - Phase description
 */
function getPhaseDescription(week, mesoLength) {
  const percentage = (week / mesoLength) * 100;
  
  if (percentage <= 25) {
    return 'Accumulation Phase - Building foundation';
  } else if (percentage <= 60) {
    return 'Progression Phase - Steady overload';
  } else if (percentage <= 85) {
    return 'Intensification Phase - High demands';
  } else {
    return 'Peak Phase - Maximum effort';
  }
}

export {
  calculateTargetRIR,
  validateEffortLevel,
  getEffortProgression,
  getWeeklyEffortSummary,
  getAutoregulationAdvice
};
