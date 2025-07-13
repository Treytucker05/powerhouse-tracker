/**
 * Phase Sections UI Component
 * Builds progressive disclosure interface for RP workflow phases
 */

import { workflowPhases } from "../core/workflowPhases.js";
import trainingState from "../core/trainingState.js";

// Utility to create consistently formatted phase buttons
function createButton(id) {
  // Button label mapping for better UX
  const buttonLabels = {
    // Phase 1: Foundation Setup
    btnBeginnerPreset: "Beginner Preset",
    btnIntermediatePreset: "Intermediate Preset",
    btnAdvancedPreset: "Advanced Preset",
    btnSaveVolumeLandmarks: "Save Volume Landmarks",

    // Phase 2: Mesocycle Planning
    btnSetupMesocycle: "Setup Mesocycle",
    btnShowRIRSchedule: "Show RIR Schedule",
    btnOptimizeFrequency: "Optimize Frequency",
    btnGenerateWeeklyProgram: "Generate Weekly Program",
    btnSmartExerciseSelection: "Smart Exercise Selection",
    btnRiskAssessment: "Risk Assessment",

    // Phase 3: Weekly Management
    btnRunWeeklyAutoProgression: "Run Weekly Auto Progression",
    btnNextWeek: "Next Week",
    btnProcessWeeklyAdjustments: "Process Weekly Adjustments",
    btnWeeklyIntelligenceReport: "Weekly Intelligence Report",
    btnPredictDeloadTiming: "Predict Deload Timing",
    btnPlateauAnalysis: "Plateau Analysis",
    // Phase 4: Daily Execution
    btnStartLiveSession: "Start Live Session",
    btnProcessWithRPAlgorithms: "Process with RP Algorithms",
    btnLogSet: "Log Set",
    btnUndoLastSet: "Undo Last Set",
    btnEndSession: "End Session",

    // Phase 5: Deload Analysis
    btnAnalyzeDeloadNeed: "Analyze Deload Need",
    btnInitializeAtMEV: "Initialize at MEV",

    // Phase 6: Advanced Intelligence
    btnInitializeIntelligence: "Initialize Intelligence",
    btnOptimizeVolumeLandmarks: "Optimize Volume Landmarks",
    btnAdaptiveRIRRecommendations: "Adaptive RIR Recommendations",

    // Phase 7: Data Management
    btnExportAllData: "Export All Data",
    btnExportChart: "Export Chart",
    btnCreateBackup: "Create Backup",
    btnImportData: "Import Data",
    btnAutoBackup: "Auto Backup",
    btnExportFeedback: "Export Feedback",
  };

  const btn = document.createElement("button");
  btn.id = id;
  btn.className = "phase-button";

  // Use mapped label if available, otherwise fallback to formatted ID
  btn.textContent =
    buttonLabels[id] ||
    id
      .replace(/^btn/, "")
      .replace(/([A-Z])/g, " $1")
      .trim();

  return btn;
}

class PhaseSections {
  constructor() {
    this.container = null;
    this.phases = workflowPhases;
    this.userLevel = trainingState.userLevel || 1;
  }

  /**
   * Initialize the phase sections UI
   */
  initialize() {
    this.container = document.getElementById("phasesRoot");
    if (!this.container) {
      console.warn("PhaseSections: #phasesRoot container not found");
      return;
    }
    this.render();
    console.log(
      "🎯 Phase sections initialized with",
      this.phases.length,
      "phases",
    );
    console.info(
      "✅ Buttons rendered:",
      this.container.querySelectorAll(".phase-button").length,
    );

    // DEV audit: list any workflow IDs that failed to render
    if (location.hostname === "localhost") {
      const expected = workflowPhases.flatMap((p) => p.buttons);
      const present = [...this.container.querySelectorAll(".phase-button")].map(
        (b) => b.id,
      );
      const missing = expected.filter((id) => !present.includes(id));
      console.warn("⚠️ Missing buttons:", missing);
    }
  }

  /**
   * Render all phase sections
   */
  render() {
    if (!this.container) return;

    // Clear container
    this.container.innerHTML = "";

    // Add experience toggle
    this.renderExperienceToggle();

    // Add phases container
    const phasesContainer = document.createElement("div");
    phasesContainer.className = "phases-container";

    // Render each phase
    this.phases.forEach((phase) => {
      const phaseElement = this.renderPhase(phase);
      phasesContainer.appendChild(phaseElement);
    });

    this.container.appendChild(phasesContainer);

    // Move existing buttons into phases
    this.moveButtonsToPhases();
  }

