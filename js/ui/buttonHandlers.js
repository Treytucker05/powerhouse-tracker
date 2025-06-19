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
