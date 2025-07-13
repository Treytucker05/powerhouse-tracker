/**
 * RP Training Workflow Phases
 * Organizes 41+ actions into 7 progressive disclosure phases
 */

export const workflowPhases = [
  {
    id: "foundation",
    title: "Phase 1 · Foundation Setup",
    blurb: "Set up your training foundation",
    level: "beginner",
    buttons: [
      "btnBeginnerPreset",
      "btnIntermediatePreset",
      "btnAdvancedPreset",
      "btnSaveVolumeLandmarks",
    ],
  },
  {
    id: "mesocycle",
    title: "Phase 2 · Mesocycle Planning",
    blurb: "Plan your 5–7 week training block",
    level: "intermediate",
    buttons: [
      "btnSetupMesocycle",
      "btnShowRIRSchedule",
      "btnOptimizeFrequency",
      "btnGenerateWeeklyProgram",
      "btnSmartExerciseSelection",
      "btnRiskAssessment",
    ],
  },
  {
    id: "weekly",
    title: "Phase 3 · Weekly Management",
    blurb: "Manage weekly progression & reports",
    level: "intermediate",
    buttons: [
      "btnRunWeeklyAutoProgression",
      "btnNextWeek",
      "btnProcessWeeklyAdjustments",
      "btnWeeklyIntelligenceReport",
      "btnPredictDeloadTiming",
      "btnPlateauAnalysis",
    ],
  },
  {
    id: "daily",
    title: "Phase 4 · Daily Execution",
    blurb: "Log today's workout",
    level: "beginner",
    buttons: [
      "btnStartLiveSession",
      "btnProcessWithRPAlgorithms",
      "btnLogSet",
      "btnUndoLastSet",
      "btnEndSession",
    ],
  },
  {
    id: "deload",
    title: "Phase 5 · Deload Analysis",
    blurb: "Determine recovery needs",
    level: "intermediate",
    buttons: ["btnAnalyzeDeloadNeed", "btnInitializeAtMEV"],
  },
  {
    id: "ai",
    title: "Phase 6 · Advanced Intelligence",
    blurb: "AI-powered optimisation",
    level: "advanced",
    buttons: [
      "btnInitializeIntelligence",
      "btnOptimizeVolumeLandmarks",
      "btnAdaptiveRIRRecommendations",
    ],
  },
  {
    id: "data",
    title: "Phase 7 · Data Management",
    blurb: "Export & backup your progress",
    level: "advanced",
    buttons: [
      "btnExportAllData",
      "btnExportChart",
      "btnCreateBackup",
      "btnImportData",
      "btnAutoBackup",
      "btnExportFeedback",
    ],
  },
];

export default workflowPhases;
