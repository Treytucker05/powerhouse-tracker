/**
 * Renaissance Periodization Volume Algorithms
 * Implements RP Table 2.2 (MEV Stimulus Estimator) and Table 2.3 (Set Progression Algorithm)
 */

import Chart from 'chart.js/auto';
import trainingState from "../core/trainingState.js";
import { isHighFatigue } from "./fatigue.js";
import { debugLog } from "../utils/debug.js";

/**
 * RP Table 2.2: MEV Stimulus Estimator
 * Scores stimulus quality based on mind-muscle connection, pump, and workload
 * @param {Object} feedback - {mmc: 0-3, pump: 0-3, disruption: 0-3}
 * @returns {Object} - {score: 0-9, advice: string, action: string}
 */
function scoreStimulus({ mmc, pump, disruption }) {
  // Validate inputs
  const clamp = (val, min, max) => Math.max(min, Math.min(max, val));
  const clampedMmc = clamp(mmc, 0, 3);
  const clampedPump = clamp(pump, 0, 3);
  const clampedWorkload = clamp(disruption, 0, 3);

  const totalScore = clampedMmc + clampedPump + clampedWorkload;

  let advice, action, setChange;

  if (totalScore <= 3) {
    advice = `Stimulus too low (${totalScore}/9) → Add 2 sets next session`;
    action = "add_sets";
    setChange = 2;
  } else if (totalScore <= 6) {
    advice = `Stimulus adequate (${totalScore}/9) → Keep sets the same`;
    action = "maintain";
    setChange = 0;
  } else {
    advice = `Stimulus excessive (${totalScore}/9) → Remove 1-2 sets next session`;
    action = "reduce_sets";
    setChange = -1;
  }
  return {
    score: totalScore,
    advice,
    action,
    setChange,
    breakdown: {
      mmc: clampedMmc,
      pump: clampedPump,
      disruption: clampedWorkload,
    },
  };
}

/**
 * Auto-Volume Progression System
 * Automatically increments sets based on MEV/MRV status and recovery feedback
 * @param {string} muscle - Target muscle group
 * @param {Object} feedback - {stimulus: 0-9, soreness: 0-3, perf: -1 to 2, recoverySession: boolean}
 * @param {Object} state - Training state singleton
 * @returns {Object} - {add: boolean, delta: number, reason: string}
 */
function autoSetIncrement(muscle, feedback = {}, state) {
  const currentSets = state.getWeeklySets(muscle);
  const landmarks = state.volumeLandmarks[muscle];
  const atMRV = currentSets >= landmarks.MRV;
  const nearMRV = currentSets >= landmarks.MRV - 4; // Within 4 sets of MRV
  const vStat = state.getVolumeStatus(muscle);
  const stim = scoreStimulus(
    feedback.stimulus || { mmc: 0, pump: 0, disruption: 0 },
  );
  const lowStim = stim.score <= 3;
  const goodRec =
    feedback.recoveryMuscle === "recovered" ||
    feedback.recoveryMuscle === "fully recovered";

  // No progression if at MRV, recovery session, or high volume
  if (
    atMRV ||
    feedback.recoverySession ||
    ["maintenance", "optimal", "high", "maximum"].includes(vStat)
  )
    return { add: false, delta: 0, reason: "At volume ceiling or recovery" };

  // Enhanced RP logic: +2 sets when stimulus ≤3 AND near MRV (≥4 sets to MRV)
  if (lowStim && nearMRV && goodRec) {
    return { add: true, delta: 2, reason: "Low stimulus near MRV - aggressive progression" };
  }

  // Standard progressions
  if (["low"].includes(vStat) && lowStim) 
    return { add: true, delta: 1, reason: "Low volume, low stimulus" };
  if (vStat === "suboptimal" && lowStim && goodRec)
    return { add: true, delta: 1, reason: "Suboptimal volume, low stimulus, good recovery" };
  
  return { add: false, delta: 0, reason: "No progression criteria met" };
}

/**
 * Process weekly auto-volume progression for all muscles
 * @param {Object} weeklyFeedback - {muscle: {stimulus, soreness, perf, recoverySession}}
 * @param {Object} state - Training state singleton
 * @returns {Object} - Progression summary and deload recommendation
 */
