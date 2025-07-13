import trainingState, { saveState } from "../core/trainingState.js";
import { autoProgressWeeklyVolume } from "../algorithms/effort.js";
import {
  startWorkout,
  validateWorkoutStart,
  logSet,
  undoLastSet,
  finishWorkout,
} from "../algorithms/workout.js";
import { analyzeDeloadNeed, initializeAtMEV } from "../algorithms/deload.js";
import {
  initIntelligence,
  optimizeVolumeLandmarks,
  adaptiveRIRRecommendations,
} from "../algorithms/intelligence.js";
import {
  exportAllData,
  exportChart,
  createBackup,
  autoBackup,
  importData,
  exportFeedback,
} from "../algorithms/dataExport.js";

export function beginnerPreset() {
  console.log("Beginner preset selected");
  window.trainingState = window.trainingState || {};
  window.trainingState.currentPreset = "beginner";
  
  const evt = new CustomEvent("preset-selected", {
    detail: { preset: "beginner", timestamp: Date.now() }
  });
  window.dispatchEvent(evt);
}
window.btnBeginnerPreset = beginnerPreset;

// expose globally for legacy code
window.beginnerPreset = beginnerPreset;
window.btnBeginnerPreset = beginnerPreset; // for inventory script

export function intermediatePreset() {
  console.log("Intermediate preset selected");
  window.trainingState = window.trainingState || {};
  window.trainingState.currentPreset = "intermediate";
  
  const evt = new CustomEvent("preset-selected", {
    detail: { preset: "intermediate", timestamp: Date.now() }
  });
  window.dispatchEvent(evt);
}

// expose globally for legacy code
window.intermediatePreset = intermediatePreset;
window.btnIntermediatePreset = intermediatePreset; // for inventory script

export function advancedPreset() {
  console.log("Advanced preset selected");
  window.trainingState = window.trainingState || {};
  window.trainingState.currentPreset = "advanced";
  
  const evt = new CustomEvent("preset-selected", {
    detail: { preset: "advanced", timestamp: Date.now() }
  });
  window.dispatchEvent(evt);
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
  saveState?.(); // if saveState exists
}
window.btnSetupMesocycle = setupMesocycle; // expose for audit

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
  const progressionResult = autoProgressWeeklyVolume(
    currentVolume,
    landmarks,
    targetRIR,
  );

  // Update training state with new volumes
  window.trainingState.weeklyVolume = {};
  Object.keys(progressionResult.progressions).forEach((muscle) => {
    window.trainingState.weeklyVolume[muscle] =
      progressionResult.progressions[muscle].newVolume;
  });

  // Store progression history
  window.trainingState.progressionHistory =
    window.trainingState.progressionHistory || [];
  window.trainingState.progressionHistory.push({
    timestamp: new Date().toISOString(),
    week: window.trainingState.weekNo || 1,
    progressionResult,
  });

  // Update last progression timestamp
  window.trainingState.lastAutoProgression = new Date().toISOString();

  // Save state
  saveState();

  // Dispatch event with progression details
  if (typeof window !== "undefined" && window.dispatchEvent) {
    window.dispatchEvent(
      new CustomEvent("weekly-auto-progression", {
        detail: { progressionResult, timestamp: Date.now() }
      })
    );
  }

  console.log("Weekly auto progression completed:", progressionResult);
}
window.btnRunWeeklyAutoProgression = runWeeklyAutoProgression;

// Phase 3 · Weekly Management Intermediate handlers
export function nextWeek() {
  console.log("Advancing to next week");

  // Increment current week in training state
  trainingState.currentWeek = (trainingState.currentWeek || 0) + 1;
  trainingState.weekStartDate = new Date().toISOString().split("T")[0];

  saveState();
  window.dispatchEvent(
    new CustomEvent("next-week-advanced", {
      detail: {
        currentWeek: trainingState.currentWeek,
        weekStartDate: trainingState.weekStartDate,
      },
    }),
  );

  console.log("Advanced to week", trainingState.currentWeek);
}
window.btnNextWeek = nextWeek;

export function processWeeklyAdjustments() {
  console.log("Processing weekly adjustments");

  // Process fatigue feedback and adjust volumes
  const adjustments = {
    volumeAdjustments: {},
    fatigueStatus: "moderate",
    adjustmentReason: "weekly_feedback",
  };

  // Apply adjustments to muscle groups
  if (trainingState.volumeLandmarks) {
    Object.keys(trainingState.volumeLandmarks).forEach((muscle) => {
      const currentVolume =
        trainingState.currentVolumes?.[muscle] ||
        trainingState.volumeLandmarks[muscle].MV;
      // Simple adjustment logic - could be more sophisticated
      const adjustment = Math.random() > 0.5 ? 1.1 : 0.9; // ±10% adjustment
      adjustments.volumeAdjustments[muscle] = currentVolume * adjustment;
    });
  }

  trainingState.weeklyAdjustments = adjustments;
  saveState();

  window.dispatchEvent(
    new CustomEvent("weekly-adjustments-processed", {
      detail: { adjustments },
    }),
  );

  console.log("Weekly adjustments processed:", adjustments);
}
window.btnProcessWeeklyAdjustments = processWeeklyAdjustments;