  /**
   * Render experience level toggle
   */
  renderExperienceToggle() {
    const toggleContainer = document.createElement("div");
    toggleContainer.className = "experience-toggle-container";

    toggleContainer.innerHTML = `
      <label class="experience-toggle-label" for="experienceToggle">
        Experience Level:
      </label>
      <select id="experienceToggle" class="experience-toggle-select">
        <option value="1" ${this.userLevel === 1 ? "selected" : ""}>Beginner</option>
        <option value="2" ${this.userLevel === 2 ? "selected" : ""}>Intermediate</option>
        <option value="3" ${this.userLevel === 3 ? "selected" : ""}>Advanced</option>
      </select>
      <div class="phase-button-count">
        ${this.getVisiblePhaseCount()} phases visible
      </div>
    `;

    this.container.appendChild(toggleContainer);
  }
  /**
   * Render a single phase section
   */
  renderPhase(phase) {
    const levelNum = this.getLevelNumber(phase.level);
    const isVisible = levelNum <= this.userLevel;
    const levelClass = `level-${levelNum}`;
    const hiddenClass = isVisible ? "" : "level--hidden";

    const phaseElement = document.createElement("details");
    phaseElement.className = `phase-section ${levelClass} ${hiddenClass}`;
    phaseElement.dataset.phaseId = phase.id;
    phaseElement.dataset.level = levelNum;

    // Create summary (header)
    const summary = document.createElement("summary");
    summary.className = "phase-summary";

    const levelIndicator = this.getLevelIndicator(levelNum);
    const buttonCount = phase.buttons.length;
    summary.innerHTML = `
      <div class="phase-header">
        <h3 class="phase-title">${phase.title}</h3>
        <div class="phase-meta">
          ${levelIndicator}
          <span class="phase-button-count">${buttonCount} actions</span>
        </div>
      </div>
      <div class="phase-expand-icon">▼</div>
    `;

    // Create content area
    const content = document.createElement("div");
    content.className = "phase-content";

    content.innerHTML = `
      <p class="phase-blurb">${phase.blurb}</p>
      <div class="phase-buttons" data-phase="${phase.id}">
        <!-- Buttons will be moved here dynamically -->
      </div>
    `;

    phaseElement.appendChild(summary);
    phaseElement.appendChild(content);

    return phaseElement;
  }

  /**
   * Convert level string to number
   */
  getLevelNumber(levelString) {
    const levelMap = {
      beginner: 1,
      intermediate: 2,
      advanced: 3,
    };
    return levelMap[levelString] || 1;
  }

  /**
   * Get level indicator HTML
   */
  getLevelIndicator(level) {
    const labels = {
      1: "Beginner",
      2: "Intermediate",
      3: "Advanced",
    };

    return `<span class="phase-level-indicator level-${level}">${labels[level]}</span>`;
  }

  /**
   * Get count of visible phase details elements
   */
  getVisiblePhaseCount() {
    return this.container?.querySelectorAll("details").length ?? 0;
  }

  /**
   * Get basic statistics for experienceToggle analytics
   */
  getStats() {
    return {
      phases: this.container?.querySelectorAll("details").length ?? 0,
      buttons: this.container?.querySelectorAll(".phase-button").length ?? 0,
    };
  }

  /**
   * Generate buttons programmatically for phase sections
   */
  moveButtonsToPhases() {
    this.phases.forEach((phase) => {
      const phaseContainer = document.querySelector(
        `[data-phase="${phase.id}"]`,
      );
      if (!phaseContainer) return;

      phase.buttons.forEach((id) => {
        const btn = createButton(id);
        phaseContainer.appendChild(btn);
      });
    });

    // Attach event listeners after buttons are created
    this.attachEventListeners();
  }