function processWeeklyVolumeProgression(weeklyFeedback, state) {
  const progressionLog = {};
  let deloadTriggered = false;
  let mrvHits = 0;  // Process each muscle's auto-progression
  Object.keys(weeklyFeedback).forEach((muscle) => {
    const feedback = weeklyFeedback[muscle];

    // Check for high fatigue using enhanced detection
    const high = isHighFatigue(muscle, feedback, state);
    if (high) {
      // Treat like MRV - trigger recovery
      state.hitMRV(muscle);
      mrvHits++;
      debugLog(`hitMRV: true (fatigue) - ${muscle}`);

      // Force recovery session
      feedback.recoverySession = true;
    }

    const increment = autoSetIncrement(muscle, feedback, state);

    // Apply set changes (enhanced to handle +2 sets)
    if (increment.add) {
      state.addSets(muscle, increment.delta);
      debugLog(`Added ${increment.delta} sets to ${muscle}: ${increment.reason}`);
    }

    // Track MRV hits for deload logic
    if (state.getWeeklySets(muscle) >= state.volumeLandmarks[muscle].MRV) {
      state.hitMRV(muscle);
      mrvHits++;
    }

    progressionLog[muscle] = {
      previousSets:
        state.lastWeekSets[muscle] || state.volumeLandmarks[muscle].MEV,
      currentSets: state.getWeeklySets(muscle),
      increment: increment.delta,
      reason: increment.reason,
      status: state.getVolumeStatus(muscle),
      stimulusScore: feedback.stimulus ? scoreStimulus(feedback.stimulus).score : null,
    };
  });

  // Check deload conditions
  if (state.shouldDeload()) {
    state.startDeload();
    deloadTriggered = true;
  }

  return {
    progressionLog,
    deloadTriggered,
    mrvHits,
    weekComplete: true,
    recommendation: deloadTriggered
      ? "Deload phase initiated"
      : "Continue progression",
  };
}

/**
 * RP Table 2.3: Set Progression Algorithm
 * Matrix lookup based on soreness level and performance vs last session
 * @param {number} soreness - 0-3 (0=none, 1=mild, 2=moderate, 3=high)
 * @param {number} performance - 0-3 (0=worse, 1=same, 2=better, 3=much better)
 * @returns {Object} - {advice: string, action: string, setChange: number}
 */
function setProgressionAlgorithm(soreness, performance) {
  // Clamp inputs to valid ranges
  const clamp = (val, min, max) => Math.max(min, Math.min(max, val));
  const s = clamp(soreness, 0, 3);
  const p = clamp(performance, 0, 3);

  // RP Set Progression Matrix [soreness][performance]
  const progressionMatrix = [
    // Soreness 0 (None)
    [
      { advice: "Add 1 set next session", action: "add_sets", setChange: 1 }, // Performance 0 (worse)
      { advice: "Add 2 sets next session", action: "add_sets", setChange: 2 }, // Performance 1 (same)
      { advice: "Add 2-3 sets next session", action: "add_sets", setChange: 2 }, // Performance 2 (better)
      { advice: "Add 2-3 sets next session", action: "add_sets", setChange: 3 }, // Performance 3 (much better)
    ],
    // Soreness 1 (Mild)
    [
      {
        advice: "Hold sets at current level",
        action: "maintain",
        setChange: 0,
      }, // Performance 0
      { advice: "Add 1 set next session", action: "add_sets", setChange: 1 }, // Performance 1
      { advice: "Add 2 sets next session", action: "add_sets", setChange: 2 }, // Performance 2
      { advice: "Add 2-3 sets next session", action: "add_sets", setChange: 2 }, // Performance 3
    ],
    // Soreness 2 (Moderate)
    [
      { advice: "Do recovery session", action: "recovery", setChange: -99 }, // Performance 0
      {
        advice: "Hold sets at current level",
        action: "maintain",
        setChange: 0,
      }, // Performance 1
      {
        advice: "Hold sets at current level",
        action: "maintain",
        setChange: 0,
      }, // Performance 2
      { advice: "Add 1 set next session", action: "add_sets", setChange: 1 }, // Performance 3
    ],
    // Soreness 3 (High)
    [
      { advice: "Do recovery session", action: "recovery", setChange: -99 }, // Performance 0
      { advice: "Do recovery session", action: "recovery", setChange: -99 }, // Performance 1
      { advice: "Do recovery session", action: "recovery", setChange: -99 }, // Performance 2
      {
        advice: "Hold sets at current level",
        action: "maintain",
        setChange: 0,
      }, // Performance 3
    ],
  ];

  return progressionMatrix[s][p];
}