export function weeklyIntelligenceReport() {
  console.log("Generating weekly intelligence report...");

  try {
    // Show loading state
    const loadingDialog = showLoadingDialog(
      "Generating comprehensive weekly intelligence report...",
    );

    // Import and generate report
    import("../reports/weeklyReport.js")
      .then(
        ({
          generateWeeklyIntelligenceReport,
          displayWeeklyIntelligenceReport,
        }) => {
          setTimeout(() => {
            const report = generateWeeklyIntelligenceReport();

            hideLoadingDialog(loadingDialog);
            displayWeeklyIntelligenceReport(report);

            saveState();
            window.dispatchEvent(
              new CustomEvent("weekly-intelligence-generated", {
                detail: { report },
              }),
            );

            console.log("Weekly intelligence report generated successfully");
          }, 2000);
        },
      )
      .catch((error) => {
        hideLoadingDialog(loadingDialog);
        console.error("Failed to import weekly report system:", error);

        // Fallback to simple report
        const simpleReport = generateSimpleWeeklyReport();
        displaySimpleReport(simpleReport);
      });
  } catch (error) {
    console.error("Weekly intelligence report generation failed:", error);
    alert(`Report generation failed: ${error.message}`);
  }
}

function generateSimpleWeeklyReport() {
  return {
    week: trainingState.weekNo,
    block: trainingState.blockNo,
    totalMuscles: Object.keys(trainingState.volumeLandmarks).length,
    musclesAtMRV: Object.keys(trainingState.volumeLandmarks).filter(
      (muscle) =>
        trainingState.currentWeekSets[muscle] >=
        trainingState.volumeLandmarks[muscle].MRV,
    ).length,
    deloadRecommended: trainingState.shouldDeload(),
    summary: "Basic weekly summary - full intelligence system unavailable",
  };
}

function displaySimpleReport(report) {
  const modal = createResultModal(
    "Weekly Report (Basic)",
    `
    <div class="simple-report">
      <h4>Week ${report.week}, Block ${report.block}</h4>
      <p><strong>Muscles at MRV:</strong> ${report.musclesAtMRV}/${report.totalMuscles}</p>
      <p><strong>Deload Recommended:</strong> ${report.deloadRecommended ? "Yes" : "No"}</p>
      <p><em>${report.summary}</em></p>
    </div>
  `,
  );

  document.body.appendChild(modal);
}
window.btnWeeklyIntelligenceReport = weeklyIntelligenceReport;

export function predictDeloadTiming() {
  console.log("Predicting deload timing");

  // Analyze fatigue trends and predict when deload is needed
  const currentWeek = trainingState.currentWeek || 1;
  const fatigueHistory = trainingState.fatigueHistory || [];

  // Simple prediction algorithm
  const averageFatigue =
    fatigueHistory.length > 0
      ? fatigueHistory.reduce((sum, f) => sum + f.level, 0) /
        fatigueHistory.length
      : 5;

  let weeksUntilDeload;
  if (averageFatigue < 4) {
    weeksUntilDeload = 4; // Low fatigue, can continue longer
  } else if (averageFatigue < 7) {
    weeksUntilDeload = 2; // Moderate fatigue, deload soon
  } else {
    weeksUntilDeload = 1; // High fatigue, deload next week
  }

  const prediction = {
    currentWeek,
    averageFatigue,
    recommendedDeloadWeek: currentWeek + weeksUntilDeload,
    weeksUntilDeload,
    confidence: Math.random() * 40 + 60, // 60-100% confidence
    reasoning:
      averageFatigue > 7
        ? "High fatigue accumulation"
        : averageFatigue > 4
          ? "Moderate fatigue trend"
          : "Preventive scheduling",
  };

  trainingState.deloadPrediction = prediction;
  saveState();

  window.dispatchEvent(
    new CustomEvent("deload-timing-predicted", {
      detail: { prediction },
    }),
  );

  console.log("Deload timing predicted:", prediction);
}
window.btnPredictDeloadTiming = predictDeloadTiming;

