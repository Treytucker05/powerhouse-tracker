/**
 * Renaissance Periodization Fatigue Management
 * Handles recovery monitoring, frequency optimization, and fatigue accumulation
 */

import trainingState from "../core/trainingState.js";

/**
 * Analyze recovery status and frequency optimization
 * @param {number} sorenessRecoveryDays - Days until soreness is gone
 * @param {number} currentSessionGap - Days between sessions for this muscle
 * @param {string} muscle - Muscle group name
 * @returns {Object} - Frequency analysis
 */
function analyzeFrequency(
  sorenessRecoveryDays,
  currentSessionGap,
  muscle = null,
) {
  const recoveryTime = Math.max(0, sorenessRecoveryDays);
  const sessionGap = Math.max(1, currentSessionGap);

  let recommendation = "";
  let action = "";
  let urgency = "normal";
  let frequencyAdjustment = 0;

  // Recovery vs session gap analysis
  const recoveryRatio = recoveryTime / sessionGap;

  if (recoveryRatio < 0.7) {
    // Recovering much faster than session frequency
    recommendation = "You heal early → Add one session per week";
    action = "increase_frequency";
    frequencyAdjustment = 1;
    urgency = "medium";
  } else if (recoveryRatio > 1.3) {
    // Still sore when next session is due
    recommendation = "Recovery lags → Insert an extra rest day";
    action = "decrease_frequency";
    frequencyAdjustment = -1;
    urgency = "high";
  } else {
    // Optimal recovery timing
    recommendation = "Frequency is optimal";
    action = "maintain";
    frequencyAdjustment = 0;
    urgency = "normal";
  }

  // Consider current volume when making frequency recommendations
  if (muscle) {
    const volumeStatus = trainingState.getVolumeStatus(muscle);

    if (volumeStatus === "maximum" && action === "increase_frequency") {
      recommendation = "At MRV - maintain frequency despite early recovery";
      action = "maintain";
      frequencyAdjustment = 0;
    }

    if (volumeStatus === "under-minimum" && action === "decrease_frequency") {
      recommendation =
        "Below MV - consider recovery methods instead of reducing frequency";
      action = "improve_recovery";
      frequencyAdjustment = 0;
    }
  }

  return {
    sorenessRecoveryDays: recoveryTime,
    currentSessionGap: sessionGap,
    recoveryRatio: Math.round(recoveryRatio * 100) / 100,
    recommendation,
    action,
    frequencyAdjustment,
    urgency,
    muscle,
  };
}

/**
 * Assess overall fatigue accumulation
 * @param {Object} weeklyData - Weekly fatigue metrics
 * @returns {Object} - Fatigue assessment
 */
function assessFatigueAccumulation(weeklyData) {
  const {
    averageSoreness = 1,
    sleepQuality = 7, // 1-10 scale
    stressLevel = 5, // 1-10 scale
    musclesNeedingRecovery = 0,
    consecutiveMRVWeeks = 0,
    performanceDecline = false,
  } = weeklyData;

  // Calculate fatigue score (0-100)
  let fatigueScore = 0;

  // Soreness contribution (0-30 points)
  fatigueScore += Math.min(30, (averageSoreness / 3) * 30);

  // Sleep quality contribution (0-20 points, inverted)
  fatigueScore += Math.max(0, 20 - (sleepQuality / 10) * 20);

  // Stress level contribution (0-20 points)
  fatigueScore += (stressLevel / 10) * 20;

  // Volume overreaching contribution (0-20 points)
  const volumeOverreach = Math.min(20, (musclesNeedingRecovery / 12) * 20);
  fatigueScore += volumeOverreach;

  // Consecutive MRV weeks (0-10 points)
  fatigueScore += Math.min(10, consecutiveMRVWeeks * 5);

  // Performance decline bonus
  if (performanceDecline) {
    fatigueScore += 10;
  }

  // Determine fatigue level
  let fatigueLevel = "";
  let recommendations = [];
  let deloadUrgency = "none";

  if (fatigueScore <= 25) {
    fatigueLevel = "low";
    recommendations.push("Continue current program");
    recommendations.push("Consider volume progression opportunities");
  } else if (fatigueScore <= 50) {
    fatigueLevel = "moderate";
    recommendations.push("Monitor recovery closely");
    recommendations.push("Ensure adequate sleep and nutrition");
    deloadUrgency = "low";
  } else if (fatigueScore <= 75) {
    fatigueLevel = "high";
    recommendations.push("Reduce training stress");
    recommendations.push("Consider recovery week");
    recommendations.push("Prioritize sleep and stress management");
    deloadUrgency = "medium";
  } else {
    fatigueLevel = "excessive";
    recommendations.push("Implement deload immediately");
    recommendations.push("Address sleep and lifestyle factors");
    recommendations.push("Consider extending deload period");
    deloadUrgency = "high";
  }

  return {
    fatigueScore: Math.round(fatigueScore),
    fatigueLevel,
    recommendations,
    deloadUrgency,
    breakdown: {
      soreness: Math.min(30, (averageSoreness / 3) * 30),
      sleep: Math.max(0, 20 - (sleepQuality / 10) * 20),
      stress: (stressLevel / 10) * 20,
      volume: volumeOverreach,
      consecutive: Math.min(10, consecutiveMRVWeeks * 5),
      performance: performanceDecline ? 10 : 0,
    },
  };
}

