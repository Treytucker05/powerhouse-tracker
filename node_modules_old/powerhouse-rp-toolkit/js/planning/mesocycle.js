/**
 * Renaissance Periodization Mesocycle Planning
 * Handles mesocycle templates, maintenance phases, and resensitization
 */

import trainingState from "../core/trainingState.js";
import { debugLog } from "../utils/debug.js";

/**
 * Check if maintenance phase is recommended
 * @param {Object} state - Training state instance
 * @returns {Object} - Maintenance recommendation
 */
export function shouldEnterMaintenancePhase(state) {
  // Check training history
  const consecutiveHypertrophyMesos = getConsecutiveHypertrophyMesos(state);
  const totalTrainingWeeks = (state.blockNo - 1) * state.mesoLen + state.weekNo;

  // RP guideline: Consider maintenance after 3+ consecutive hypertrophy mesos
  const hypertrophyFatigue = consecutiveHypertrophyMesos >= 3;

  // Advanced trainees may need more frequent maintenance
  const advancedTrainee = state.blockNo > 20;
  const advancedRecommendation =
    advancedTrainee && consecutiveHypertrophyMesos >= 2;

  // Check for volume accumulation stress
  const highVolumeStress = assessVolumeStress(state) > 0.7;

  const recommended =
    hypertrophyFatigue || advancedRecommendation || highVolumeStress;

  return {
    recommended,
    consecutiveMesos: consecutiveHypertrophyMesos,
    reason: getMaintenanceReason(
      hypertrophyFatigue,
      advancedRecommendation,
      highVolumeStress,
    ),
    suggestedDuration: getSuggestedMaintenanceDuration(state),
    benefits: getMaintenanceBenefits(),
  };
}

/**
 * Get number of consecutive hypertrophy mesocycles
 */
function getConsecutiveHypertrophyMesos(state) {
  // This is a simplified version - in a real app you'd track mesocycle types
  // For now, assume all mesos are hypertrophy unless in maintenance/deload
  if (state.resensitizationPhase) return 0;

  // Estimate based on block progression
  const mesosPerBlock = 1; // Simplified assumption
  return Math.min(state.blockNo, 4); // Cap at 4 for safety
}

/**
 * Assess volume accumulation stress
 */
function assessVolumeStress(state) {
  const muscles = Object.keys(state.volumeLandmarks);
  let totalStress = 0;

  muscles.forEach((muscle) => {
    const current = state.getWeeklySets(muscle);
    const mev = state.volumeLandmarks[muscle].MEV;
    const mrv = state.volumeLandmarks[muscle].MRV;

    // Calculate how close to MRV we are
    const stressLevel = Math.max(0, (current - mev) / (mrv - mev));
    totalStress += stressLevel;
  });

  return totalStress / muscles.length;
}

/**
 * Get maintenance recommendation reason
 */
function getMaintenanceReason(
  hypertrophyFatigue,
  advancedRecommendation,
  highVolumeStress,
) {
  if (hypertrophyFatigue) {
    return "3+ consecutive hypertrophy mesocycles completed - resensitization recommended";
  } else if (advancedRecommendation) {
    return "Advanced trainee status - frequent maintenance helps prevent overreaching";
  } else if (highVolumeStress) {
    return "High volume accumulation detected - maintenance will aid recovery";
  }
  return "Continue current programming";
}

/**
 * Get suggested maintenance duration
 */
function getSuggestedMaintenanceDuration(state) {
  const advancedTrainee = state.blockNo > 20;
  const baseWeeks = 2;

  // Advanced trainees may benefit from longer maintenance
  if (advancedTrainee) return 3;

  return baseWeeks;
}

/**
 * Get maintenance phase benefits
 */
function getMaintenanceBenefits() {
  return [
    "Tissue resensitization to growth stimulus",
    "Systemic fatigue recovery",
    "Joint and connective tissue restoration",
    "Improved training motivation",
    "Better response to subsequent hypertrophy phases",
  ];
}

/**
 * Set maintenance volume for all muscle groups
 * @param {Object} state - Training state instance
 */
export function setMaintenanceVolume(state) {
  debugLog("Entering maintenance phase - setting volumes to ~50% MEV");

  Object.keys(state.volumeLandmarks).forEach((muscle) => {
    const mev = state.volumeLandmarks[muscle].MEV;
    const mv = state.volumeLandmarks[muscle].MV;

    // Set to maintenance volume (typically between MV and 50% MEV)
    const maintenanceVolume = Math.max(mv, Math.round(mev * 0.5));
    state.currentWeekSets[muscle] = maintenanceVolume;
  });

  // Set maintenance flags
  state.resensitizationPhase = true;
  state.deloadPhase = false;
  state.maintenanceDuration = getSuggestedMaintenanceDuration(state);
  state.maintenanceWeek = 1;

  debugLog(`Maintenance phase set for ${state.maintenanceDuration} weeks`);
  state.saveState();
}

