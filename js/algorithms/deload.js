/**
 * Renaissance Periodization Deload Algorithms
 * Implements adaptive deload strategies based on fatigue patterns and volume progression
 */

import { debugLog } from "../utils/debug.js";

/**
 * Calculate optimal deload type based on training state
 * @param {Object} state - Training state instance
 * @returns {Object} - Deload configuration
 */
export function calculateDeloadStrategy(state) {
  const fatigueLevel = assessOverallFatigue(state);
  const volumePressure = assessVolumePressure(state);
  const trainingHistory = state.blockNo;
  
  let deloadType, volumeReduction, durationWeeks, loadReduction;
  
  // Determine deload strategy based on conditions
  if (fatigueLevel >= 0.7 || volumePressure >= 0.8) {
    // High fatigue/volume → Deep deload
    deloadType = "deep";
    volumeReduction = 0.4; // 40% of MEV
    durationWeeks = 1;
    loadReduction = 0.6; // 60% of working loads
  } else if (fatigueLevel >= 0.5 || volumePressure >= 0.6) {
    // Moderate fatigue → Standard deload
    deloadType = "standard";
    volumeReduction = 0.5; // 50% of MEV
    durationWeeks = 1;
    loadReduction = 0.7; // 70% of working loads
  } else {
    // Low fatigue → Light deload
    deloadType = "light";
    volumeReduction = 0.7; // 70% of MEV
    durationWeeks = 1;
    loadReduction = 0.8; // 80% of working loads
  }
  
  // Adjust for training history (advanced trainees may need longer deloads)
  if (trainingHistory > 20 && deloadType === "deep") {
    durationWeeks = 2;
  }
  
  return {
    type: deloadType,
    volumeReduction,
    durationWeeks,
    loadReduction,
    fatigueLevel,
    volumePressure,
    recommendation: getDeloadRecommendation(deloadType, fatigueLevel, volumePressure)
  };
}

/**
 * Assess overall fatigue level across all muscle groups
 * @param {Object} state - Training state instance
 * @returns {number} - Fatigue level (0-1)
 */
function assessOverallFatigue(state) {
  const muscles = Object.keys(state.volumeLandmarks);
  let totalFatigueScore = 0;
  let totalMuscles = 0;
  
  muscles.forEach(muscle => {
    const currentSets = state.getWeeklySets(muscle);
    const mrv = state.volumeLandmarks[muscle].MRV;
    const mev = state.volumeLandmarks[muscle].MEV;
    
    // Calculate muscle-specific fatigue based on proximity to MRV
    const volumeRatio = (currentSets - mev) / (mrv - mev);
    const muscleScore = Math.max(0, Math.min(1, volumeRatio));
    
    totalFatigueScore += muscleScore;
    totalMuscles++;
  });
  
  // Factor in consecutive MRV weeks
  const mrvPenalty = Math.min(state.consecutiveMRVWeeks * 0.2, 0.4);
  
  // Factor in recovery sessions needed
  const recoveryPenalty = (state.totalMusclesNeedingRecovery / totalMuscles) * 0.3;
  
  const overallFatigue = (totalFatigueScore / totalMuscles) + mrvPenalty + recoveryPenalty;
  
  return Math.min(1, overallFatigue);
}

/**
 * Assess volume pressure across all muscle groups
 * @param {Object} state - Training state instance
 * @returns {number} - Volume pressure (0-1)
 */
function assessVolumePressure(state) {
  const muscles = Object.keys(state.volumeLandmarks);
  let atOrNearMRV = 0;
  let totalMuscles = muscles.length;
  
  muscles.forEach(muscle => {
    const currentSets = state.getWeeklySets(muscle);
    const mrv = state.volumeLandmarks[muscle].MRV;
    
    // Count muscles at or within 2 sets of MRV
    if (currentSets >= mrv - 2) {
      atOrNearMRV++;
    }
  });
  
  return atOrNearMRV / totalMuscles;
}

/**
 * Execute deload protocol
 * @param {Object} state - Training state instance
 * @param {Object} deloadConfig - Deload configuration from calculateDeloadStrategy
 */
