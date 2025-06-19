import trainingState, { saveState } from "../core/trainingState.js";
import { autoProgressWeeklyVolume } from "../algorithms/effort.js";

export function beginnerPreset() {
  console.log("Beginner preset selected");
  window.trainingState = window.trainingState || {};
  window.trainingState.currentPreset = "beginner";
  window.dispatchEvent(new CustomEvent("beginner-preset-selected"));
}
window.btnBeginnerPreset = beginnerPreset;

// expose globally for legacy code
window.beginnerPreset = beginnerPreset;
window.btnBeginnerPreset = beginnerPreset; // for inventory script

export function intermediatePreset() {
  console.log("Intermediate preset selected");
  window.trainingState = window.trainingState || {};
  window.trainingState.currentPreset = "intermediate";
  window.dispatchEvent(new CustomEvent("intermediate-preset-selected"));
}

// expose globally for legacy code
window.intermediatePreset = intermediatePreset;
window.btnIntermediatePreset = intermediatePreset; // for inventory script

export function advancedPreset() {
  console.log("Advanced preset selected");
  window.trainingState = window.trainingState || {};
  window.trainingState.currentPreset = "advanced";
  window.dispatchEvent(new CustomEvent("advanced-preset-selected"));
}

// expose globally for legacy code
window.advancedPreset = advancedPreset;
window.btnAdvancedPreset = advancedPreset; // for inventory script

export function customConfiguration() {
  console.log("Custom configuration selected");
  window.trainingState = window.trainingState || {};
  window.trainingState.currentPreset = "custom";
  window.dispatchEvent(new CustomEvent("custom-configuration-selected"));
}

// expose globally for legacy code
window.customConfiguration = customConfiguration;
window.btnCustomConfiguration = customConfiguration; // for inventory script

export function saveVolumeLandmarks() {
  console.log("Volume landmarks saved");
  // Read input fields & persist to trainingState or DB
  window.dispatchEvent(new CustomEvent("volume-landmarks-saved"));
}
window.btnSaveVolumeLandmarks = saveVolumeLandmarks; // expose for audit

// Phase-2 Mesocycle Planning handlers
export function setupMesocycle() {
  console.log("Mesocycle setup wizard launched");
  window.trainingState = window.trainingState || {};
  window.trainingState.currentPhase = "mesocycle";
  window.dispatchEvent(new CustomEvent("mesocycle-setup"));
  saveState?.();        // if saveState exists
}
window.btnSetupMesocycle = setupMesocycle;   // expose for audit

export function showRIRSchedule() {
  console.log("Show RIR schedule");
  window.trainingState = window.trainingState || {};
  window.trainingState.rirScheduleViewed = true;
  saveState();
  window.dispatchEvent(new CustomEvent("rir-schedule-shown"));
}
window.btnShowRIRSchedule = showRIRSchedule;

export function generateWeeklyProgram() {
  console.log("Generate weekly program");
  window.trainingState = window.trainingState || {};
  window.trainingState.weeklyProgramGenerated = true;
  window.trainingState.lastProgramGeneration = new Date().toISOString();
  saveState();
  window.dispatchEvent(new CustomEvent("weekly-program-generated"));
}
window.btnGenerateWeeklyProgram = generateWeeklyProgram;

export function smartExerciseSelection() {
  console.log("Smart exercise selection");
  window.trainingState = window.trainingState || {};
  window.trainingState.exerciseSelectionUsed = true;
  saveState();
  window.dispatchEvent(new CustomEvent("smart-exercise-selection"));
}
window.btnSmartExerciseSelection = smartExerciseSelection;

export function riskAssessment() {
  console.log("Risk assessment");
  window.trainingState = window.trainingState || {};
  window.trainingState.riskAssessed = true;
  window.trainingState.lastRiskAssessment = new Date().toISOString();
  saveState();
  window.dispatchEvent(new CustomEvent("risk-assessment"));
}
window.btnRiskAssessment = riskAssessment;

// Phase-3 Weekly Management handlers
export function runWeeklyAutoProgression() {
  console.log("Running weekly auto progression");
  
  window.trainingState = window.trainingState || {};
  
  // Get current volume data and landmarks
  const currentVolume = window.trainingState.weeklyVolume || {};
  const landmarks = window.trainingState.volumeLandmarks || {};
  const targetRIR = window.trainingState.targetRIR || 2;
  
  // Run auto-progression algorithm
  const progressionResult = autoProgressWeeklyVolume(currentVolume, landmarks, targetRIR);
  
  // Update training state with new volumes
  window.trainingState.weeklyVolume = {};
  Object.keys(progressionResult.progressions).forEach(muscle => {
    window.trainingState.weeklyVolume[muscle] = progressionResult.progressions[muscle].newVolume;
  });
  
  // Store progression history
  window.trainingState.progressionHistory = window.trainingState.progressionHistory || [];
  window.trainingState.progressionHistory.push({
    timestamp: new Date().toISOString(),
    week: window.trainingState.weekNo || 1,
    progressionResult
  });
  
  // Update last progression timestamp
  window.trainingState.lastAutoProgression = new Date().toISOString();
  
  // Save state
  saveState();
  
  // Dispatch event with progression details
  window.dispatchEvent(new CustomEvent("weekly-auto-progression", {
    detail: { progressionResult }
  }));
  
  console.log("Weekly auto progression completed:", progressionResult);
}
window.btnRunWeeklyAutoProgression = runWeeklyAutoProgression;

window["btnBeginnerPreset"] = beginnerPreset;
window["btnIntermediatePreset"] = intermediatePreset;
window["btnAdvancedPreset"] = advancedPreset;
window["btnCustomConfiguration"] = customConfiguration;
window["btnSaveVolumeLandmarks"] = saveVolumeLandmarks;
window["btnSetupMesocycle"] = setupMesocycle;
window["btnShowRIRSchedule"] = showRIRSchedule;
window["btnGenerateWeeklyProgram"] = generateWeeklyProgram;
window["btnSmartExerciseSelection"] = smartExerciseSelection;
window["btnRiskAssessment"] = riskAssessment;
window["btnRunWeeklyAutoProgression"] = runWeeklyAutoProgression;
window["btnRunWeeklyAutoProgression"] = runWeeklyAutoProgression;