/**
 * Check if maintenance phase should end
 * @param {Object} state - Training state instance
 * @returns {boolean} - Whether to exit maintenance
 */
export function shouldExitMaintenance(state) {
  if (!state.resensitizationPhase) return false;

  const weeksInMaintenance = state.maintenanceWeek || 1;
  const plannedDuration = state.maintenanceDuration || 2;

  return weeksInMaintenance >= plannedDuration;
}

/**
 * Exit maintenance phase and prepare for hypertrophy
 * @param {Object} state - Training state instance
 */
export function exitMaintenancePhase(state) {
  debugLog("Exiting maintenance phase - preparing for hypertrophy mesocycle");

  // Reset phase flags
  state.resensitizationPhase = false;
  state.maintenanceWeek = 0;
  state.maintenanceDuration = 0;

  // Set all muscles to MEV for fresh hypertrophy start
  Object.keys(state.volumeLandmarks).forEach((muscle) => {
    state.currentWeekSets[muscle] = state.volumeLandmarks[muscle].MEV;
  });

  // Reset week and start new mesocycle
  state.weekNo = 1;
  state.blockNo++;

  debugLog("Fresh hypertrophy mesocycle started after maintenance");
  state.saveState();
}

/**
 * Progress maintenance phase week
 * @param {Object} state - Training state instance
 */
export function progressMaintenanceWeek(state) {
  if (!state.resensitizationPhase) return;

  state.maintenanceWeek = (state.maintenanceWeek || 1) + 1;

  // Check if maintenance should end
  if (shouldExitMaintenance(state)) {
    exitMaintenancePhase(state);
  } else {
    // Continue maintenance - volumes stay the same
    debugLog(
      `Maintenance week ${state.maintenanceWeek} of ${state.maintenanceDuration}`,
    );
    state.saveState();
  }
}

/**
 * Create mesocycle template based on phase type
 * @param {string} type - 'hypertrophy', 'strength', 'maintenance'
 * @param {Object} state - Training state instance
 * @returns {Object} - Mesocycle configuration
 */
export function createMesocycleTemplate(type, state) {
  const templates = {
    hypertrophy: {
      name: "Hypertrophy Mesocycle",
      duration: state.getAdaptiveMesoLength ? state.getAdaptiveMesoLength() : 4,
      targetRIRProgression: [4, 3, 2, 1], // Week 1-4 target RIR
      volumeProgression: "MEV to MRV",
      loadProgression: "Moderate",
      volumeMultiplier: 1.0,
      description: "Volume-focused mesocycle for muscle growth",
    },

    strength: {
      name: "Strength Mesocycle",
      duration: 3,
      targetRIRProgression: [3, 2, 1],
      volumeProgression: "MEV to MAV",
      loadProgression: "Aggressive",
      volumeMultiplier: 0.7,
      description: "Intensity-focused mesocycle for strength gains",
    },

    maintenance: {
      name: "Maintenance/Resensitization",
      duration: getSuggestedMaintenanceDuration(state),
      targetRIRProgression: [3, 3, 3], // Steady moderate effort
      volumeProgression: "MV to 0.5*MEV",
      loadProgression: "Minimal",
      volumeMultiplier: 0.5,
      description: "Recovery and resensitization phase",
    },
  };

  return templates[type] || templates.hypertrophy;
}

/**
 * Get current mesocycle status and recommendations
 * @param {Object} state - Training state instance
 * @returns {Object} - Current status and recommendations
 */
export function getMesocycleStatus(state) {
  const maintenanceCheck = shouldEnterMaintenancePhase(state);
  const currentTemplate = getCurrentMesocycleType(state);

  return {
    currentType: currentTemplate,
    week: state.weekNo,
    totalWeeks: state.getAdaptiveMesoLength
      ? state.getAdaptiveMesoLength()
      : state.mesoLen,
    maintenance: maintenanceCheck,
    recommendations: generateMesocycleRecommendations(state, maintenanceCheck),
  };
}

/**
 * Get current mesocycle type
 */
function getCurrentMesocycleType(state) {
  if (state.resensitizationPhase) return "maintenance";
  if (state.deloadPhase) return "deload";
  return "hypertrophy"; // Default assumption
}

/**
 * Generate mesocycle recommendations
 */
function generateMesocycleRecommendations(state, maintenanceCheck) {
  const recommendations = [];

  if (maintenanceCheck.recommended) {
    recommendations.push({
      type: "maintenance",
      priority: "high",
      message: maintenanceCheck.reason,
      action: "Enter maintenance phase",
    });
  }

  if (state.shouldDeload()) {
    recommendations.push({
      type: "deload",
      priority: "high",
      message: "High fatigue detected",
      action: "Start deload week",
    });
  }

  return recommendations;
}