/**
 * Generate recovery session recommendations
 * @param {string} muscle - Muscle group
 * @param {Object} options - Recovery options
 * @returns {Object} - Recovery session plan
 */
function generateRecoverySession(muscle, options = {}) {
  const {
    hasIllness = false,
    sorenessLevel = 2,
    lastSessionRIR = 0,
    preferredRecoveryType = "volume",
  } = options;

  const landmarks = trainingState.volumeLandmarks[muscle];
  const baseRecoveryVolume = trainingState.getRecoveryVolume(
    muscle,
    hasIllness,
  );

  let recoveryPlan = {
    muscle,
    type: preferredRecoveryType,
    sets: baseRecoveryVolume,
    intensity: "60-70% of normal",
    rirTarget: "3-4 RIR",
    duration: "1 session",
    notes: [],
  };

  // Adjust based on soreness level
  if (sorenessLevel >= 3) {
    recoveryPlan.sets = Math.round(baseRecoveryVolume * 0.7);
    recoveryPlan.intensity = "50-60% of normal";
    recoveryPlan.rirTarget = "4-5 RIR";
    recoveryPlan.notes.push("High soreness - very light session");
  }

  // Adjust for illness
  if (hasIllness) {
    recoveryPlan.sets = Math.round(recoveryPlan.sets * 0.8);
    recoveryPlan.intensity = "40-50% of normal";
    recoveryPlan.notes.push("Illness present - prioritize rest");
  }

  // Adjust based on last session intensity
  if (lastSessionRIR <= 0.5) {
    recoveryPlan.sets = Math.round(recoveryPlan.sets * 0.8);
    recoveryPlan.notes.push("Last session was very intense");
  }

  // Recovery type specific adjustments
  if (preferredRecoveryType === "deload") {
    recoveryPlan.sets = Math.round(landmarks.MEV * 0.5);
    recoveryPlan.intensity = "40-50% of normal";
    recoveryPlan.duration = "3-7 days";
    recoveryPlan.notes.push("Full deload protocol");
  }

  return recoveryPlan;
}

/**
 * Monitor overreaching vs overtraining risk
 * @param {Object} metrics - Training metrics over time
 * @returns {Object} - Risk assessment
 */
function assessOverreachingRisk(metrics) {
  const {
    weeklyPerformanceTrend = [], // Array of performance scores
    weeklyFatigueTrend = [], // Array of fatigue scores
    volumeProgression = [], // Array of weekly volumes
    motivationLevel = 5, // 1-10
    injuryRisk = 1, // 1-10
  } = metrics;

  let riskScore = 0;
  let riskFactors = [];

  // Performance trend analysis
  if (weeklyPerformanceTrend.length >= 2) {
    const recentTrend = weeklyPerformanceTrend.slice(-3);
    const isDecreasing = recentTrend.every(
      (val, i) => i === 0 || val <= recentTrend[i - 1],
    );

    if (isDecreasing) {
      riskScore += 20;
      riskFactors.push("Consistent performance decline");
    }
  }

  // Fatigue accumulation
  if (weeklyFatigueTrend.length >= 2) {
    const avgFatigue =
      weeklyFatigueTrend.reduce((a, b) => a + b, 0) / weeklyFatigueTrend.length;
    if (avgFatigue > 60) {
      riskScore += 25;
      riskFactors.push("High average fatigue");
    }
  }

  // Volume progression rate
  if (volumeProgression.length >= 3) {
    const volumeIncrease =
      volumeProgression[volumeProgression.length - 1] - volumeProgression[0];
    const weekSpan = volumeProgression.length;
    const weeklyIncrease = volumeIncrease / weekSpan;

    if (weeklyIncrease > 2) {
      riskScore += 15;
      riskFactors.push("Rapid volume progression");
    }
  }

  // Motivation and wellbeing
  if (motivationLevel <= 3) {
    riskScore += 15;
    riskFactors.push("Low motivation/enjoyment");
  }

  // Injury risk
  if (injuryRisk >= 7) {
    riskScore += 15;
    riskFactors.push("High injury risk indicators");
  }

  // Current training state
  if (trainingState.consecutiveMRVWeeks >= 2) {
    riskScore += 10;
    riskFactors.push("Consecutive weeks at MRV");
  }

  // Determine risk level
  let riskLevel = "";
  let recommendations = [];

  if (riskScore <= 20) {
    riskLevel = "low";
    recommendations.push("Continue progressive overload");
    recommendations.push("Monitor for early warning signs");
  } else if (riskScore <= 40) {
    riskLevel = "moderate";
    recommendations.push("Slow progression rate");
    recommendations.push("Increase recovery focus");
    recommendations.push("Consider planned deload");
  } else if (riskScore <= 70) {
    riskLevel = "high";
    recommendations.push("Implement deload week");
    recommendations.push("Address lifestyle stressors");
    recommendations.push("Reduce training frequency");
  } else {
    riskLevel = "critical";
    recommendations.push("Stop training temporarily");
    recommendations.push("Focus on full recovery");
    recommendations.push("Consult with coach/healthcare provider");
  }

  return {
    riskScore,
    riskLevel,
    riskFactors,
    recommendations,
    requiresImmediateAction: riskScore > 60,
  };
}