/**
 * Analyze current volume status relative to landmarks
 * @param {string} muscle - Muscle group name
 * @param {number} currentSets - Current weekly sets (optional, uses state if not provided)
 * @returns {Object} - Volume analysis
 */
function analyzeVolumeStatus(muscle, currentSets = null) {
  const sets =
    currentSets !== null ? currentSets : trainingState.currentWeekSets[muscle];
  const landmarks = trainingState.volumeLandmarks[muscle];

  if (!landmarks) {
    throw new Error(`Unknown muscle group: ${muscle}`);
  }

  const status = trainingState.getVolumeStatus(muscle, sets);
  const percentage = (sets / landmarks.MRV) * 100;

  let recommendation = "";
  let urgency = "normal";

  switch (status) {
    case "under-minimum":
      recommendation = `Below MV (${landmarks.MV}). Increase volume significantly.`;
      urgency = "high";
      break;
    case "maintenance":
      recommendation = `In maintenance zone (${landmarks.MV}-${landmarks.MEV}). Consider increasing for growth.`;
      urgency = "low";
      break;
    case "optimal":
      recommendation = `In optimal zone (${landmarks.MEV}-${landmarks.MAV}). Continue progressive overload.`;
      urgency = "normal";
      break;
    case "high":
      recommendation = `High volume zone (${landmarks.MAV}-${landmarks.MRV}). Monitor recovery closely.`;
      urgency = "medium";
      break;
    case "maximum":
      recommendation = `At/above MRV (${landmarks.MRV}). Deload recommended.`;
      urgency = "high";
      break;
  }

  return {
    muscle,
    currentSets: sets,
    landmarks,
    status,
    percentage: Math.round(percentage),
    recommendation,
    urgency,
    color: trainingState.getVolumeColor(muscle, sets),
  };
}

/**
 * Calculate recovery session volume
 * @param {string} muscle - Muscle group name
 * @param {boolean} hasIllness - Whether trainee has illness/injury
 * @returns {Object} - Recovery session recommendation
 */
function calculateRecoveryVolume(muscle, hasIllness = false) {
  const landmarks = trainingState.volumeLandmarks[muscle];
  const recoveryVolume = trainingState.getRecoveryVolume(muscle, hasIllness);

  return {
    muscle,
    recommendedSets: recoveryVolume,
    reasoning: hasIllness ? "illness adjustment" : "standard recovery",
    landmarks,
    percentage: Math.round((recoveryVolume / landmarks.MEV) * 100),
  };
}

/**
 * Validate volume input against landmarks
 * @param {string} muscle - Muscle group name
 * @param {number} proposedSets - Proposed weekly sets
 * @returns {Object} - Validation result
 */
function validateVolumeInput(muscle, proposedSets) {
  const landmarks = trainingState.volumeLandmarks[muscle];
  const isValid = proposedSets >= 0 && proposedSets <= landmarks.MRV * 1.2; // Allow 20% over MRV

  let warning = "";
  if (proposedSets < 0) {
    warning = "Sets cannot be negative";
  } else if (proposedSets > landmarks.MRV) {
    warning = `Above MRV (${landmarks.MRV}). Consider deload.`;
  } else if (proposedSets < landmarks.MV) {
    warning = `Below MV (${landmarks.MV}). May not be sufficient for adaptation.`;
  }

  return {
    isValid,
    warning,
    proposedSets,
    landmarks,
  };
}

/**
 * Get volume progression recommendation for next week
 * @param {string} muscle - Muscle group name
 * @param {Object} feedback - Latest training feedback
 * @returns {Object} - Next week recommendation
 */