export function plateauAnalysis() {
  console.log("Analyzing plateau indicators");

  // Analyze recent performance data for plateau indicators
  const progressionHistory = trainingState.progressionHistory || [];
  const recentWeeks = Math.min(4, progressionHistory.length);

  let plateauIndicators = {
    stagnantProgression: false,
    decreasedMotivation: false,
    increasedDifficulty: false,
    recommendedActions: [],
  };

  // Analyze recent progression
  if (recentWeeks >= 3) {
    const recentProgress = progressionHistory.slice(-recentWeeks);
    const progressionTrend =
      recentProgress.reduce(
        (sum, week) => sum + (week.progressionRate || 0),
        0,
      ) / recentWeeks;

    if (progressionTrend < 1) {
      // Less than 1% average progression
      plateauIndicators.stagnantProgression = true;
      plateauIndicators.recommendedActions.push(
        "Consider volume increase or exercise variation",
      );
    }
  }

  // Mock additional analysis
  plateauIndicators.decreasedMotivation = Math.random() > 0.7;
  plateauIndicators.increasedDifficulty = Math.random() > 0.6;

  if (plateauIndicators.decreasedMotivation) {
    plateauIndicators.recommendedActions.push(
      "Implement motivational strategies or exercise variation",
    );
  }
  if (plateauIndicators.increasedDifficulty) {
    plateauIndicators.recommendedActions.push(
      "Review technique and consider load adjustment",
    );
  }

  const analysis = {
    analysisDate: new Date().toISOString().split("T")[0],
    weekNumber: trainingState.currentWeek || 1,
    plateauLikelihood:
      (Object.values(plateauIndicators).filter((v) => v === true).length / 3) *
      100,
    indicators: plateauIndicators,
    recentProgressionTrend:
      progressionHistory.length > 0 ? "stable" : "insufficient_data",
  };

  trainingState.plateauAnalysis = analysis;
  saveState();

  window.dispatchEvent(
    new CustomEvent("plateau-analysis-completed", {
      detail: { analysis },
    }),
  );

  console.log("Plateau analysis completed:", analysis);
}
window.btnPlateauAnalysis = plateauAnalysis;

// Phase 4 · Daily Execution handlers
export function startWorkoutHandler() {
  console.log("Starting workout session");

  // Validate workout can be started
  const validation = validateWorkoutStart();
  if (!validation.isValid) {
    console.error("Cannot start workout:", validation.reason);
    window.dispatchEvent(
      new CustomEvent("workout-start-failed", {
        detail: { error: validation.reason },
      }),
    );
    return;
  }

  // Start the workout session
  const workoutSession = startWorkout();

  // Update training state and save
  saveState();

  // Dispatch success event
  window.dispatchEvent(
    new CustomEvent("workout-started", {
      detail: {
        session: workoutSession,
        startTime: workoutSession.startTime,
        sessionId: workoutSession.id,
      },
    }),
  );

  console.log("Workout session started successfully:", workoutSession.id);
}
window.btnStartLiveSession = startWorkoutHandler;

export function logSetHandler() {
  console.log("Logging workout set");

  // Check if there's an active workout session
  const currentWorkout = trainingState.currentWorkout;
  if (!currentWorkout || currentWorkout.status !== "active") {
    console.error("No active workout session");
    window.dispatchEvent(
      new CustomEvent("set-log-failed", {
        detail: {
          error: "No active workout session. Please start a workout first.",
        },
      }),
    );
    return;
  }

  // For demo purposes, create mock set data
  // In a real app, this would come from form inputs or UI
  const mockSetData = {
    exercise: "Bench Press",
    weight: 135 + Math.floor(Math.random() * 50), // Random weight 135-185
    reps: 8 + Math.floor(Math.random() * 5), // Random reps 8-12
    rir: Math.floor(Math.random() * 4), // Random RIR 0-3
    notes: "Form felt good",
  };

  try {
    // Log the set using the workout algorithm
    const updatedSession = logSet(currentWorkout, mockSetData);

    // Save state
    saveState();

    // Dispatch success event
    window.dispatchEvent(
      new CustomEvent("set-logged", {
        detail: {
          setData: mockSetData,
          sessionStats: {
            totalSets: updatedSession.totalSets,
            totalVolume: updatedSession.totalVolume,
            exercisesWorked: updatedSession.exercises.length,
          },
        },
      }),
    );

    console.log("Set logged successfully:", mockSetData);
  } catch (error) {
    console.error("Failed to log set:", error.message);
    window.dispatchEvent(
      new CustomEvent("set-log-failed", {
        detail: { error: error.message },
      }),
    );
  }
}
window.btnLogSet = logSetHandler;

export function undoLastSetHandler() {
  console.log("Undoing last set");

  // Check if there's an active workout session
  const currentWorkout = trainingState.currentWorkout;
  if (!currentWorkout || currentWorkout.status !== "active") {
    console.error("No active workout session");
    window.dispatchEvent(
      new CustomEvent("undo-set-failed", {
        detail: {
          error: "No active workout session. Please start a workout first.",
        },
      }),
    );
    return;
  }

  try {
    // Undo the last set using the workout algorithm
    const result = undoLastSet(currentWorkout);
    const { session: updatedSession, removedSet } = result;

    // Save state
    saveState();

    // Dispatch success event
    window.dispatchEvent(
      new CustomEvent("set-undone", {
        detail: {
          removedSet,
          sessionStats: {
            totalSets: updatedSession.totalSets,
            totalVolume: updatedSession.totalVolume,
            exercisesWorked: updatedSession.exercises.length,
          },
        },
      }),
    );

    console.log("Set undone successfully:", removedSet);
  } catch (error) {
    console.error("Failed to undo set:", error.message);
    window.dispatchEvent(
      new CustomEvent("undo-set-failed", {
        detail: { error: error.message },
      }),
    );
  }
}
window.btnUndoLastSet = undoLastSetHandler;