/**
 * Calculate optimal session frequency for a muscle
 * @param {string} muscle - Muscle group
 * @param {Object} constraints - Training constraints
 * @returns {Object} - Frequency recommendation
 */
function calculateOptimalFrequency(muscle, constraints = {}) {
  const {
    availableDays = 6,
    currentVolume = null,
    recoveryCapacity = "normal", // low, normal, high
    trainingAge = "intermediate", // beginner, intermediate, advanced
  } = constraints;

  const volume = currentVolume || trainingState.currentWeekSets[muscle];
  const landmarks = trainingState.volumeLandmarks[muscle];
  if (!landmarks || landmarks.MAV === undefined) {
    throw new Error(`Missing volume landmarks for muscle: ${muscle}`);
  }

  // Base frequency recommendations by training age
  const baseFrequencies = {
    beginner: { min: 2, max: 3 },
    intermediate: { min: 2, max: 4 },
    advanced: { min: 3, max: 5 },
  };

  const ageRecommendation = baseFrequencies[trainingAge];

  // Adjust for volume
  let volumeFrequency = 2;
  if (volume >= landmarks.MAV) {
    volumeFrequency = Math.min(4, Math.ceil(volume / 6)); // ~6 sets per session max at high volumes
  } else if (volume >= landmarks.MEV) {
    volumeFrequency = Math.min(3, Math.ceil(volume / 8)); // ~8 sets per session
  } else {
    volumeFrequency = Math.max(2, Math.ceil(volume / 10)); // ~10 sets per session at lower volumes
  }

  // Adjust for recovery capacity
  const recoveryMultipliers = {
    low: 0.8,
    normal: 1.0,
    high: 1.2,
  };

  const adjustedFrequency = Math.round(
    volumeFrequency * recoveryMultipliers[recoveryCapacity],
  );

  // Constrain to available days and training age limits
  const recommendedFrequency = Math.max(
    ageRecommendation.min,
    Math.min(ageRecommendation.max, adjustedFrequency, availableDays),
  );

  // Calculate sets per session
  const setsPerSession = Math.ceil(volume / recommendedFrequency);

  return {
    muscle,
    recommendedFrequency,
    setsPerSession,
    totalVolume: volume,
    reasoning: [
      `${volume} weekly sets`,
      `${recoveryCapacity} recovery capacity`,
      `${trainingAge} training age`,
      `${availableDays} available days`,
    ],
    alternatives: {
      conservative: Math.max(2, recommendedFrequency - 1),
      aggressive: Math.min(availableDays, recommendedFrequency + 1),
    },
  };
}

/**
 * Enhanced fatigue detection using SFR and rep strength drop
 * @param {string} muscle - Muscle group
 * @param {Object} feedback - Feedback data with soreness, jointAche, perfChange, stimulus, lastLoad
 * @param {Object} state - Training state singleton
 * @returns {boolean} - True if high fatigue detected
 */
function isHighFatigue(muscle, feedback, state) {
  // Calculate total fatigue score
  const soreness = feedback.soreness || 0;
  const jointAche = feedback.jointAche || 0;
  const perfChange = feedback.perfChange || 0;

  // Fatigue components: soreness + joint ache + performance decline penalty
  const fatigue = soreness + jointAche + (perfChange < 0 ? 2 : 0);
  // Stimulus components: pump + workload (mind-muscle connection less relevant for fatigue)
  const stimulus = (feedback.pump || 0) + (feedback.disruption || 0);

  // Calculate Stimulus-to-Fatigue Ratio (SFR)
  const SFR = stimulus / (fatigue || 1); // Avoid zero division

  // Check for rep strength drop
  const strengthDrop = feedback.lastLoad
    ? state.repStrengthDrop(muscle, feedback.lastLoad)
    : false;

  // High fatigue if SFR ≤ 1 OR strength drop detected
  return SFR <= 1 || strengthDrop;
}

export { analyzeFrequency, calculateOptimalFrequency, isHighFatigue };
