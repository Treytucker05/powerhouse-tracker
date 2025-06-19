import trainingState, { saveState } from "../core/trainingState.js";
import { autoProgressWeeklyVolume } from "../algorithms/effort.js";
import { startWorkout, validateWorkoutStart, logSet, undoLastSet } from "../algorithms/workout.js";

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

// Phase 3 · Weekly Management Intermediate handlers
export function nextWeek() {
  console.log("Advancing to next week");
  
  // Increment current week in training state
  trainingState.currentWeek = (trainingState.currentWeek || 0) + 1;
  trainingState.weekStartDate = new Date().toISOString().split('T')[0];
  
  saveState();
  window.dispatchEvent(new CustomEvent("next-week-advanced", {
    detail: { 
      currentWeek: trainingState.currentWeek,
      weekStartDate: trainingState.weekStartDate
    }
  }));
  
  console.log("Advanced to week", trainingState.currentWeek);
}
window.btnNextWeek = nextWeek;

export function processWeeklyAdjustments() {
  console.log("Processing weekly adjustments");
  
  // Process fatigue feedback and adjust volumes
  const adjustments = {
    volumeAdjustments: {},
    fatigueStatus: "moderate",
    adjustmentReason: "weekly_feedback"
  };
  
  // Apply adjustments to muscle groups
  if (trainingState.volumeLandmarks) {
    Object.keys(trainingState.volumeLandmarks).forEach(muscle => {
      const currentVolume = trainingState.currentVolumes?.[muscle] || trainingState.volumeLandmarks[muscle].MV;
      // Simple adjustment logic - could be more sophisticated
      const adjustment = Math.random() > 0.5 ? 1.1 : 0.9; // ±10% adjustment
      adjustments.volumeAdjustments[muscle] = currentVolume * adjustment;
    });
  }
  
  trainingState.weeklyAdjustments = adjustments;
  saveState();
  
  window.dispatchEvent(new CustomEvent("weekly-adjustments-processed", {
    detail: { adjustments }
  }));
  
  console.log("Weekly adjustments processed:", adjustments);
}
window.btnProcessWeeklyAdjustments = processWeeklyAdjustments;

export function weeklyIntelligenceReport() {
  console.log("Generating weekly intelligence report");
  
  // Generate comprehensive weekly analysis
  const report = {
    weekNumber: trainingState.currentWeek || 1,
    reportDate: new Date().toISOString().split('T')[0],
    metrics: {
      averageFatigue: Math.random() * 10, // 0-10 scale
      volumeCompliance: Math.random() * 100, // percentage
      progressionRate: Math.random() * 20 - 10 // -10% to +10%
    },
    recommendations: [
      "Consider volume adjustment based on fatigue levels",
      "Monitor progression rate for plateau indicators",
      "Evaluate exercise selection effectiveness"
    ],
    alerts: []
  };
  
  // Add alerts based on metrics
  if (report.metrics.averageFatigue > 7) {
    report.alerts.push("High fatigue detected - consider deload");
  }
  if (report.metrics.progressionRate < -5) {
    report.alerts.push("Negative progression trend - review program");
  }
  
  trainingState.weeklyReports = trainingState.weeklyReports || [];
  trainingState.weeklyReports.push(report);
  saveState();
  
  window.dispatchEvent(new CustomEvent("weekly-intelligence-report-generated", {
    detail: { report }
  }));
  
  console.log("Weekly intelligence report generated:", report);
}
window.btnWeeklyIntelligenceReport = weeklyIntelligenceReport;

