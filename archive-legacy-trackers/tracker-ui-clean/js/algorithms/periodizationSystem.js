/**
 * Advanced Periodization & Auto-Planning System
 * Intelligent long-term training planning and periodization
 */

import trainingState from "../core/trainingState.js";
import { wellnessSystem } from "./wellnessIntegration.js";
import { advancedIntelligence } from "./intelligenceHub.js";

/**
 * Advanced Periodization System
 * Creates intelligent long-term training plans with adaptive periodization
 */
class AdvancedPeriodizationSystem {
  constructor() {
    this.periodizationModels = this.initializePeriodizationModels();
    this.planningTemplates = this.initializePlanningTemplates();
    this.adaptationAlgorithms = this.initializeAdaptationAlgorithms();
  }

  /**
   * Initialize periodization models
   */
  initializePeriodizationModels() {
    return {
      linear: {
        name: "Linear Periodization",
        description: "Progressive volume increase with intensity modulation",
        phases: ["Accumulation", "Intensification", "Realization", "Deload"],
        volumeProgression: [100, 120, 110, 60],
        intensityProgression: [70, 75, 85, 60],
        duration: 4, // weeks
        applications: ["Beginners", "Strength focus", "Competition prep"],
      },
      undulating: {
        name: "Undulating Periodization",
        description: "Frequent variation in volume and intensity",
        phases: ["High Volume", "High Intensity", "Moderate", "Deload"],
        volumeProgression: [130, 80, 100, 60],
        intensityProgression: [70, 90, 80, 60],
        duration: 4,
        applications: [
          "Intermediate/Advanced",
          "Hypertrophy",
          "Avoiding plateaus",
        ],
      },
      block: {
        name: "Block Periodization",
        description: "Focused training blocks with specific adaptations",
        phases: ["Accumulation", "Intensification", "Realization"],
        volumeProgression: [120, 90, 70],
        intensityProgression: [75, 85, 95],
        duration: 3,
        applications: [
          "Advanced athletes",
          "Sport-specific",
          "Competition cycles",
        ],
      },
      conjugate: {
        name: "Conjugate Method",
        description: "Simultaneous development of multiple qualities",
        phases: ["Max Effort", "Dynamic Effort", "Repetition Method"],
        volumeProgression: [90, 110, 120],
        intensityProgression: [95, 70, 80],
        duration: 3,
        applications: [
          "Powerlifting",
          "Strength athletes",
          "Advanced training",
        ],
      },
      autoregulated: {
        name: "Autoregulated Training",
        description:
          "AI-driven adaptive periodization based on real-time feedback",
        phases: ["Adaptive", "Responsive", "Predictive"],
        volumeProgression: "dynamic",
        intensityProgression: "dynamic",
        duration: "variable",
        applications: ["All levels", "Optimal adaptation", "Injury prevention"],
      },
    };
  }

  /**
   * Initialize planning templates
   */
  initializePlanningTemplates() {
    return {
      hypertrophy12Week: {
        name: "12-Week Hypertrophy Specialization",
        duration: 12,
        phases: [
          {
            name: "Foundation Building",
            weeks: 4,
            focus: "Volume accumulation and movement quality",
            volumeMultiplier: 1.0,
            intensityRange: [70, 80],
            exercises: "compound and isolation mix",
          },
          {
            name: "Progressive Overload",
            weeks: 4,
            focus: "Systematic volume and intensity increase",
            volumeMultiplier: 1.2,
            intensityRange: [75, 85],
            exercises: "add complexity and variety",
          },
          {
            name: "Peak Volume",
            weeks: 3,
            focus: "Maximum tolerable volume",
            volumeMultiplier: 1.4,
            intensityRange: [70, 80],
            exercises: "isolation focus for weak points",
          },
          {
            name: "Deload & Assessment",
            weeks: 1,
            focus: "Recovery and progress evaluation",
            volumeMultiplier: 0.6,
            intensityRange: [60, 70],
            exercises: "movement quality and mobility",
          },
        ],
      },
      strength16Week: {
        name: "16-Week Strength Specialization",
        duration: 16,
        phases: [
          {
            name: "General Preparation",
            weeks: 4,
            focus: "Movement patterns and base building",
            volumeMultiplier: 1.1,
            intensityRange: [70, 80],
            exercises: "compound movements with accessories",
          },
          {
            name: "Specific Preparation",
            weeks: 6,
            focus: "Strength development in competition lifts",
            volumeMultiplier: 1.0,
            intensityRange: [80, 90],
            exercises: "competition lifts and close variants",
          },
          {
            name: "Competition Preparation",
            weeks: 4,
            focus: "Peak strength and competition readiness",
            volumeMultiplier: 0.8,
            intensityRange: [85, 100],
            exercises: "competition lifts only",
          },
          {
            name: "Peaking",
            weeks: 2,
            focus: "Peak performance",
            volumeMultiplier: 0.5,
            intensityRange: [90, 105],
            exercises: "competition lifts with opener/attempts",
          },
        ],
      },
      powerbuilding20Week: {
        name: "20-Week Powerbuilding Program",
        duration: 20,
        phases: [
          {
            name: "Hypertrophy Block",
            weeks: 8,
            focus: "Muscle mass and volume tolerance",
            volumeMultiplier: 1.3,
            intensityRange: [65, 80],
            exercises: "high volume, pump-focused",
          },
          {
            name: "Strength Block",
            weeks: 8,
            focus: "Maximal strength development",
            volumeMultiplier: 0.9,
            intensityRange: [80, 95],
            exercises: "compound movements, heavy loads",
          },
          {
            name: "Power Block",
            weeks: 3,
            focus: "Power and speed development",
            volumeMultiplier: 0.7,
            intensityRange: [70, 85],
            exercises: "explosive movements, plyometrics",
          },
          {
            name: "Deload",
            weeks: 1,
            focus: "Recovery and reassessment",
            volumeMultiplier: 0.5,
            intensityRange: [60, 70],
            exercises: "movement quality and mobility",
          },
        ],
      },
    };
  }