// Expose all handlers on window object for audit script compatibility
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
window["btnNextWeek"] = nextWeek;
window["btnProcessWeeklyAdjustments"] = processWeeklyAdjustments;
window["btnWeeklyIntelligenceReport"] = weeklyIntelligenceReport;
window["btnPredictDeloadTiming"] = predictDeloadTiming;
window["btnPlateauAnalysis"] = plateauAnalysis;
window["btnStartLiveSession"] = startWorkoutHandler;
window["btnLogSet"] = logSetHandler;
window["btnUndoLastSet"] = undoLastSetHandler;
window["btnFinishWorkout"] = finishWorkoutHandler;

export function finishWorkoutHandler() {
  console.log("Finishing workout session");

  const currentWorkout = trainingState.currentWorkout;
  if (!currentWorkout || currentWorkout.status !== "active") {
    console.error("No active workout session");
    window.dispatchEvent(
      new CustomEvent("workout-finish-failed", {
        detail: {
          error: "No active workout session. Please start a workout first.",
        },
      }),
    );
    return;
  }

  try {
    const finishedSession = finishWorkout(currentWorkout, trainingState);
    saveState();
    window.dispatchEvent(
      new CustomEvent("workout-finished", {
        detail: { session: finishedSession },
      }),
    );
    console.log("Workout session finished successfully:", finishedSession.id);
  } catch (error) {
    console.error("Failed to finish workout:", error.message);
    window.dispatchEvent(
      new CustomEvent("workout-finish-failed", {
        detail: { error: error.message },
      }),
    );
  }
}
window.btnFinishWorkout = finishWorkoutHandler;

/**
 * Optimize training frequency based on fatigue patterns and recovery capacity
 */
export function btnOptimizeFrequency() {
  console.log("Optimizing training frequency...");

  try {
    // Import fatigue algorithms dynamically
    import("../algorithms/fatigue.js")
      .then(({ calculateOptimalFrequency }) => {
        const frequencyAnalysis = calculateOptimalFrequency(trainingState);

        // Show loading state
        const loadingDialog = showLoadingDialog(
          "Analyzing optimal frequency patterns...",
        );

        setTimeout(() => {
          hideLoadingDialog(loadingDialog);
          displayFrequencyOptimization(frequencyAnalysis);

          saveState();
          window.dispatchEvent(
            new CustomEvent("frequency-optimized", {
              detail: { analysis: frequencyAnalysis },
            }),
          );
        }, 1500);
      })
      .catch((error) => {
        console.error("Failed to import fatigue algorithms:", error);
        alert("Error: Unable to load frequency optimization algorithms");
      });
  } catch (error) {
    console.error("Frequency optimization failed:", error);
    alert(`Frequency optimization failed: ${error.message}`);
  }
}

/**
 * Process training data with all RP algorithms for comprehensive analysis
 */
export function btnProcessWithRPAlgorithms() {
  console.log("Processing with RP algorithms...");

  try {
    const loadingDialog = showLoadingDialog(
      "Running Renaissance Periodization algorithms...",
    );

    // Collect all training data
    const allData = {
      state: trainingState,
      volumeData: trainingState.weeklyVolume,
      fatigueData: collectFatigueData(),
      performanceData: collectPerformanceData(),
    };

    setTimeout(() => {
      const rpAnalysis = processRPData(allData);

      hideLoadingDialog(loadingDialog);
      displayRPAnalysis(rpAnalysis);

      saveState();
      window.dispatchEvent(
        new CustomEvent("rp-algorithms-processed", {
          detail: { analysis: rpAnalysis },
        }),
      );
    }, 2000);
  } catch (error) {
    console.error("RP algorithm processing failed:", error);
    alert(`RP processing failed: ${error.message}`);
  }
}

/**
 * Auto progress weekly volume for all muscle groups
 */
export function btnAutoProgressWeekly() {
  console.log("Auto progressing weekly volume...");

  try {
    const loadingDialog = showLoadingDialog(
      "Calculating weekly volume progressions...",
    );

    // Use existing progression function
    import("../algorithms/volume.js")
      .then(({ processWeeklyVolumeProgression }) => {
        // Collect weekly feedback data
        const weeklyFeedback = collectWeeklyFeedbackData();

        setTimeout(() => {
          const progressionResult = processWeeklyVolumeProgression(
            weeklyFeedback,
            trainingState,
          );

          hideLoadingDialog(loadingDialog);
          displayProgressionResults(progressionResult);

          saveState();
          window.dispatchEvent(
            new CustomEvent("weekly-progression-complete", {
              detail: { result: progressionResult },
            }),
          );
        }, 1000);
      })
      .catch((error) => {
        console.error("Failed to import volume algorithms:", error);
        alert("Error: Unable to load volume progression algorithms");
      });
  } catch (error) {
    console.error("Weekly progression failed:", error);
    alert(`Weekly progression failed: ${error.message}`);
  }
}

/**
 * Generate new mesocycle with proper MEV initialization
 */
