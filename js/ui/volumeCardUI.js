/**
 * Volume Card UI Handler
 * Manages volume range setup and landmark editing
 */

import trainingState from "../core/trainingState.js";
import { updateChart } from "./chartManager.js";
import {
  validateVolumeInput,
  analyzeVolumeStatus,
} from "../calculators/unified.js";

/**
 * Initialize volume card interactions
 */
export function initVolumeCard() {
  const muscleSelect = document.getElementById("muscleSelect");
  const currentSetsInput = document.getElementById("currentSets");
  const mevInput = document.getElementById("mev");
  const mrvInput = document.getElementById("mrv");
  const mavInput = document.getElementById("mav");
  const mvInput = document.getElementById("mv");

  if (!muscleSelect || !currentSetsInput) return;

  // Update displays when muscle changes
  muscleSelect.addEventListener("change", updateVolumeDisplays);

  // Inline editing for current sets
  currentSetsInput.addEventListener("focus", enableInlineEdit);
  currentSetsInput.addEventListener("blur", saveInlineEdit);
  currentSetsInput.addEventListener("keypress", handleInlineEditKeypress);

  // Landmark editing
  if (mevInput) mevInput.addEventListener("change", updateLandmark);
  if (mrvInput) mrvInput.addEventListener("change", updateLandmark);
  if (mavInput) mavInput.addEventListener("change", updateLandmark);
  if (mvInput) mvInput.addEventListener("change", updateLandmark);

  // Initialize displays
  updateVolumeDisplays();
}

/**
 * Update volume displays for selected muscle
 */
function updateVolumeDisplays() {
  const muscleSelect = document.getElementById("muscleSelect");
  const muscle = muscleSelect?.value;

  if (!muscle) return;

  updateCurrentSetsDisplay(muscle);
  updateLandmarkDisplays(muscle);
  updateVolumeStatus(muscle);
}

/**
 * Update current sets display
 */
function updateCurrentSetsDisplay(muscle) {
  const currentSetsInput = document.getElementById("currentSets");
  if (currentSetsInput) {
    currentSetsInput.value = trainingState.currentWeekSets[muscle] || 0;
  }
}

/**
 * Update landmark input displays
 */
function updateLandmarkDisplays(muscle) {
  const landmarks = trainingState.volumeLandmarks[muscle];
  if (!landmarks) return;

  const mevInput = document.getElementById("mev");
  const mrvInput = document.getElementById("mrv");
  const mavInput = document.getElementById("mav");
  const mvInput = document.getElementById("mv");

  if (mevInput) mevInput.value = landmarks.MEV;
  if (mrvInput) mrvInput.value = landmarks.MRV;
  if (mavInput && landmarks.MAV) mavInput.value = landmarks.MAV;
  if (mvInput && landmarks.MV) mvInput.value = landmarks.MV;
}

/**
 * Update volume status display
 */
function updateVolumeStatus(muscle) {
  const statusElement = document.getElementById("volumeStatus");
  if (!statusElement) return;

  const analysis = analyzeVolumeStatus(muscle);

  statusElement.innerHTML = `
    <div class="volume-analysis">
      <div class="status-indicator ${analysis.status}">
        ${analysis.status.toUpperCase()}
      </div>
      <div class="volume-details">
        <p>${analysis.recommendation}</p>
        <div class="landmarks-display">
          <span>MV: ${analysis.landmarks.MV}</span>
          <span>MEV: ${analysis.landmarks.MEV}</span>
          <span>MAV: ${analysis.landmarks.MAV}</span>
          <span>MRV: ${analysis.landmarks.MRV}</span>
        </div>
      </div>
    </div>
  `;

  statusElement.className = `volume-status ${analysis.urgency}`;
}

/**
 * Enable inline editing for current sets
 */
function enableInlineEdit(event) {
  const input = event.target;
  input.select();
  input.dataset.originalValue = input.value;
}

/**
 * Save inline edit changes
 */
function saveInlineEdit(event) {
  const input = event.target;
  const muscleSelect = document.getElementById("muscleSelect");
  const muscle = muscleSelect?.value;

  if (!muscle) return;

  const newValue = parseInt(input.value, 10);
  const originalValue = parseInt(input.dataset.originalValue, 10);

  if (isNaN(newValue) || newValue === originalValue) {
    input.value = originalValue;
    return;
  }

  // Validate input
  const validation = validateVolumeInput(muscle, newValue);

  if (!validation.isValid) {
    showValidationError(validation.warning);
    input.value = originalValue;
    return;
  }

  // Show warning but allow input
  if (validation.warning) {
    showValidationWarning(validation.warning);
  }

  // Update training state
  trainingState.updateWeeklySets(muscle, newValue);
  updateChart();
  updateVolumeStatus(muscle);

  showSaveConfirmation();
}

/**
 * Handle keypress in inline edit
 */
function handleInlineEditKeypress(event) {
  if (event.key === "Enter") {
    event.target.blur();
  } else if (event.key === "Escape") {
    const input = event.target;
    input.value = input.dataset.originalValue;
    input.blur();
  }
}

/**
 * Update volume landmark
 */