  /**
   * Attach event listeners to dynamically generated buttons
   */
  attachEventListeners() {
    // Button ID to handler function mapping
    const buttonHandlers = {
      // Phase 1: Foundation Setup
      btnBeginnerPreset: () => window.beginnerPreset?.(),
      btnIntermediatePreset: () => window.intermediatePreset?.(),
      btnAdvancedPreset: () => window.advancedPreset?.(),
      btnCustomConfiguration: () => window.customConfiguration?.(),
      btnSaveVolumeLandmarks: () => window.saveLandmarks?.(),

      // Phase 2: Mesocycle Planning
      btnSetupMesocycle: () => window.setupMeso?.(),
      btnShowRIRSchedule: () => window.showRIRSchedule?.(),
      btnOptimizeFrequency: () => window.calculateOptimalFrequency?.(),
      btnGenerateWeeklyProgram: () => window.generateWeeklyProgram?.(),
      btnSmartExerciseSelection: () => window.getOptimalExercises?.(),
      btnRiskAssessment: () => window.assessTrainingRisk?.(),

      // Phase 3: Weekly Management
      btnRunWeeklyAutoProgression: () => window.runAutoVolumeProgression?.(),
      btnNextWeek: () => window.advanceToNextWeek?.(),
      btnProcessWeeklyAdjustments: () => window.runWeeklyLoadAdjustments?.(),
      btnWeeklyIntelligenceReport: () => window.getWeeklyIntelligence?.(),
      btnPredictDeloadTiming: () => window.predictDeloadTiming?.(),
      btnPlateauAnalysis: () => window.detectPlateaus?.(), // Phase 4: Daily Execution
      btnStartLiveSession: () => window.startLiveSession?.(),
      btnProcessWithRPAlgorithms: () => window.processWithRPAlgorithms?.(),
      btnLogSet: () => window.logTrainingSet?.(),
      btnUndoLastSet: () => window.undoLastSet?.(),
      btnEndSession: () => window.endLiveSession?.(),

      // Phase 5: Deload Analysis
      btnAnalyzeDeloadNeed: () => window.analyzeDeload?.(),
      btnInitializeAtMEV: () => window.initializeAllMusclesAtMEV?.(),

      // Phase 6: Advanced Intelligence
      btnInitializeIntelligence: () => window.initializeIntelligence?.(),
      btnOptimizeVolumeLandmarks: () => window.optimizeVolumeLandmarks?.(),
      btnAdaptiveRIRRecommendations: () => window.getAdaptiveRIR?.(),

      // Phase 7: Data Management
      btnExportAllData: () => window.exportAllData?.(),
      btnExportChart: () => window.exportSummary?.(),
      btnCreateBackup: () => window.createBackup?.(),
      btnImportData: () => window.importData?.(),
      btnAutoBackup: () => window.autoBackup?.(),
      btnExportFeedback: () => window.openFeedbackWidget?.(),
    };

    // Attach event listeners to each button
    Object.entries(buttonHandlers).forEach(([buttonId, handler]) => {
      const button = document.getElementById(buttonId);
      if (button) {
        button.addEventListener("click", (e) => {
          e.preventDefault();
          console.log(`🎯 Executing handler for ${buttonId}`);
          try {
            handler();
          } catch (error) {
            console.error(`❌ Error executing ${buttonId}:`, error);
            this.showError(`Error executing ${buttonId}: ${error.message}`);
          }
        });
        console.log(`✅ Attached event listener to ${buttonId}`);
      } else {
        console.warn(`⚠️ Button not found: ${buttonId}`);
      }
    });

    console.log(
      `🎯 Event listeners attached to ${Object.keys(buttonHandlers).length} buttons`,
    );

    // Debug event listeners attachment
    if (
      typeof window !== "undefined" &&
      window.location &&
      window.location.search.includes("debug")
    ) {
      setTimeout(() => this.debugEventListeners(), 100);
    }
  }

  /**
   * Debug method to verify event listeners are attached
   */
  debugEventListeners() {
    console.log("🔍 Debugging event listeners...");

    const allButtons = document.querySelectorAll(".phase-button");
    console.log(`Found ${allButtons.length} phase buttons`);

    allButtons.forEach((button) => {
      const hasListener =
        button.onclick !== null || button.addEventListener !== undefined;
      console.log(
        `Button ${button.id}: ${button.textContent} - Has listener: ${hasListener}`,
      );
    });

    // Test window functions availability
    const testFunctions = [
      "applyVolumePreset",
      "setupMeso",
      "startLiveSession",
      "processWithRPAlgorithms",
      "exportAllData",
      "createBackup",
      "importData",
      "autoBackup",
    ];

    console.log("🧪 Testing window function availability:");
    testFunctions.forEach((funcName) => {
      const available = typeof window[funcName] === "function";
      console.log(`window.${funcName}: ${available ? "✅" : "❌"}`);
    });
  }

  /**
   * Update visibility of phases based on user experience level
   */ updateVisibility(newLevel) {
    this.userLevel = parseInt(newLevel);

    // Update phase visibility
    const phaseElements = document.querySelectorAll(".phase-section");
    phaseElements.forEach((element) => {
      const phaseLevel = parseInt(element.dataset.level);
      const isVisible = phaseLevel <= this.userLevel;

      if (isVisible) {
        element.classList.remove("level--hidden");
        element.style.setProperty("display", "block", "important");
      } else {
        element.classList.add("level--hidden");
        element.style.setProperty("display", "none", "important");
      }
    });

    // Update button count if the count element exists
    const countElement = document.querySelector(".phase-button-count");
    if (countElement) {
      countElement.textContent = `${this.getVisiblePhaseCount()} phases visible`;
    }

    console.log(`🎯 Updated visibility to level ${this.userLevel}`);
  }

  /**
   * Show not implemented message
   */
  showNotImplemented(featureName) {
    alert(`${featureName} feature is not yet implemented. Coming soon!`);
  }

  /**
   * Show error message
   */
  showError(message) {
    alert(`Error: ${message}`);
  }
}

// Create and export singleton instance
export const phaseSections = new PhaseSections();
export default phaseSections;

/* ------------------------------------------------------------------ */
/*  Event wiring                                                      */
/* ------------------------------------------------------------------ */

// Initial render (safe default = beginner)
document.addEventListener("DOMContentLoaded", () => {
  phaseSections.updateVisibility("beginner");
});

// React to dropdown changes
window.addEventListener("experienceLevelChanged", (e) => {
  const level = e?.detail?.level ?? "beginner";
  phaseSections.updateVisibility(level);
});