  /**
   * Initialize adaptation algorithms
   */
  initializeAdaptationAlgorithms() {
    return {
      volumeAdaptation: {
        minIncrease: 0.05, // 5% minimum
        maxIncrease: 0.25, // 25% maximum
        baseIncrease: 0.1, // 10% standard
        fatigueThreshold: 7,
        recoveryThreshold: 5,
      },
      intensityAdaptation: {
        minIncrease: 0.025, // 2.5% minimum
        maxIncrease: 0.1, // 10% maximum
        baseIncrease: 0.05, // 5% standard
        performanceThreshold: 80,
        plateauThreshold: 75,
      },
      frequencyAdaptation: {
        minFrequency: 1,
        maxFrequency: 4,
        recoveryFactor: 0.8,
        volumeFactor: 1.2,
      },
    };
  }

  /**
   * Create long-term training plan
   * @param {Object} goals - Training goals and preferences
   * @param {number} duration - Plan duration in weeks
   * @returns {Object} - Complete periodized plan
   */
  createLongTermPlan(goals, duration = 16) {
    const userProfile = this.analyzeUserProfile();
    const selectedModel = this.selectOptimalPeriodization(goals, userProfile);
    const planStructure = this.generatePlanStructure(
      selectedModel,
      duration,
      goals,
    );
    const weeklyPlans = this.generateWeeklyPlans(planStructure);
    const progressionPlan = this.createProgressionPlan(weeklyPlans);

    return {
      overview: {
        duration,
        model: selectedModel.name,
        goals: goals,
        userProfile,
        startDate: new Date(),
        estimatedCompletion: this.calculateCompletionDate(duration),
      },
      structure: planStructure,
      weeklyPlans,
      progressionPlan,
      adaptationTriggers: this.defineAdaptationTriggers(),
      milestones: this.definePlanMilestones(duration, goals),
      contingencyPlans: this.createContingencyPlans(),
    };
  }

  /**
   * Analyze user training profile
   * @returns {Object} - User profile analysis
   */
  analyzeUserProfile() {
    const historicalData = this.getHistoricalTrainingData();
    const currentCapacity = this.assessCurrentCapacity();
    const responsePatterns = this.analyzeResponsePatterns(historicalData);

    return {
      experience: this.determineExperienceLevel(historicalData),
      capacity: currentCapacity,
      responsePatterns,
      preferences: this.analyzeTrainingPreferences(historicalData),
      limitingFactors: this.identifyLimitingFactors(),
      adaptationRate: this.calculateAdaptationRate(historicalData),
    };
  }