export function executeDeload(state, deloadConfig) {
  const { volumeReduction, loadReduction, type } = deloadConfig;
  
  // Apply volume reduction to all muscles
  Object.keys(state.volumeLandmarks).forEach(muscle => {
    const mev = state.volumeLandmarks[muscle].MEV;
    const deloadSets = Math.round(mev * volumeReduction);
    state.currentWeekSets[muscle] = Math.max(1, deloadSets); // Minimum 1 set
  });
  
  // Set deload flags
  state.deloadPhase = true;
  state.loadReduction = loadReduction;
  state.deloadType = type;
  
  // Reset recovery counters
  state.totalMusclesNeedingRecovery = 0;
  state.consecutiveMRVWeeks = 0;
  
  debugLog(`Executing ${type} deload: ${Math.round(volumeReduction * 100)}% volume, ${Math.round(loadReduction * 100)}% load`);
  
  state.saveState();
}

/**
 * Check if deload is complete and ready for normal training
 * @param {Object} state - Training state instance
 * @returns {boolean} - Whether to exit deload phase
 */
export function shouldExitDeload(state) {
  if (!state.deloadPhase) return false;
  
  // Simple approach: exit after 1 week (can be extended for longer deloads)
  return true;
}

/**
 * Exit deload and prepare for next mesocycle
 * @param {Object} state - Training state instance
 */
export function exitDeload(state) {
  state.deloadPhase = false;
  state.loadReduction = 1;
  state.deloadType = null;
  
  // Reset all muscles to MEV for fresh start
  Object.keys(state.volumeLandmarks).forEach(muscle => {
    state.currentWeekSets[muscle] = state.volumeLandmarks[muscle].MEV;
  });
  
  // Reset week and potentially adjust mesocycle length
  state.weekNo = 1;
  
  debugLog("Exiting deload phase, starting fresh mesocycle");
  state.saveState();
}

/**
 * Get human-readable deload recommendation
 * @param {string} type - Deload type
 * @param {number} fatigueLevel - Overall fatigue level
 * @param {number} volumePressure - Volume pressure level
 * @returns {string} - Recommendation text
 */
function getDeloadRecommendation(type, fatigueLevel, volumePressure) {
  const fatiguePct = Math.round(fatigueLevel * 100);
  const volumePct = Math.round(volumePressure * 100);
  
  switch (type) {
    case "deep":
      return `Deep deload recommended due to high fatigue (${fatiguePct}%) and volume pressure (${volumePct}%). Focus on recovery and technique work.`;
    case "standard":
      return `Standard deload recommended with moderate fatigue (${fatiguePct}%) and volume pressure (${volumePct}%). Maintain movement patterns with reduced intensity.`;
    case "light":
      return `Light deload recommended with manageable fatigue (${fatiguePct}%) and volume pressure (${volumePct}%). Brief recovery before resuming progression.`;
    default:
      return "Deload parameters calculated, follow prescribed volume and load reductions.";
  }
}

/**
 * Get deload status summary for UI display
 * @param {Object} state - Training state instance
 * @returns {Object} - Deload status information
 */
export function getDeloadStatus(state) {
  if (!state.deloadPhase) {
    const shouldDeload = state.shouldDeload();
    if (shouldDeload) {
      const strategy = calculateDeloadStrategy(state);
      return {
        active: false,
        recommended: true,
        strategy,
        message: "Deload recommended - high fatigue or volume accumulation detected"
      };
    }
    return {
      active: false,
      recommended: false,
      message: "Normal training progression"
    };
  }
  
  return {
    active: true,
    recommended: false,
    type: state.deloadType,
    loadReduction: state.loadReduction,
    message: `${state.deloadType} deload in progress (${Math.round(state.loadReduction * 100)}% load)`
  };
}

/**
 * Analyze if a deload is needed based on fatigue accumulation
 * @param {Object} state - Training state object
 * @returns {Object} - Deload analysis with recommendations
 */