function getVolumeProgression(muscle, feedback) {
  const currentSets = trainingState.currentWeekSets[muscle];
  const volumeAnalysis = analyzeVolumeStatus(muscle);
  const vStat = trainingState.getVolumeStatus(muscle);
  if (["optimal", "high", "maximum"].includes(vStat))
    return {
      deltaSets: 0,
      headline: "Maintain current sets next session",
      currentSets: currentSets,
      nextSets: currentSets,
      notes: "Volume already optimal",
    };

  // Get stimulus score
  const stimulusResult = scoreStimulus(feedback.stimulus);

  // Get set progression recommendation
  const progressionResult = setProgressionAlgorithm(
    feedback.soreness,
    feedback.performance,
  );

  // Combine recommendations with volume constraints
  let finalSetChange = progressionResult.setChange;
  let finalAdvice = progressionResult.advice;

  // Override if at volume limits
  if (volumeAnalysis.status === "maximum" && finalSetChange > 0) {
    finalSetChange = 0;
    finalAdvice = "At MRV limit. Hold sets or consider deload.";
  }

  if (volumeAnalysis.status === "under-minimum" && finalSetChange <= 0) {
    finalSetChange = 2;
    finalAdvice = "Below minimum volume. Add sets regardless of fatigue.";
  }

  // Special handling for recovery sessions
  if (progressionResult.action === "recovery") {
    const recoveryVolume = calculateRecoveryVolume(muscle, feedback.hasIllness);
    finalSetChange = recoveryVolume.recommendedSets - currentSets;
    finalAdvice = `Recovery session: ${recoveryVolume.recommendedSets} sets (${recoveryVolume.reasoning})`;
  }

  const projectedSets = Math.max(0, currentSets + finalSetChange);

  return {
    muscle,
    currentSets,
    projectedSets,
    setChange: finalSetChange,
    advice: finalAdvice,
    stimulusScore: stimulusResult.score,
    volumeStatus: volumeAnalysis.status,
    targetRIR: trainingState.getTargetRIR(),
    deloadRecommended: trainingState.shouldDeload(),
  };
}

/**
 * Analyze all muscles for deload necessity
 * @returns {Object} - Deload analysis
 */
function analyzeDeloadNeed() {
  const muscles = Object.keys(trainingState.volumeLandmarks);
  const mrvBreaches = muscles.filter(
    (muscle) => trainingState.getVolumeStatus(muscle) === "maximum",
  );

  const shouldDeload = trainingState.shouldDeload();
  const reasons = [];

  if (trainingState.consecutiveMRVWeeks >= 2) {
    reasons.push("Two consecutive weeks at MRV");
  }

  if (
    trainingState.totalMusclesNeedingRecovery >= Math.ceil(muscles.length / 2)
  ) {
    reasons.push("Most muscles need recovery sessions");
  }

  if (trainingState.weekNo >= trainingState.mesoLen) {
    reasons.push("End of mesocycle reached");
  }

  if (mrvBreaches.length >= Math.ceil(muscles.length / 3)) {
    reasons.push(`${mrvBreaches.length} muscle groups at/above MRV`);
  }

  return {
    shouldDeload,
    reasons,
    mrvBreaches,
    consecutiveMRVWeeks: trainingState.consecutiveMRVWeeks,
    currentWeek: trainingState.weekNo,
    mesoLength: trainingState.mesoLen,
    musclesNeedingRecovery: trainingState.totalMusclesNeedingRecovery,
  };
}

// Export all functions
export {
  scoreStimulus,
  scoreStimulus as mevStimulusEstimator,
  setProgressionAlgorithm,
  setProgressionAlgorithm as rpSetProgression,
  analyzeVolumeStatus,
  calculateRecoveryVolume,
  validateVolumeInput,
  getVolumeProgression,
  analyzeDeloadNeed,
  autoSetIncrement,
  processWeeklyVolumeProgression,
};

export function weeklyVolume(weekArray) {
  return weekArray.reduce((sum, day) => sum + (day.sets ?? 0), 0);
}
