/**
 * Renaissance Periodization Effort Management
 * Handles RIR (Reps In Reserve) calculations and effort progression
 */

import trainingState from '../core/trainingState.js';

/**
 * Weekly RIR Schedule for Mesocycle Progression
 * Standard RP approach: [3, 2, 1, 0] across 4-6 week mesocycle
 */
const RIR_SCHEDULE = {
  4: [3, 2, 1, 0],        // 4-week meso
  5: [3, 2.5, 2, 1, 0],   // 5-week meso  
  6: [3, 2.5, 2, 1.5, 1, 0] // 6-week meso
};

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
 * Get scheduled RIR for specific week based on mesocycle length
 * @param {number} week - Current week (1-based)
 * @param {number} mesoLength - Total weeks in mesocycle
 * @returns {number} - Target RIR for the week
 */
function getScheduledRIR(week, mesoLength) {
  const schedule = RIR_SCHEDULE[mesoLength];
  if (!schedule) {
    // Fallback to linear progression for non-standard lengths
    const startRIR = 3;
    const endRIR = 0;
    const progressionRate = (startRIR - endRIR) / (mesoLength - 1);
    return Math.max(endRIR, startRIR - (progressionRate * (week - 1)));
  }
  
  // Return scheduled RIR, clamping to valid week range
  const weekIndex = Math.min(week - 1, schedule.length - 1);
  return schedule[weekIndex];
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
 * Process weekly load adjustments based on RIR feedback
 * @param {Object} weeklyFeedback - Feedback data for all muscles
 * @returns {Object} - Load adjustment recommendations
 */
function processWeeklyLoadAdjustments(weeklyFeedback) {
  const currentWeek = trainingState.weekNo;
  const targetRIR = getScheduledRIR(currentWeek, trainingState.mesoLen);
  const adjustments = {};
  let totalMusclesAdjusted = 0;
  
  Object.keys(weeklyFeedback).forEach(muscle => {
    const feedback = weeklyFeedback[muscle];
    const avgActualRIR = feedback.averageRIR || targetRIR;
    const rirDeviation = avgActualRIR - targetRIR;
    
    let loadAdjustment = 0; // Percentage change
    let reason = '';
    
    // Determine load adjustment based on RIR deviation
    if (Math.abs(rirDeviation) <= 0.5) {
      // On target - small progressive increase
      loadAdjustment = 2.5; // 2.5% increase
      reason = 'On target - progressive overload';
    } else if (rirDeviation > 0.5) {
      // Too easy - increase load significantly
      if (rirDeviation > 2) {
        loadAdjustment = 10; // 10% increase
        reason = 'Too easy - major increase needed';
      } else if (rirDeviation > 1) {
        loadAdjustment = 7.5; // 7.5% increase
        reason = 'Too easy - moderate increase';
      } else {
        loadAdjustment = 5; // 5% increase
        reason = 'Slightly easy - small increase';
      }
    } else {
      // Too hard - decrease load
      if (rirDeviation < -2) {
        loadAdjustment = -10; // 10% decrease
        reason = 'Too hard - major decrease needed';
      } else if (rirDeviation < -1) {
        loadAdjustment = -5; // 5% decrease
        reason = 'Too hard - moderate decrease';
      } else {
        loadAdjustment = -2.5; // 2.5% decrease
        reason = 'Slightly hard - small decrease';
      }
    }
    
    // Factor in performance trends
    const performanceTrend = feedback.performanceTrend || 0; // -1, 0, 1
    if (performanceTrend < 0) {
      loadAdjustment -= 2.5; // Reduce load if performance declining
      reason += ' (performance declining)';
    } else if (performanceTrend > 0 && rirDeviation >= 0) {
      loadAdjustment += 2.5; // Increase more if performance improving
      reason += ' (performance improving)';
    }
    
    // Cap adjustments at ±15%
    loadAdjustment = Math.max(-15, Math.min(15, loadAdjustment));
    
    adjustments[muscle] = {
      currentRIR: avgActualRIR,
      targetRIR,
      deviation: rirDeviation,
      loadAdjustment,
      reason,
      urgency: Math.abs(rirDeviation) > 1.5 ? 'high' : 
               Math.abs(rirDeviation) > 1 ? 'medium' : 'low'
    };
    
    if (Math.abs(loadAdjustment) > 2.5) {
      totalMusclesAdjusted++;
    }
  });
  
  return {
    week: currentWeek,
    targetRIR,
    adjustments,
    summary: {
      totalMuscles: Object.keys(weeklyFeedback).length,
      musclesAdjusted: totalMusclesAdjusted,
      avgLoadChange: Object.values(adjustments).reduce((sum, adj) => sum + adj.loadAdjustment, 0) / Object.keys(adjustments).length
    }
  };
}

/**
 * Generate load progression recommendations for next week
 * @param {string} muscle - Muscle group
 * @param {Object} sessionHistory - Recent session data
 * @returns {Object} - Load progression recommendation
 */
function getLoadProgression(muscle, sessionHistory = {}) {
  const currentWeek = trainingState.weekNo;
  const nextWeek = currentWeek + 1;
  const currentRIR = getScheduledRIR(currentWeek, trainingState.mesoLen);
  const nextRIR = getScheduledRIR(nextWeek, trainingState.mesoLen);
  
  const rirDrop = currentRIR - nextRIR;
  const recentPerformance = sessionHistory.averageRIR || currentRIR;
  const performanceDeviation = recentPerformance - currentRIR;
  
  let loadIncrease = 0;
  let recommendation = '';
  
  if (rirDrop > 0) {
    // RIR is dropping - need to increase intensity
    const baseIncrease = rirDrop * 5; // ~5% per RIR drop
    
    // Adjust based on recent performance
    if (performanceDeviation > 1) {
      // Performing too easy - can increase more aggressively
      loadIncrease = baseIncrease + 5;
      recommendation = `Increase load ${loadIncrease.toFixed(1)}% for Week ${nextWeek} (RIR ${nextRIR}) - currently too easy`;
    } else if (performanceDeviation < -1) {
      // Struggling - increase more conservatively
      loadIncrease = baseIncrease * 0.5;
      recommendation = `Conservative increase ${loadIncrease.toFixed(1)}% for Week ${nextWeek} (RIR ${nextRIR}) - struggling with current load`;
    } else {
      // On target - standard progression
      loadIncrease = baseIncrease;
      recommendation = `Standard increase ${loadIncrease.toFixed(1)}% for Week ${nextWeek} (RIR ${nextRIR})`;
    }
  } else if (rirDrop === 0) {
    // Same RIR - small progressive overload
    loadIncrease = 2.5;
    recommendation = `Small progressive overload ${loadIncrease.toFixed(1)}% for Week ${nextWeek} (RIR ${nextRIR})`;
  } else {
    // RIR increasing (shouldn't happen in normal progression)
    loadIncrease = 0;
    recommendation = `Maintain current load for Week ${nextWeek} (RIR ${nextRIR})`;
  }
  
  // Volume status considerations
  const volumeStatus = trainingState.getVolumeStatus(muscle);
  if (volumeStatus === 'maximum') {
    loadIncrease *= 0.75; // Reduce load increases when at MRV
    recommendation += ' (reduced due to MRV)';
  }
  
  return {
    muscle,
    currentWeek,
    nextWeek,
    currentRIR,
    nextRIR,
    rirDrop,
    loadIncrease: Math.round(loadIncrease * 10) / 10, // Round to 1 decimal
    recommendation,
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

/**
 * Simulate weekly feedback for auto-progression demo
 * @param {Array} muscles - List of muscle groups
 * @param {number} week - Current week
 * @returns {Object} - Simulated weekly feedback
 */
function simulateWeeklyRIRFeedback(muscles, week) {
  const targetRIR = getScheduledRIR(week, trainingState.mesoLen);
  const feedback = {};
  
  muscles.forEach(muscle => {
    const volumeStatus = trainingState.getVolumeStatus(muscle);
    
    // Simulate realistic RIR deviation based on volume status and week
    let rirDeviation = 0;
    
    if (volumeStatus === 'maximum') {
      // At MRV - likely struggling more
      rirDeviation = Math.random() * 1.5 - 0.5; // -0.5 to +1.0
    } else if (week <= 2) {
      // Early weeks - usually easier
      rirDeviation = Math.random() * 1.5 + 0.5; // +0.5 to +2.0
    } else if (week >= trainingState.mesoLen - 1) {
      // Late weeks - getting harder
      rirDeviation = Math.random() * 1.5 - 1.0; // -1.0 to +0.5
    } else {
      // Middle weeks - more variable
      rirDeviation = Math.random() * 2 - 1; // -1.0 to +1.0
    }
      const simulatedRIR = Math.max(0, targetRIR + rirDeviation);
    
    // Generate enhanced fatigue indicators based on volume status
    let jointAche = 0;
    let perfChange = 0;
    let lastLoad = 100; // Default baseline
    let soreness = 1; // Default mild soreness
    
    if (volumeStatus === 'maximum') {
      jointAche = Math.floor(Math.random() * 3) + 1; // 1-3 (mild to pain)
      perfChange = Math.random() > 0.6 ? -1 : 0; // 40% chance of performance drop
      lastLoad = trainingState.baselineStrength[muscle] * 0.95; // 5% strength drop
      soreness = Math.floor(Math.random() * 2) + 2; // 2-3 (moderate to high)
    } else if (volumeStatus === 'high') {
      jointAche = Math.floor(Math.random() * 2); // 0-1 (none to mild)
      perfChange = Math.random() > 0.8 ? -1 : (Math.random() > 0.5 ? 0 : 1); // Mixed performance
      lastLoad = trainingState.baselineStrength[muscle] * 0.98; // 2% strength drop
      soreness = Math.floor(Math.random() * 2) + 1; // 1-2 (mild to moderate)
    } else {
      jointAche = Math.floor(Math.random() * 2); // 0-1 (none to mild)
      perfChange = Math.random() > 0.7 ? 1 : 0; // 30% chance of PR
      lastLoad = trainingState.baselineStrength[muscle] * 1.02; // 2% strength increase
      soreness = Math.floor(Math.random() * 2); // 0-1 (none to mild)
    }
    
    feedback[muscle] = {
      actualRIR: simulatedRIR,
      targetRIR,
      averageRIR: Math.round(simulatedRIR * 10) / 10,
      performanceTrend: week > 1 ? (Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0) : 0,
      sessions: 2, // Assume 2 sessions per week
      volumeStatus,
      // Enhanced fatigue detection fields
      soreness,
      jointAche,
      perfChange,
      lastLoad: Math.round(lastLoad * 10) / 10,
      pump: Math.min(3, Math.floor(Math.random() * 3) + 1),
      disruption: Math.min(3, Math.floor(Math.random() * 3) + 1)
    };
  });
  
  return feedback;
}

export {
  calculateTargetRIR,
  validateEffortLevel,
  getEffortProgression,
  getWeeklyEffortSummary,
  getAutoregulationAdvice,
  getScheduledRIR,
  processWeeklyLoadAdjustments,
  getLoadProgression,
  simulateWeeklyRIRFeedback
};