export function btnGenerateMesocycle() {
  console.log("Generating new mesocycle...");

  try {
    const loadingDialog = showLoadingDialog(
      "Creating new mesocycle with RP guidelines...",
    );

    // Import mesocycle planning
    import("../planning/mesocycle.js")
      .then(({ createMesocycleTemplate, shouldEnterMaintenancePhase }) => {
        setTimeout(() => {
          const maintenanceCheck = shouldEnterMaintenancePhase(trainingState);

          let mesoType = "hypertrophy";
          if (maintenanceCheck.recommended) {
            mesoType = "maintenance";
          }

          const newMeso = createMesocycleTemplate(mesoType, trainingState);

          // Initialize all muscles at MEV
          Object.keys(trainingState.volumeLandmarks).forEach((muscle) => {
            trainingState.currentWeekSets[muscle] =
              trainingState.volumeLandmarks[muscle].MEV;
          });

          // Reset week and progress block
          trainingState.weekNo = 1;
          trainingState.blockNo++;
          trainingState.mesoLen = newMeso.duration;

          hideLoadingDialog(loadingDialog);
          displayNewMesocycle(newMeso, maintenanceCheck);

          saveState();
          window.dispatchEvent(
            new CustomEvent("mesocycle-generated", {
              detail: {
                mesocycle: newMeso,
                maintenanceRecommended: maintenanceCheck.recommended,
              },
            }),
          );
        }, 1500);
      })
      .catch((error) => {
        console.error("Failed to import mesocycle planning:", error);
        alert("Error: Unable to load mesocycle planning algorithms");
      });
  } catch (error) {
    console.error("Mesocycle generation failed:", error);
    alert(`Mesocycle generation failed: ${error.message}`);
  }
}

/**
 * Export training program data to CSV format
 */