export function analyzeDeloadNeed(state) {
  const analysis = {
    needsDeload: false,
    fatigueIndex: 0,
    recommendations: [],
    timeline: "immediate",
    confidence: 0.0
  };

  // Get current volume data
  const landmarks = state.volumeLandmarks;
  
  if (!landmarks || Object.keys(landmarks).length === 0) {
    analysis.recommendations.push("Set volume landmarks first");
    return analysis;
  }

  let totalFatigueIndex = 0;
  let muscleCount = 0;
  let highFatigueMuscles = 0;

  // Calculate fatigue index for each muscle
  Object.keys(landmarks).forEach(muscle => {
    const currentSets = state.getWeeklySets(muscle);
    const mrv = landmarks[muscle].MRV;
    const fatigueIndex = currentSets / mrv;
    
    totalFatigueIndex += fatigueIndex;
    muscleCount++;
    
    if (fatigueIndex > 1.3) {
      highFatigueMuscles++;
      analysis.recommendations.push(`${muscle}: High fatigue (${(fatigueIndex * 100).toFixed(0)}% of MRV)`);
    } else if (fatigueIndex > 1.0) {
      analysis.recommendations.push(`${muscle}: Approaching MRV (${(fatigueIndex * 100).toFixed(0)}% of MRV)`);
    }
  });

  // Calculate overall fatigue index
  analysis.fatigueIndex = muscleCount > 0 ? totalFatigueIndex / muscleCount : 0;

  // Check for consecutive weeks above 1.0 fatigue index
  const weekHistory = state.weeklyProgressionHistory || [];
  let recentHighWeeks = 0;
  for (let i = weekHistory.length - 1; i >= Math.max(0, weekHistory.length - 3); i--) {
    const week = weekHistory[i];
    if (week && week.avgFatigueIndex && week.avgFatigueIndex > 1.0) {
      recentHighWeeks++;
    } else {
      break;
    }
  }

  // Deload decision logic
  if (analysis.fatigueIndex > 1.3) {
    analysis.needsDeload = true;
    analysis.timeline = "immediate";
    analysis.confidence = 0.9;
    analysis.recommendations.unshift("🚨 IMMEDIATE DELOAD NEEDED - Fatigue index critically high");
  } else if (analysis.fatigueIndex > 1.0 && recentHighWeeks >= 2) {
    analysis.needsDeload = true;
    analysis.timeline = "this week";
    analysis.confidence = 0.8;
    analysis.recommendations.unshift("⚠️ DELOAD RECOMMENDED - Two weeks of high fatigue");
  } else if (highFatigueMuscles >= 2) {
    analysis.needsDeload = true;
    analysis.timeline = "next week";
    analysis.confidence = 0.7;
    analysis.recommendations.unshift("🔄 DELOAD SUGGESTED - Multiple muscles at high fatigue");
  } else if (analysis.fatigueIndex > 0.9) {
    analysis.needsDeload = false;
    analysis.timeline = "monitor closely";
    analysis.confidence = 0.6;
    analysis.recommendations.unshift("👁️ MONITOR - Approaching deload threshold");
  } else {
    analysis.recommendations.unshift("✅ CONTINUE - Fatigue levels manageable");
  }

  debugLog("Deload analysis completed", analysis);
  return analysis;
}

/**
 * Initialize all muscle groups at MEV (Minimum Effective Volume)
 * @param {Object} state - Training state object
 * @returns {Object} - Reset summary
 */
export function initializeAtMEV(state) {
  const summary = {
    resetMuscles: [],
    newVolumes: {},
    previousVolumes: {},
    totalReduction: 0
  };

  const landmarks = state.volumeLandmarks;
  if (!landmarks || Object.keys(landmarks).length === 0) {
    throw new Error("Volume landmarks must be set before initializing at MEV");
  }

  // Reset each muscle to MEV
  Object.keys(landmarks).forEach(muscle => {
    const mev = landmarks[muscle].MEV;
    const currentVolume = state.getWeeklySets(muscle);
    
    summary.previousVolumes[muscle] = currentVolume;
    summary.newVolumes[muscle] = mev;
    summary.totalReduction += (currentVolume - mev);
    summary.resetMuscles.push(muscle);
    
    // Update state
    state.setWeeklySets(muscle, mev);
  });

  // Reset week counter
  state.weekNo = 1;
  state.lastDeload = new Date().toISOString();
  
  // Clear progression history for fresh start
  state.weeklyProgressionHistory = [];
  
  // Log the reset
  const resetLog = {
    timestamp: new Date().toISOString(),
    type: "MEV_INITIALIZATION",
    summary: summary
  };
  
  state.deloadHistory = state.deloadHistory || [];
  state.deloadHistory.push(resetLog);

  debugLog("MEV initialization completed", summary);
  return summary;
}
