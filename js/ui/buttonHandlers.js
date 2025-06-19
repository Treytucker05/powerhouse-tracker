import trainingState from "../core/trainingState.js";

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

window["btnBeginnerPreset"]       = beginnerPreset;
window["btnIntermediatePreset"]   = intermediatePreset;
window["btnAdvancedPreset"]       = advancedPreset;
window["btnCustomConfiguration"]  = customConfiguration;
window["btnSaveVolumeLandmarks"]  = saveVolumeLandmarks; // stub if not written yet

export function setupMesocycle() {
  console.log("Setting up mesocycle");
  trainingState.mesocycleSetup = true;
  trainingState.saveState();
  window.dispatchEvent(new CustomEvent("mesocycle-setup"));
}
window.btnSetupMesocycle = setupMesocycle;
window.setupMesocycle = setupMesocycle;
window["btnSetupMesocycle"] = setupMesocycle;

export function showRIRSchedule() {
  console.log("Showing RIR schedule");
  window.dispatchEvent(new CustomEvent("rir-schedule-shown"));
}
window.btnShowRIRSchedule = showRIRSchedule;
window.showRIRSchedule = showRIRSchedule;
window["btnShowRIRSchedule"] = showRIRSchedule;

export function generateWeeklyProgram() {
  console.log("Generating weekly program");
  trainingState.weeklyProgramGenerated = true;
  trainingState.saveState();
  window.dispatchEvent(new CustomEvent("weekly-program-generated"));
}
window.btnGenerateWeeklyProgram = generateWeeklyProgram;
window.generateWeeklyProgram = generateWeeklyProgram;
window["btnGenerateWeeklyProgram"] = generateWeeklyProgram;

export function smartExerciseSelection() {
  console.log("Running smart exercise selection");
  trainingState.smartSelectionUsed = true;
  trainingState.saveState();
  window.dispatchEvent(new CustomEvent("smart-exercise-selection"));
}
window.btnSmartExerciseSelection = smartExerciseSelection;
window.smartExerciseSelection = smartExerciseSelection;
window["btnSmartExerciseSelection"] = smartExerciseSelection;

export function riskAssessment() {
  console.log("Running risk assessment");
  trainingState.lastRiskAssessment = Date.now();
  trainingState.saveState();
  window.dispatchEvent(new CustomEvent("risk-assessed"));
}
window.btnRiskAssessment = riskAssessment;
window.riskAssessment = riskAssessment;
window["btnRiskAssessment"] = riskAssessment;

export function runWeeklyAutoProgression() {
  console.log("Running weekly auto progression");
  trainingState.autoProgressionRun = (trainingState.autoProgressionRun || 0) + 1;
  trainingState.saveState();
  window.dispatchEvent(new CustomEvent("weekly-auto-progression"));
}
window.btnRunWeeklyAutoProgression = runWeeklyAutoProgression;
window.runWeeklyAutoProgression = runWeeklyAutoProgression;
window["btnRunWeeklyAutoProgression"] = runWeeklyAutoProgression;

export function nextWeek() {
  console.log("Advancing to next week");
  trainingState.weekNo = (trainingState.weekNo || 0) + 1;
  trainingState.saveState();
  window.dispatchEvent(new CustomEvent("next-week"));
}
window.btnNextWeek = nextWeek;
window.nextWeek = nextWeek;
window["btnNextWeek"] = nextWeek;

export function processWeeklyAdjustments() {
  console.log("Processing weekly adjustments");
  trainingState.adjustmentsProcessed = true;
  trainingState.saveState();
  window.dispatchEvent(new CustomEvent("weekly-adjustments"));
}
window.btnProcessWeeklyAdjustments = processWeeklyAdjustments;
window.processWeeklyAdjustments = processWeeklyAdjustments;
window["btnProcessWeeklyAdjustments"] = processWeeklyAdjustments;

export function weeklyIntelligenceReport() {
  console.log("Generating weekly intelligence report");
  trainingState.lastWeeklyReport = new Date().toISOString();
  trainingState.saveState();
  window.dispatchEvent(new CustomEvent("weekly-report"));
}
window.btnWeeklyIntelligenceReport = weeklyIntelligenceReport;
window.weeklyIntelligenceReport = weeklyIntelligenceReport;
window["btnWeeklyIntelligenceReport"] = weeklyIntelligenceReport;

export function predictDeloadTiming() {
  console.log("Predicting deload timing");
  trainingState.deloadPredictionRequested = true;
  trainingState.saveState();
  window.dispatchEvent(new CustomEvent("deload-prediction"));
}
window.btnPredictDeloadTiming = predictDeloadTiming;
window.predictDeloadTiming = predictDeloadTiming;
window["btnPredictDeloadTiming"] = predictDeloadTiming;