function updateLandmark(event) {
  const input = event.target;
  const landmarkType = input.id.toUpperCase(); // mev -> MEV
  const muscleSelect = document.getElementById("muscleSelect");
  const muscle = muscleSelect?.value;

  if (!muscle) return;

  const newValue = parseInt(input.value, 10);

  if (isNaN(newValue) || newValue < 0) {
    input.value = trainingState.volumeLandmarks[muscle][landmarkType];
    return;
  }

  // Validate landmark relationships
  const landmarks = { ...trainingState.volumeLandmarks[muscle] };
  landmarks[landmarkType] = newValue;

  if (!validateLandmarkRelationships(landmarks)) {
    showValidationError("Invalid landmark relationship (MV ≤ MEV ≤ MAV ≤ MRV)");
    input.value = trainingState.volumeLandmarks[muscle][landmarkType];
    return;
  }

  // Update training state
  trainingState.updateVolumeLandmarks(muscle, { [landmarkType]: newValue });
  updateChart();
  updateVolumeStatus(muscle);

  showSaveConfirmation();
}

/**
 * Validate landmark relationships
 */
function validateLandmarkRelationships(landmarks) {
  const { MV = 0, MEV, MAV, MRV } = landmarks;
  return MV <= MEV && MEV <= MAV && MAV <= MRV;
}

/**
 * Show validation error
 */
function showValidationError(message) {
  showNotification(message, "error");
}

/**
 * Show validation warning
 */
function showValidationWarning(message) {
  showNotification(message, "warning");
}

/**
 * Show save confirmation
 */
function showSaveConfirmation() {
  showNotification("Saved", "success");
}

/**
 * Show notification
 */
function showNotification(message, type = "info") {
  // Create notification element
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.textContent = message;

  // Style notification
  Object.assign(notification.style, {
    position: "fixed",
    top: "20px",
    right: "20px",
    padding: "12px 20px",
    borderRadius: "8px",
    color: "white",
    fontSize: "14px",
    fontWeight: "600",
    zIndex: "10000",
    transition: "all 0.3s ease",
    transform: "translateX(100%)",
    opacity: "0",
  });

  // Type-specific styling
  const colors = {
    success: "#4CAF50",
    error: "#f44336",
    warning: "#ff9800",
    info: "#2196F3",
  };

  notification.style.backgroundColor = colors[type] || colors.info;

  // Add to DOM
  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)";
    notification.style.opacity = "1";
  }, 100);

  // Remove after delay
  setTimeout(() => {
    notification.style.transform = "translateX(100%)";
    notification.style.opacity = "0";
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

/**
 * Create advanced volume editor
 */
export function createAdvancedVolumeEditor() {
  const container = document.getElementById("volumeCard");
  if (!container) return;

  // Add advanced controls HTML
  const advancedHTML = `
    <div class="advanced-volume-controls" style="margin-top: 20px;">
      <h3>Volume Landmarks</h3>
      <div class="landmark-grid">
        <div class="input-group">
          <label for="mv">MV (Maintenance Volume):</label>
          <input type="number" id="mv" min="0" value="0">
        </div>
        <div class="input-group">
          <label for="mav">MAV (Maximum Adaptive Volume):</label>
          <input type="number" id="mav" min="0" value="0">
        </div>
      </div>
      <div id="volumeStatus" class="volume-status"></div>
    </div>
  `;

  // Insert before the existing button
  const button = container.querySelector("button");
  if (button) {
    button.insertAdjacentHTML("beforebegin", advancedHTML);
  }
}

/**
 * Initialize volume presets
 */
export function initVolumePresets() {
  const presetContainer = document.createElement("div");
  presetContainer.className = "volume-presets";
  presetContainer.innerHTML = `
    <h4>Quick Presets</h4>
    <div class="preset-buttons">
      <button type="button" onclick="applyVolumePreset('beginner')">Beginner</button>
      <button type="button" onclick="applyVolumePreset('intermediate')">Intermediate</button>
      <button type="button" onclick="applyVolumePreset('advanced')">Advanced</button>
    </div>
  `;

  const volumeCard = document.getElementById("volumeCard");
  if (volumeCard) {
    volumeCard.appendChild(presetContainer);
  }
}

/**
 * Apply volume preset
 */
window.applyVolumePreset = function (level) {
  const muscleSelect = document.getElementById("muscleSelect");
  const muscle = muscleSelect?.value;

  if (!muscle) return;

  const presets = {
    beginner: { multiplier: 0.8 },
    intermediate: { multiplier: 1.0 },
    advanced: { multiplier: 1.2 },
  };

  const preset = presets[level];
  const baseLandmarks = trainingState.volumeLandmarks[muscle];

  const newLandmarks = {
    MV: Math.round(baseLandmarks.MV * preset.multiplier),
    MEV: Math.round(baseLandmarks.MEV * preset.multiplier),
    MAV: Math.round(baseLandmarks.MAV * preset.multiplier),
    MRV: Math.round(baseLandmarks.MRV * preset.multiplier),
  };

  trainingState.updateVolumeLandmarks(muscle, newLandmarks);
  updateVolumeDisplays();
  updateChart();

  showNotification(`Applied ${level} preset for ${muscle}`, "success");
};

export {
  updateVolumeDisplays,
  updateCurrentSetsDisplay,
  updateLandmarkDisplays,
  updateVolumeStatus,
};