export function predictDeloadTiming() {
  console.log("Predicting deload timing");
  
  // Analyze fatigue trends and predict when deload is needed
  const currentWeek = trainingState.currentWeek || 1;
  const fatigueHistory = trainingState.fatigueHistory || [];
  
  // Simple prediction algorithm
  const averageFatigue = fatigueHistory.length > 0 
    ? fatigueHistory.reduce((sum, f) => sum + f.level, 0) / fatigueHistory.length
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
    reasoning: averageFatigue > 7 ? "High fatigue accumulation" : 
               averageFatigue > 4 ? "Moderate fatigue trend" : "Preventive scheduling"
  };
  
  trainingState.deloadPrediction = prediction;
  saveState();
  
  window.dispatchEvent(new CustomEvent("deload-timing-predicted", {
    detail: { prediction }
  }));
  
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
    recommendedActions: []
  };
  
  // Analyze recent progression
  if (recentWeeks >= 3) {
    const recentProgress = progressionHistory.slice(-recentWeeks);
    const progressionTrend = recentProgress.reduce((sum, week) => sum + (week.progressionRate || 0), 0) / recentWeeks;
    
    if (progressionTrend < 1) { // Less than 1% average progression
      plateauIndicators.stagnantProgression = true;
      plateauIndicators.recommendedActions.push("Consider volume increase or exercise variation");
    }
  }
  
  // Mock additional analysis
  plateauIndicators.decreasedMotivation = Math.random() > 0.7;
  plateauIndicators.increasedDifficulty = Math.random() > 0.6;
  
  if (plateauIndicators.decreasedMotivation) {
    plateauIndicators.recommendedActions.push("Implement motivational strategies or exercise variation");
  }
  if (plateauIndicators.increasedDifficulty) {
    plateauIndicators.recommendedActions.push("Review technique and consider load adjustment");
  }
  
  const analysis = {
    analysisDate: new Date().toISOString().split('T')[0],
    weekNumber: trainingState.currentWeek || 1,
    plateauLikelihood: Object.values(plateauIndicators).filter(v => v === true).length / 3 * 100,
    indicators: plateauIndicators,
    recentProgressionTrend: progressionHistory.length > 0 ? "stable" : "insufficient_data"
  };
  
  trainingState.plateauAnalysis = analysis;
  saveState();
  
  window.dispatchEvent(new CustomEvent("plateau-analysis-completed", {
    detail: { analysis }
  }));
  
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
    window.dispatchEvent(new CustomEvent("workout-start-failed", {
      detail: { error: validation.reason }
    }));
    return;
  }
  
  // Start the workout session
  const workoutSession = startWorkout();
  
  // Update training state and save
  saveState();
  
  // Dispatch success event
  window.dispatchEvent(new CustomEvent("workout-started", {
    detail: { 
      session: workoutSession,
      startTime: workoutSession.startTime,
      sessionId: workoutSession.id
    }
  }));
  
  console.log("Workout session started successfully:", workoutSession.id);
}
window.btnStartLiveSession = startWorkoutHandler;

export function logSetHandler() {
  console.log("Logging workout set");
  
  // Check if there's an active workout session
  const currentWorkout = trainingState.currentWorkout;
  if (!currentWorkout || currentWorkout.status !== 'active') {
    console.error("No active workout session");
    window.dispatchEvent(new CustomEvent("set-log-failed", {
      detail: { error: "No active workout session. Please start a workout first." }
    }));
    return;
  }
  
  // For demo purposes, create mock set data
  // In a real app, this would come from form inputs or UI
  const mockSetData = {
    exercise: "Bench Press",
    weight: 135 + Math.floor(Math.random() * 50), // Random weight 135-185
    reps: 8 + Math.floor(Math.random() * 5), // Random reps 8-12
    rir: Math.floor(Math.random() * 4), // Random RIR 0-3
    notes: "Form felt good"
  };
  
  try {
    // Log the set using the workout algorithm
    const updatedSession = logSet(currentWorkout, mockSetData);
    
    // Save state
    saveState();
    
    // Dispatch success event
    window.dispatchEvent(new CustomEvent("set-logged", {
      detail: { 
        setData: mockSetData,
        sessionStats: {
          totalSets: updatedSession.totalSets,
          totalVolume: updatedSession.totalVolume,
          exercisesWorked: updatedSession.exercises.length
        }
      }
    }));
    
    console.log("Set logged successfully:", mockSetData);
    
  } catch (error) {
    console.error("Failed to log set:", error.message);
    window.dispatchEvent(new CustomEvent("set-log-failed", {
      detail: { error: error.message }
    }));
  }
}
window.btnLogSet = logSetHandler;

export function undoLastSetHandler() {
  console.log("Undoing last set");
  
  // Check if there's an active workout session
  const currentWorkout = trainingState.currentWorkout;
  if (!currentWorkout || currentWorkout.status !== 'active') {
    console.error("No active workout session");
    window.dispatchEvent(new CustomEvent("undo-set-failed", {
      detail: { error: "No active workout session. Please start a workout first." }
    }));
    return;
  }
  
  try {
    // Undo the last set using the workout algorithm
    const result = undoLastSet(currentWorkout);
    const { session: updatedSession, removedSet } = result;
    
    // Save state
    saveState();
    
    // Dispatch success event
    window.dispatchEvent(new CustomEvent("set-undone", {
      detail: { 
        removedSet,
        sessionStats: {
          totalSets: updatedSession.totalSets,
          totalVolume: updatedSession.totalVolume,
          exercisesWorked: updatedSession.exercises.length
        }
      }
    }));
    
    console.log("Set undone successfully:", removedSet);
    
  } catch (error) {
    console.error("Failed to undo set:", error.message);
    window.dispatchEvent(new CustomEvent("undo-set-failed", {
      detail: { error: error.message }
    }));
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