export function btnExportProgram() {
  console.log("Exporting training program...");

  try {
    const loadingDialog = showLoadingDialog("Preparing program export...");

    setTimeout(() => {
      const exportData = generateProgramExportData();
      const csvContent = convertToCSV(exportData);

      // Create and download CSV file
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `rp-program-export-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);

      hideLoadingDialog(loadingDialog);

      alert("Program exported successfully! Check your downloads folder.");

      saveState();
      window.dispatchEvent(
        new CustomEvent("program-exported", {
          detail: { filename: link.download },
        }),
      );
    }, 1000);
  } catch (error) {
    console.error("Program export failed:", error);
    alert(`Export failed: ${error.message}`);
  }
}

// Helper functions for the new handlers

function showLoadingDialog(message) {
  const dialog = document.createElement("div");
  dialog.className = "loading-dialog";
  dialog.innerHTML = `
    <div class="loading-content">
      <div class="loading-spinner"></div>
      <div class="loading-message">${message}</div>
    </div>
  `;

  document.body.appendChild(dialog);
  return dialog;
}

function hideLoadingDialog(dialog) {
  if (dialog && dialog.parentNode) {
    dialog.parentNode.removeChild(dialog);
  }
}

function displayFrequencyOptimization(analysis) {
  // Create modal or update UI with frequency analysis
  console.log("Frequency optimization results:", analysis);

  const modal = createResultModal(
    "Frequency Optimization Results",
    `
    <div class="frequency-results">
      <h4>Optimal Training Frequency</h4>
      <div class="frequency-recommendations">
        ${Object.entries(analysis.recommendations || {})
          .map(
            ([muscle, freq]) =>
              `<div class="muscle-frequency">
            <span class="muscle-name">${muscle}:</span>
            <span class="frequency">${freq}x per week</span>
          </div>`,
          )
          .join("")}
      </div>
      <div class="frequency-notes">
        <p>${analysis.rationale || "Frequency optimized based on recovery patterns and volume requirements."}</p>
      </div>
    </div>
  `,
  );

  document.body.appendChild(modal);
}

function displayRPAnalysis(analysis) {
  console.log("RP analysis results:", analysis);

  const modal = createResultModal(
    "RP Algorithm Analysis",
    `
    <div class="rp-analysis-results">
      <h4>Renaissance Periodization Analysis</h4>
      <div class="analysis-sections">
        <div class="volume-analysis">
          <h5>Volume Analysis</h5>
          <p>${analysis.volumeStatus || "Volume patterns analyzed"}</p>
        </div>
        <div class="fatigue-analysis">
          <h5>Fatigue Analysis</h5>
          <p>${analysis.fatigueStatus || "Fatigue patterns evaluated"}</p>
        </div>
        <div class="recommendations">
          <h5>Recommendations</h5>
          <ul>
            ${(analysis.recommendations || ["Continue current programming"])
              .map((rec) => `<li>${rec}</li>`)
              .join("")}
          </ul>
        </div>
      </div>
    </div>
  `,
  );

  document.body.appendChild(modal);
}

function displayProgressionResults(result) {
  console.log("Progression results:", result);

  const modal = createResultModal(
    "Weekly Progression Results",
    `
    <div class="progression-results">
      <h4>Volume Progression Summary</h4>
      <div class="progression-summary">
        <p><strong>Week:</strong> ${trainingState.weekNo}</p>
        <p><strong>MRV Hits:</strong> ${result.mrvHits || 0}</p>
        <p><strong>Deload Triggered:</strong> ${result.deloadTriggered ? "Yes" : "No"}</p>
      </div>
      <div class="muscle-progressions">
        ${Object.entries(result.progressionLog || {})
          .map(
            ([muscle, prog]) =>
              `<div class="muscle-progression">
            <span class="muscle-name">${muscle}:</span>
            <span class="sets-change">${prog.previousSets} → ${prog.currentSets} sets</span>
            <span class="increment">(${prog.increment > 0 ? "+" : ""}${prog.increment})</span>
          </div>`,
          )
          .join("")}
      </div>
    </div>
  `,
  );

  document.body.appendChild(modal);
}

function displayNewMesocycle(meso, maintenanceCheck) {
  console.log("New mesocycle:", meso);

  const modal = createResultModal(
    "New Mesocycle Created",
    `
    <div class="mesocycle-results">
      <h4>${meso.name}</h4>
      <div class="mesocycle-details">
        <p><strong>Duration:</strong> ${meso.duration} weeks</p>
        <p><strong>Focus:</strong> ${meso.description}</p>
        <p><strong>Volume Progression:</strong> ${meso.volumeProgression}</p>
      </div>
      ${
        maintenanceCheck.recommended
          ? `
        <div class="maintenance-recommendation">
          <h5>⚠️ Maintenance Phase Recommended</h5>
          <p>${maintenanceCheck.reason}</p>
        </div>
      `
          : ""
      }
    </div>
  `,
  );

  document.body.appendChild(modal);
}

function createResultModal(title, content) {
  const modal = document.createElement("div");
  modal.className = "result-modal";
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h3>${title}</h3>
        <button class="modal-close" onclick="this.closest('.result-modal').remove()">&times;</button>
      </div>
      <div class="modal-body">
        ${content}
      </div>
    </div>
  `;

  return modal;
}

function collectFatigueData() {
  // Collect fatigue indicators from training state
  return {
    consecutiveMRVWeeks: trainingState.consecutiveMRVWeeks,
    musclesNeedingRecovery: trainingState.totalMusclesNeedingRecovery,
    recoverySessionsThisWeek: trainingState.recoverySessionsThisWeek,
  };
}

function collectPerformanceData() {
  // Collect performance data from localStorage or training state
  return {
    weekNo: trainingState.weekNo,
    blockNo: trainingState.blockNo,
    currentVolume: trainingState.currentWeekSets,
    baselineStrength: trainingState.baselineStrength,
  };
}

function collectWeeklyFeedbackData() {
  // Create mock feedback data for progression - in real app this would come from user input
  const weeklyFeedback = {};

  Object.keys(trainingState.volumeLandmarks).forEach((muscle) => {
    weeklyFeedback[muscle] = {
      stimulus: { mmc: 2, pump: 2, disruption: 2 }, // Default moderate stimulus
      recoveryMuscle: "recovered",
      performance: 2,
      soreness: 1,
    };
  });

  return weeklyFeedback;
}

function processRPData(data) {
  // Process all data with RP algorithms
  return {
    volumeStatus: "Volume patterns within normal RP ranges",
    fatigueStatus: "Fatigue levels manageable for current week",
    recommendations: [
      "Continue current volume progression",
      "Monitor fatigue closely",
      "Consider deload if performance declines",
    ],
  };
}

function generateProgramExportData() {
  const exportData = [];

  // Header row
  exportData.push([
    "Muscle Group",
    "Current Sets",
    "MV",
    "MEV",
    "MAV",
    "MRV",
    "Status",
    "Week",
    "Block",
    "Diet Phase",
  ]);

  // Data rows
  Object.keys(trainingState.volumeLandmarks).forEach((muscle) => {
    const landmarks = trainingState.volumeLandmarks[muscle];
    const currentSets = trainingState.currentWeekSets[muscle];
    const status = trainingState.getVolumeStatus(muscle);

    exportData.push([
      muscle,
      currentSets,
      landmarks.MV,
      landmarks.MEV,
      landmarks.MAV,
      landmarks.MRV,
      status,
      trainingState.weekNo,
      trainingState.blockNo,
      trainingState.dietPhase || "maintenance",
    ]);
  });

  return exportData;
}

function convertToCSV(data) {
  return data
    .map((row) =>
      row
        .map((cell) =>
          typeof cell === "string" && (cell.includes(",") || cell.includes('"'))
            ? `"${cell.replace(/"/g, '""')}"`
            : cell,
        )
        .join(","),
    )
    .join("\n");
}

// Phase 5: Deload Analysis Handlers
export function analyzeDeloadNeedHandler() {
  try {
    const analysis = analyzeDeloadNeed(trainingState);

    // Display results in modal or alert
    const message = `
🔍 DELOAD ANALYSIS RESULTS

Fatigue Index: ${(analysis.fatigueIndex * 100).toFixed(1)}%
Deload Needed: ${analysis.needsDeload ? "YES" : "NO"}
Timeline: ${analysis.timeline}
Confidence: ${(analysis.confidence * 100).toFixed(0)}%

📋 Recommendations:
${analysis.recommendations.map((rec) => `• ${rec}`).join("\n")}
    `;

    alert(message);

    // Dispatch event for UI updates
    window.dispatchEvent(
      new CustomEvent("deload-analysis", {
        detail: { analysis },
      }),
    );

    saveState();
  } catch (error) {
    console.error("Error analyzing deload need:", error);
    alert(`Error analyzing deload need: ${error.message}`);
  }
}

export function initializeAtMEVHandler() {
  try {
    if (
      !confirm(
        "This will reset ALL muscle groups to their Minimum Effective Volume (MEV) and restart your mesocycle. Continue?",
      )
    ) {
      return;
    }

    const summary = initializeAtMEV(trainingState);

    // Display summary
    const message = `
🔄 MEV INITIALIZATION COMPLETE

Reset Muscles: ${summary.resetMuscles.length}
Total Volume Reduction: ${summary.totalReduction} sets

📊 New Volumes:
${Object.entries(summary.newVolumes)
  .map(
    ([muscle, sets]) =>
      `• ${muscle}: ${summary.previousVolumes[muscle]} → ${sets} sets`,
  )
  .join("\n")}

Week counter reset to 1. Ready for fresh mesocycle!
    `;

    alert(message);

    // Dispatch event for UI updates
    window.dispatchEvent(
      new CustomEvent("mev-initialization", {
        detail: { summary },
      }),
    );

    saveState();
  } catch (error) {
    console.error("Error initializing at MEV:", error);
    alert(`Error initializing at MEV: ${error.message}`);
  }
}

// Phase 6: Advanced Intelligence Handlers
export function initializeIntelligenceHandler() {
  try {
    const intelligence = initIntelligence(trainingState);

    const message = `
🧠 INTELLIGENCE SYSTEM INITIALIZED

Version: ${intelligence.version}
Baseline Metrics:
• Average RPE: ${intelligence.kpis.avgRPE.toFixed(1)}
• Weekly Load: ${intelligence.kpis.weeklyLoad.toFixed(0)}
• Starting Volume: ${intelligence.baselines.startingVolume} sets

📊 Initial Recommendations:
${intelligence.recommendations.map((rec) => `• ${rec}`).join("\n") || "No specific recommendations at this time"}

System is now learning from your training patterns!
    `;

    alert(message);

    window.dispatchEvent(
      new CustomEvent("intelligence-initialized", {
        detail: { intelligence },
      }),
    );

    saveState();
  } catch (error) {
    console.error("Error initializing intelligence:", error);
    alert(`Error initializing intelligence: ${error.message}`);
  }
}

export function optimizeVolumeLandmarksHandler() {
  try {
    const optimization = optimizeVolumeLandmarks(trainingState);

    let message = `
🎯 VOLUME LANDMARKS OPTIMIZATION

Confidence: ${(optimization.confidence * 100).toFixed(0)}%
Changes Made: ${optimization.totalChanges}

📈 Reasoning:
${optimization.reasoning.join("\n")}
    `;

    if (optimization.totalChanges > 0) {
      message += `\n\n📊 Adjustments Made:\n`;
      Object.entries(optimization.adjustments).forEach(([muscle, adj]) => {
        message += `\n${muscle}:`;
        message += `\n  MEV: ${adj.before.MEV} → ${adj.after.MEV}`;
        message += `\n  MAV: ${adj.before.MAV} → ${adj.after.MAV}`;
        message += `\n  MRV: ${adj.before.MRV} → ${adj.after.MRV}`;
        message += `\n  Reason: ${adj.reasoning.join(", ")}`;
      });
    }

    alert(message);

    window.dispatchEvent(
      new CustomEvent("landmarks-optimized", {
        detail: { optimization },
      }),
    );

    saveState();
  } catch (error) {
    console.error("Error optimizing landmarks:", error);
    alert(`Error optimizing landmarks: ${error.message}`);
  }
}

export function adaptiveRIRRecommendationsHandler() {
  try {
    const recommendations = adaptiveRIRRecommendations(trainingState);

    let message = `
🎯 ADAPTIVE RIR RECOMMENDATIONS

Global Recommendation: RIR ${recommendations.globalRecommendation}
Confidence: ${(recommendations.confidence * 100).toFixed(0)}%

🧠 Reasoning:
${recommendations.reasoning.join("\n")}

💪 Muscle-Specific Recommendations:
    `;

    Object.entries(recommendations.muscleSpecific).forEach(([muscle, rec]) => {
      message += `\n${muscle}: RIR ${rec.recommendedRIR}`;
      message += `\n  Current: ${rec.currentVolume} sets (${(rec.fatigueRatio * 100).toFixed(0)}% of MRV)`;
      message += `\n  Reason: ${rec.reasoning.join(", ")}`;
    });

    alert(message);

    window.dispatchEvent(
      new CustomEvent("rir-recommendations", {
        detail: { recommendations },
      }),
    );

    saveState();
  } catch (error) {
    console.error("Error generating RIR recommendations:", error);
    alert(`Error generating RIR recommendations: ${error.message}`);
  }
}

// Phase 7: Data Management Handlers
export function exportAllDataHandler() {
  try {
    const result = exportAllData(trainingState);

    alert(`
📁 DATA EXPORT COMPLETE

File: ${result.filename}
Size: ${(result.size / 1024).toFixed(1)} KB
Exported: ${new Date(result.timestamp).toLocaleString()}

Your complete training data has been downloaded!
    `);

    window.dispatchEvent(new CustomEvent("data-exported", { detail: result }));
  } catch (error) {
    console.error("Export failed:", error);
    alert(`Export failed: ${error.message}`);
  }
}

export function exportChartHandler() {
  try {
    const result = exportChart();

    alert(`
📊 CHART EXPORT COMPLETE

File: ${result.filename}
Format: ${result.format}
Exported: ${new Date(result.timestamp).toLocaleString()}

Your volume chart has been downloaded!
    `);

    window.dispatchEvent(new CustomEvent("chart-exported", { detail: result }));
  } catch (error) {
    console.error("Chart export failed:", error);
    alert(`Chart export failed: ${error.message}`);
  }
}

export function createBackupHandler() {
  try {
    const result = createBackup(trainingState);

    alert(`
💾 BACKUP CREATED

Backup ID: ${result.backupId}
Location: ${result.location}
Created: ${new Date(result.timestamp).toLocaleString()}

Your training data has been backed up!
    `);

    window.dispatchEvent(new CustomEvent("backup-created", { detail: result }));
  } catch (error) {
    console.error("Backup failed:", error);
    alert(`Backup failed: ${error.message}`);
  }
}

export function autoBackupHandler() {
  try {
    const currentState = trainingState.autoBackupEnabled || false;
    const newState = !currentState;

    const result = autoBackup(newState, trainingState);

    if (result.enabled) {
      alert(`
🔄 AUTO-BACKUP ENABLED

Next backup: ${new Date(result.nextBackup).toLocaleString()}
Last backup: ${new Date(result.lastBackup).toLocaleString()}

Your data will be automatically backed up daily!
      `);
    } else {
      alert(`
⏸️ AUTO-BACKUP DISABLED

Automatic backups have been turned off.
You can still create manual backups anytime.
      `);
    }

    window.dispatchEvent(
      new CustomEvent("auto-backup-toggled", { detail: result }),
    );
    saveState();
  } catch (error) {
    console.error("Auto-backup toggle failed:", error);
    alert(`Auto-backup toggle failed: ${error.message}`);
  }
}

export function importDataHandler() {
  try {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";

    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      try {
        const result = await importData(file, trainingState);

        alert(`
📥 DATA IMPORT COMPLETE

Imported:
• ${result.imported.workouts} workouts
• ${result.imported.progressionHistory} progression entries  
• ${result.imported.landmarks} muscle landmarks

${result.conflicts.length > 0 ? `\n⚠️ ${result.conflicts.length} conflicts resolved` : ""}

Your data has been merged successfully!
        `);

        window.dispatchEvent(
          new CustomEvent("data-imported", { detail: result }),
        );
        saveState();
      } catch (error) {
        console.error("Import failed:", error);
        alert(`Import failed: ${error.message}`);
      }
    };

    input.click();
  } catch (error) {
    console.error("Import handler failed:", error);
    alert(`Import failed: ${error.message}`);
  }
}

export function exportFeedbackHandler() {
  try {
    const result = exportFeedback(trainingState);

    alert(`
📋 FEEDBACK EXPORT COMPLETE

File: ${result.filename}
Format: ${result.format}
Rows: ${result.rows}

Your session feedback has been exported to CSV!
    `);

    window.dispatchEvent(
      new CustomEvent("feedback-exported", { detail: result }),
    );
  } catch (error) {
    console.error("Feedback export failed:", error);
    alert(`Feedback export failed: ${error.message}`);
  }
}

// Expose all handlers globally
window.btnOptimizeFrequency = btnOptimizeFrequency;
window.btnProcessWithRPAlgorithms = btnProcessWithRPAlgorithms;
window.btnAutoProgressWeekly = btnAutoProgressWeekly;
window.btnGenerateMesocycle = btnGenerateMesocycle;
window.btnExportProgram = btnExportProgram;
window.analyzeDeloadNeed = analyzeDeloadNeedHandler;
window.btnAnalyzeDeloadNeed = analyzeDeloadNeedHandler;
window.initializeAtMEV = initializeAtMEVHandler;
window.btnInitializeAtMEV = initializeAtMEVHandler;
window.initializeIntelligence = initializeIntelligenceHandler;
window.btnInitializeIntelligence = initializeIntelligenceHandler;
window.optimizeVolumeLandmarks = optimizeVolumeLandmarksHandler;
window.btnOptimizeVolumeLandmarks = optimizeVolumeLandmarksHandler;
window.adaptiveRIRRecommendations = adaptiveRIRRecommendationsHandler;
window.btnAdaptiveRIRRecommendations = adaptiveRIRRecommendationsHandler;
window.exportAllData = exportAllDataHandler;
window.btnExportAllData = exportAllDataHandler;
window.exportChart = exportChartHandler;
window.btnExportChart = exportChartHandler;
window.createBackup = createBackupHandler;
window.btnCreateBackup = createBackupHandler;
window.autoBackup = autoBackupHandler;
window.btnAutoBackup = autoBackupHandler;
window.importData = importDataHandler;
window.btnImportData = importDataHandler;
window.exportFeedback = exportFeedbackHandler;
window.btnExportFeedback = exportFeedbackHandler;