  /**
   * Select optimal periodization model
   * @param {Object} goals - Training goals
   * @param {Object} profile - User profile
   * @returns {Object} - Selected periodization model
   */
  selectOptimalPeriodization(goals, profile) {
    const scores = {};

    // Score each model based on goals and profile
    Object.entries(this.periodizationModels).forEach(([key, model]) => {
      let score = 0;

      // Goal alignment
      if (
        goals.primary === "hypertrophy" &&
        model.applications.includes("Hypertrophy")
      )
        score += 3;
      if (
        goals.primary === "strength" &&
        model.applications.includes("Strength focus")
      )
        score += 3;
      if (
        goals.primary === "powerlifting" &&
        model.applications.includes("Powerlifting")
      )
        score += 3;

      // Experience level alignment
      if (
        profile.experience === "beginner" &&
        model.applications.includes("Beginners")
      )
        score += 2;
      if (
        profile.experience === "intermediate" &&
        model.applications.includes("Intermediate/Advanced")
      )
        score += 2;
      if (
        profile.experience === "advanced" &&
        model.applications.includes("Advanced athletes")
      )
        score += 2;

      // Adaptation patterns
      if (profile.adaptationRate === "fast" && key === "undulating") score += 1;
      if (profile.adaptationRate === "slow" && key === "linear") score += 1;
      if (
        profile.responsePatterns.variabilityTolerance === "high" &&
        key === "conjugate"
      )
        score += 1;

      scores[key] = score;
    });

    // Select highest scoring model
    const selectedKey = Object.keys(scores).reduce((a, b) =>
      scores[a] > scores[b] ? a : b,
    );
    return this.periodizationModels[selectedKey];
  }

  /**
   * Generate adaptive weekly plans
   * @param {Object} planStructure - Overall plan structure
   * @returns {Array} - Weekly training plans
   */
  generateWeeklyPlans(planStructure) {
    const weeklyPlans = [];
    let currentWeek = 1;

    planStructure.phases.forEach((phase) => {
      for (let week = 0; week < phase.weeks; week++) {
        const weekPlan = this.generateWeekPlan(phase, week, currentWeek);
        weeklyPlans.push(weekPlan);
        currentWeek++;
      }
    });

    return weeklyPlans;
  }

  /**
   * Generate individual week plan
   * @param {Object} phase - Current phase
   * @param {number} weekInPhase - Week within phase
   * @param {number} absoluteWeek - Absolute week number
   * @returns {Object} - Week training plan
   */
  generateWeekPlan(phase, weekInPhase, absoluteWeek) {
    const muscles = Object.keys(trainingState.volumeLandmarks);
    const weekProgression = (weekInPhase + 1) / phase.weeks;

    const plan = {
      week: absoluteWeek,
      phase: phase.name,
      focus: phase.focus,
      progressionFactor: weekProgression,
      muscles: {},
    };

    muscles.forEach((muscle) => {
      const baseLandmarks = trainingState.volumeLandmarks[muscle];
      const adjustedLandmarks = this.adjustLandmarksForPhase(
        baseLandmarks,
        phase,
        weekProgression,
      );

      plan.muscles[muscle] = {
        landmarks: adjustedLandmarks,
        targetSets: this.calculateTargetSets(adjustedLandmarks, phase),
        intensityRange: phase.intensityRange,
        exerciseSelection: this.selectPhaseExercises(muscle, phase),
        loadProgression: this.calculateLoadProgression(phase, weekProgression),
        recoveryRequirements: this.calculateRecoveryRequirements(muscle, phase),
      };
    });

    return plan;
  }

  /**
   * Create adaptive progression system
   * @param {Array} weeklyPlans - All weekly plans
   * @returns {Object} - Progression management system
   */
  createProgressionPlan(weeklyPlans) {
    return {
      volumeProgression: this.createVolumeProgression(weeklyPlans),
      intensityProgression: this.createIntensityProgression(weeklyPlans),
      exerciseProgression: this.createExerciseProgression(weeklyPlans),
      deloadTriggers: this.defineDeloadTriggers(),
      adaptationChecks: this.scheduleAdaptationChecks(weeklyPlans),
      autoAdjustmentRules: this.defineAutoAdjustmentRules(),
    };
  }

  /**
   * Real-time plan adaptation based on performance
   * @param {Object} currentPlan - Current training plan
   * @param {Object} recentPerformance - Recent performance data
   * @returns {Object} - Adapted plan
   */
  adaptPlanBasedOnPerformance(currentPlan, recentPerformance) {
    const adaptations = {
      volumeAdjustment: 1.0,
      intensityAdjustment: 1.0,
      frequencyAdjustment: 1.0,
      exerciseModifications: [],
      phaseModifications: [],
      reasoning: [],
    };

    // Analyze performance trends
    const performanceTrend = this.analyzePerformanceTrend(recentPerformance);
    const fatigueStatus = this.assessFatigueStatus(recentPerformance);
    const wellnessImpact = this.assessWellnessImpact();

    // Apply adaptations based on analysis
    if (
      performanceTrend.direction === "declining" &&
      performanceTrend.significance > 0.7
    ) {
      adaptations.volumeAdjustment = 0.85;
      adaptations.intensityAdjustment = 0.9;
      adaptations.reasoning.push(
        "Performance decline detected - reducing training stress",
      );
    }

    if (fatigueStatus.level === "high" && fatigueStatus.duration >= 3) {
      adaptations.volumeAdjustment *= 0.8;
      adaptations.reasoning.push(
        "Sustained high fatigue - additional volume reduction",
      );
    }

    if (wellnessImpact.readiness < 60) {
      adaptations.frequencyAdjustment = 0.8;
      adaptations.reasoning.push(
        "Low wellness readiness - reducing training frequency",
      );
    }

    // Positive adaptations
    if (
      performanceTrend.direction === "improving" &&
      fatigueStatus.level === "low"
    ) {
      adaptations.volumeAdjustment = 1.1;
      adaptations.reasoning.push(
        "Strong performance with low fatigue - increasing volume",
      );
    }

    return this.applyPlanAdaptations(currentPlan, adaptations);
  }

  /**
   * Generate intelligent deload recommendations
   * @param {Object} currentStatus - Current training status
   * @returns {Object} - Deload plan
   */
  generateIntelligentDeload(currentStatus) {
    const deloadIntensity = this.calculateDeloadIntensity(currentStatus);
    const deloadDuration = this.calculateDeloadDuration(currentStatus);
    const deloadActivities = this.selectDeloadActivities(currentStatus);

    return {
      type: this.determineDeloadType(currentStatus),
      intensity: deloadIntensity,
      duration: deloadDuration,
      activities: deloadActivities,
      volumeReduction: this.calculateVolumeReduction(deloadIntensity),
      intensityReduction: this.calculateIntensityReduction(deloadIntensity),
      focusAreas: this.identifyDeloadFocusAreas(currentStatus),
      returnCriteria: this.defineReturnCriteria(currentStatus),
      monitoring: this.defineDeloadMonitoring(),
    };
  }

  /**
   * Create competition peaking protocol
   * @param {Object} competition - Competition details
   * @param {number} weeksOut - Weeks until competition
   * @returns {Object} - Peaking protocol
   */
  createPeakingProtocol(competition, weeksOut) {
    const peakingPhases = this.definePeakingPhases(weeksOut);
    const tapering = this.createTaperingPlan(weeksOut);
    const competitionPrep = this.createCompetitionPrep(competition);

    return {
      phases: peakingPhases,
      tapering,
      competitionPrep,
      timeline: this.createPeakingTimeline(weeksOut),
      keyWorkouts: this.scheduleKeyWorkouts(weeksOut),
      recoveryProtocol: this.createPeakingRecoveryProtocol(),
      nutritionGuidance: this.createPeakingNutritionPlan(),
      mentalPreparation: this.createMentalPrepPlan(),
    };
  }

  // Helper methods for various calculations

  determineExperienceLevel(data) {
    const totalWeeks = data.length;
    const consistencyScore = this.calculateConsistency(data);
    const progressionRate = this.calculateProgressionRate(data);

    if (totalWeeks < 12 || consistencyScore < 60) return "beginner";
    if (totalWeeks < 52 || progressionRate > 0.8) return "intermediate";
    return "advanced";
  }

  assessCurrentCapacity() {
    const muscles = Object.keys(trainingState.volumeLandmarks);
    const totalCapacity = muscles.reduce((sum, muscle) => {
      const landmarks = trainingState.volumeLandmarks[muscle];
      return sum + landmarks.MRV;
    }, 0);

    return {
      totalVolume: totalCapacity,
      muscleDistribution: this.analyzeMuscleDistribution(),
      recoveryCapacity: this.assessRecoveryCapacity(),
      adaptationPotential: this.assessAdaptationPotential(),
    };
  }

  calculateTargetSets(landmarks, phase) {
    const baseTarget = (landmarks.MEV + landmarks.MAV) / 2;
    return Math.round(baseTarget * phase.volumeMultiplier);
  }

  getHistoricalTrainingData() {
    // Integrate with existing data storage
    const data = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("session-")) {
        try {
          const sessionData = JSON.parse(localStorage.getItem(key));
          data.push(sessionData);
        } catch (e) {
          console.warn("Failed to parse session data:", key);
        }
      }
    }
    return data.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  }

  calculateCompletionDate(duration) {
    const today = new Date();
    const completion = new Date(today);
    completion.setDate(completion.getDate() + duration * 7);
    return completion;
  }
}

// Export for use in main application
export { AdvancedPeriodizationSystem };

// Create singleton instance
export const periodizationSystem = new AdvancedPeriodizationSystem();
