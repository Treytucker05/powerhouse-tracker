/**
 * Advanced Features Integration Hub
 * Integrates machine learning analytics, exercise selection, and live performance tracking
 */

import trainingState from "../core/trainingState.js";
import {
  optimizeVolumeLandmarks,
  predictDeloadTiming,
  adaptiveRIRRecommendations,
  detectTrainingPlateaus,
} from "./analytics.js";
import {
  selectOptimalExercises,
  generateWeeklyProgram,
} from "./exerciseSelection.js";
import { liveMonitor } from "./livePerformance.js";
import { isHighFatigue } from "./fatigue.js";
import { processWeeklyVolumeProgression } from "./volume.js";
import { debugLog } from "../utils/debug.js";

/**
 * Advanced Training Intelligence System
 * Coordinates all advanced features for intelligent training optimization
 */
class AdvancedTrainingIntelligence {
  constructor() {
    this.analyticsEnabled = true;
    this.exerciseSelectionEnabled = true;
    this.liveMonitoringEnabled = true;
    this.lastOptimization = null;
    this.trainingInsights = {};
  }

  /**
   * Initialize advanced features
   */
  initialize() {
    debugLog("🧠 Advanced Training Intelligence initializing...");

    // Set up live monitoring event handlers
    this.setupLiveMonitoring();

    // Initialize analytics if sufficient data
    this.initializeAnalytics();

    debugLog("✅ Advanced features ready");

    return {
      analytics: this.analyticsEnabled,
      exerciseSelection: this.exerciseSelectionEnabled,
      liveMonitoring: this.liveMonitoringEnabled,
      message: "Advanced Training Intelligence is online",
    };
  }

  /**
   * Set up live monitoring event handlers
   */
  setupLiveMonitoring() {
    if (!this.liveMonitoringEnabled) return;

    liveMonitor.on("sessionCompleted", (sessionData) => {
      this.processSessionData(sessionData);
    });

    liveMonitor.on("setCompleted", (setData) => {
      this.processLiveSetData(setData);
    });
  }

  /**
   * Initialize analytics with historical data
   */
  initializeAnalytics() {
    const historicalData = this.getHistoricalData();

    if (historicalData.length >= 4) {
      this.analyticsEnabled = true;
      debugLog(
        `📊 Analytics enabled with ${historicalData.length} weeks of data`,
      );
    } else {
      debugLog(
        `📊 Analytics disabled - need ${4 - historicalData.length} more weeks of data`,
      );
      this.analyticsEnabled = false;
    }
  }

  /**
   * Get intelligent weekly recommendations
   * Combines all advanced features for comprehensive guidance
   * @returns {Object} - Complete weekly recommendations
   */
  getWeeklyIntelligence() {
    const intelligence = {
      week: trainingState.weekNo,
      block: trainingState.blockNo,
      recommendations: [],
      analytics: null,
      exerciseSelections: {},
      riskAssessment: null,
      optimizations: [],
    };

    // 1. Analytics-based insights
    if (this.analyticsEnabled) {
      intelligence.analytics = this.generateAnalyticsInsights();

      // Predictive deload timing
      const deloadPrediction = this.predictDeloadTiming();
      if (deloadPrediction.weeksUntilDeload <= 2) {
        intelligence.recommendations.push({
          type: "deload_prediction",
          urgency: "high",
          message: `Deload predicted in ${deloadPrediction.weeksUntilDeload} weeks`,
          action: deloadPrediction.recommendedAction,
        });
      }

      // Plateau detection
      const plateauAnalysis = this.detectPlateaus();
      if (plateauAnalysis.plateauDetected) {
        intelligence.recommendations.push({
          type: "plateau_intervention",
          urgency: plateauAnalysis.urgency,
          message: `${plateauAnalysis.plateauType} detected`,
          interventions: plateauAnalysis.interventions,
        });
      }
    }

    // 2. Exercise selection recommendations
    if (this.exerciseSelectionEnabled) {
      intelligence.exerciseSelections = this.generateExerciseRecommendations();
    }

    // 3. Volume landmark optimization
    const optimizations = this.checkForOptimizations();
    if (optimizations.length > 0) {
      intelligence.optimizations = optimizations;
    }

    // 4. Risk assessment
    intelligence.riskAssessment = this.assessTrainingRisk();

    return intelligence;
  }

  /**
   * Generate analytics-based insights
   * @returns {Object} - Analytics insights
   */
  generateAnalyticsInsights() {
    const historicalData = this.getHistoricalData();
    const muscles = Object.keys(trainingState.volumeLandmarks);

    const insights = {
      volumeLandmarkOptimizations: {},
      adaptiveRIRRecommendations: {},
      performanceTrends: {},
    };

    muscles.forEach((muscle) => {
      const muscleData = historicalData.filter(
        (week) => week.muscle === muscle,
      );

      if (muscleData.length >= 4) {
        // Volume landmark optimization
        const optimizedLandmarks = optimizeVolumeLandmarks(muscle, muscleData);
        if (optimizedLandmarks.confidence >= 60) {
          insights.volumeLandmarkOptimizations[muscle] = optimizedLandmarks;
        }

        // Adaptive RIR recommendations
        const rirHistory = muscleData.map((week) => ({
          actualRIR: week.averageRIR,
          targetRIR: week.targetRIR,
          nextDayFatigue: week.fatigue,
          recoveryDays: week.recoveryTime,
          techniqueRating: week.techniqueRating || 7,
        }));

        const adaptiveRIR = adaptiveRIRRecommendations(muscle, rirHistory);
        if (adaptiveRIR.confidence >= 60) {
          insights.adaptiveRIRRecommendations[muscle] = adaptiveRIR;
        }
      }
    });

    return insights;
  }

  /**
   * Generate exercise recommendations for current training state
   * @returns {Object} - Exercise recommendations by muscle
   */
  generateExerciseRecommendations() {
    const muscles = Object.keys(trainingState.volumeLandmarks);
    const recommendations = {};

    muscles.forEach((muscle) => {
      const volumeStatus = trainingState.getVolumeStatus(muscle);
      const fatigueLevel = this.estimateFatigueLevel(muscle);

      const exercises = selectOptimalExercises(muscle, {
        availableEquipment: ["barbell", "dumbbells", "cables", "machines"],
        trainingGoal: "hypertrophy",
        experienceLevel: "intermediate",
        fatigueLevel,
        timeConstraint: "moderate",
        previousExercises: this.getRecentExercises(muscle),
        preferredStyle:
          volumeStatus === "maximum" ? "isolation_focused" : "balanced",
      });

      recommendations[muscle] = {
        primary: exercises[0],
        alternatives: exercises.slice(1, 3),
        rationale: `Selected based on ${volumeStatus} volume status and fatigue level ${fatigueLevel}`,
      };
    });

    return recommendations;
  }

  /**
   * Check for optimization opportunities
   * @returns {Array} - Available optimizations
   */
  checkForOptimizations() {
    const optimizations = [];
    const lastOptimization = this.lastOptimization;
    const weeksSinceOptimization = lastOptimization
      ? trainingState.weekNo - lastOptimization.week
      : Infinity;

    // Volume landmark optimization (every 4-6 weeks)
    if (weeksSinceOptimization >= 4 && this.analyticsEnabled) {
      const historicalData = this.getHistoricalData();

      Object.keys(trainingState.volumeLandmarks).forEach((muscle) => {
        const muscleData = historicalData.filter((w) => w.muscle === muscle);
        if (muscleData.length >= 6) {
          const optimized = optimizeVolumeLandmarks(muscle, muscleData);
          if (optimized.confidence >= 70) {
            optimizations.push({
              type: "volume_landmarks",
              muscle,
              currentLandmarks: trainingState.volumeLandmarks[muscle],
              optimizedLandmarks: optimized,
              confidence: optimized.confidence,
              estimatedImprovement: this.calculateImprovementEstimate(
                muscle,
                optimized,
              ),
            });
          }
        }
      });
    }

    // Exercise rotation recommendation
    const staleExercises = this.detectStaleExercises();
    if (staleExercises.length > 0) {
      optimizations.push({
        type: "exercise_rotation",
        staleExercises,
        recommendation:
          "Consider rotating exercises to prevent adaptation plateau",
      });
    }

    return optimizations;
  }

  /**
   * Assess current training risk
   * @returns {Object} - Risk assessment
   */
  assessTrainingRisk() {
    const riskFactors = [];
    let riskScore = 0;

    // High fatigue muscles
    const highFatigueMuscles = this.getHighFatigueMuscles();
    if (highFatigueMuscles.length > 0) {
      riskScore += highFatigueMuscles.length * 10;
      riskFactors.push(
        `${highFatigueMuscles.length} muscles showing high fatigue`,
      );
    }

    // Consecutive MRV weeks
    if (trainingState.consecutiveMRVWeeks >= 2) {
      riskScore += 20;
      riskFactors.push("Multiple consecutive weeks at MRV");
    }

    // Volume progression rate
    const progressionRate = this.calculateVolumeProgressionRate();
    if (progressionRate > 2) {
      riskScore += 15;
      riskFactors.push("Rapid volume progression detected");
    }

    // Performance decline indicators
    const performanceDecline = this.detectPerformanceDecline();
    if (performanceDecline) {
      riskScore += 25;
      riskFactors.push("Performance decline detected");
    }

    return {
      riskScore,
      riskLevel:
        riskScore <= 25
          ? "low"
          : riskScore <= 50
            ? "moderate"
            : riskScore <= 75
              ? "high"
              : "critical",
      riskFactors,
      recommendations: this.generateRiskMitigationRecommendations(
        riskScore,
        riskFactors,
      ),
    };
  }

  /**
   * Process live session data for real-time insights
   * @param {Object} sessionData - Session data from live monitor
   */
  processSessionData(sessionData) {
    debugLog("🔄 Processing session data for insights...");

    // Update training insights
    this.trainingInsights[sessionData.muscle] = {
      lastSession: sessionData,
      performance: sessionData.performance,
      consistency: sessionData.performance.consistency,
      updatedAt: new Date(),
    };

    // Check for immediate concerns
    if (sessionData.performance.targetAchievement.grade === "D") {
      console.warn("⚠️ Poor target achievement - consider technique review");
    }

    if (sessionData.performance.consistency.rating === "poor") {
      console.warn("⚠️ Poor consistency - fatigue or technique issues");
    }

    // Update fatigue indicators
    const fatigueData = this.extractFatigueFromSession(sessionData);
    if (isHighFatigue(sessionData.muscle, fatigueData, trainingState)) {
      console.warn(`🚨 High fatigue detected for ${sessionData.muscle}`);

      // Auto-trigger recovery recommendations
      this.triggerRecoveryRecommendations(sessionData.muscle);
    }
  }

  /**
   * Process live set data for immediate feedback
   * @param {Object} setData - Set data from live monitor
   */
  processLiveSetData(setData) {
    // Real-time fatigue detection
    if (setData.setInfo.rir > setData.setInfo.targetRIR + 2) {
      debugLog("💡 Tip: Consider increasing weight next set");
    }

    // Technique breakdown detection
    if (
      setData.setInfo.techniqueRating &&
      setData.setInfo.techniqueRating < 6
    ) {
      console.warn(
        "⚠️ Technique breakdown detected - consider stopping or reducing weight",
      );
    }
  }

  /**
   * Trigger recovery recommendations for high fatigue muscle
   * @param {string} muscle - Muscle group
   */
  triggerRecoveryRecommendations(muscle) {
    const recommendations = {
      immediate: [
        "Reduce training volume by 20-30% next session",
        "Extend rest periods between sets",
        "Focus on technique over intensity",
      ],
      shortTerm: [
        "Add extra rest day before next session",
        "Implement stress management techniques",
        "Prioritize sleep quality (8+ hours)",
      ],
      longTerm: [
        "Consider deload if fatigue persists",
        "Review nutrition and hydration status",
        "Assess life stress factors",
      ],
    };

    debugLog(`🔧 Recovery recommendations for ${muscle}:`, recommendations);

    // Could trigger UI notification here
    return recommendations;
  }

  /**
   * Get historical training data
   * @returns {Array} - Historical data
   */
  getHistoricalData() {
    const data = [];

    // Retrieve from localStorage
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

    // Sort by date
    return data.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  }

  /**
   * Estimate current fatigue level for muscle
   * @param {string} muscle - Muscle group
   * @returns {number} - Fatigue level (1-10)
   */
  estimateFatigueLevel(muscle) {
    const volumeStatus = trainingState.getVolumeStatus(muscle);
    const baselineFatigue = {
      "under-minimum": 2,
      optimal: 4,
      high: 6,
      maximum: 8,
    };

    let fatigue = baselineFatigue[volumeStatus] || 5;

    // Adjust based on recent session data
    const recentInsight = this.trainingInsights[muscle];
    if (recentInsight) {
      if (recentInsight.performance.consistency.rating === "poor") {
        fatigue += 2;
      }
      if (recentInsight.performance.targetAchievement.grade === "D") {
        fatigue += 1;
      }
    }

    return Math.min(10, Math.max(1, fatigue));
  }

  /**
   * Get recently used exercises for muscle
   * @param {string} muscle - Muscle group
   * @returns {Array} - Recent exercises
   */
  getRecentExercises(muscle) {
    const recentSessions = this.getHistoricalData()
      .filter((session) => session.muscle === muscle)
      .slice(-3); // Last 3 sessions

    return recentSessions.map((session) => session.exercise);
  }

  /**
   * Get muscles showing high fatigue
   * @returns {Array} - High fatigue muscles
   */
  getHighFatigueMuscles() {
    return Object.keys(trainingState.volumeLandmarks).filter(
      (muscle) => this.estimateFatigueLevel(muscle) >= 7,
    );
  }

  /**
   * Calculate volume progression rate
   * @returns {number} - Sets per week progression rate
   */
  calculateVolumeProgressionRate() {
    const historicalData = this.getHistoricalData();
    if (historicalData.length < 3) return 0;

    const recentWeeks = historicalData.slice(-3);
    const volumeChanges = [];

    for (let i = 1; i < recentWeeks.length; i++) {
      const volumeChange =
        recentWeeks[i].totalSets - recentWeeks[i - 1].totalSets;
      volumeChanges.push(volumeChange);
    }

    return volumeChanges.reduce((a, b) => a + b, 0) / volumeChanges.length;
  }

  /**
   * Detect performance decline
   * @returns {boolean} - True if decline detected
   */
  detectPerformanceDecline() {
    const historicalData = this.getHistoricalData();
    if (historicalData.length < 3) return false;

    const recentPerformance = historicalData
      .slice(-3)
      .map(
        (session) =>
          session.performance?.targetAchievement?.targetPercentage || 70,
      );

    return recentPerformance.every(
      (perf, i) => i === 0 || perf <= recentPerformance[i - 1],
    );
  }

  /**
   * Detect stale exercises (used for too long)
   * @returns {Array} - Stale exercises
   */
  detectStaleExercises() {
    const historicalData = this.getHistoricalData();
    const exerciseUsage = {};

    // Count recent exercise usage
    historicalData.slice(-6).forEach((session) => {
      const key = `${session.muscle}-${session.exercise}`;
      exerciseUsage[key] = (exerciseUsage[key] || 0) + 1;
    });

    // Find overused exercises
    return Object.entries(exerciseUsage)
      .filter(([key, count]) => count >= 4)
      .map(([key, count]) => ({ exercise: key, usageCount: count }));
  }

  /**
   * Generate risk mitigation recommendations
   * @param {number} riskScore - Risk score
   * @param {Array} riskFactors - Risk factors
   * @returns {Array} - Recommendations
   */
  generateRiskMitigationRecommendations(riskScore, riskFactors) {
    const recommendations = [];

    if (riskScore >= 75) {
      recommendations.push("Implement immediate deload (50% volume reduction)");
      recommendations.push("Address sleep and stress management urgently");
    } else if (riskScore >= 50) {
      recommendations.push("Plan deload within 1-2 weeks");
      recommendations.push("Reduce volume progression rate");
    } else if (riskScore >= 25) {
      recommendations.push("Monitor fatigue indicators closely");
      recommendations.push("Ensure adequate recovery between sessions");
    }

    return recommendations;
  }

  /**
   * Calculate improvement estimate for optimization
   * @param {string} muscle - Muscle group
   * @param {Object} optimizedLandmarks - Optimized landmarks
   * @returns {Object} - Improvement estimate
   */
  calculateImprovementEstimate(muscle, optimizedLandmarks) {
    const current = trainingState.volumeLandmarks[muscle];
    const optimized = optimizedLandmarks;

    const mevImprovement = ((optimized.MEV - current.MEV) / current.MEV) * 100;
    const mavImprovement = ((optimized.MAV - current.MAV) / current.MAV) * 100;

    return {
      mevChange: Math.round(mevImprovement),
      mavChange: Math.round(mavImprovement),
      estimatedVolumeIncrease: Math.round(
        (mevImprovement + mavImprovement) / 2,
      ),
      confidence: optimized.confidence,
    };
  }

  /**
   * Extract fatigue data from session
   * @param {Object} sessionData - Session data
   * @returns {Object} - Fatigue data
   */ extractFatigueFromSession(sessionData) {
    return {
      soreness: sessionData.performance.consistency.rating === "poor" ? 3 : 1,
      jointAche: 0, // Would need user input
      perfChange:
        sessionData.performance.targetAchievement.grade === "A" ? 1 : 0,
      pump: sessionData.progress.totalLoad > 1000 ? 3 : 2,
      disruption: sessionData.progress.totalLoad > 1000 ? 3 : 2, // Using workload metric
      lastLoad: Math.max(...sessionData.sets.map((set) => set.weight)),
    };
  }

  /**
   * Predict deload timing using analytics
   * @returns {Object} - Deload prediction
   */
  predictDeloadTiming() {
    if (!this.analyticsEnabled) {
      return { weeksUntilDeload: Infinity, confidence: 0 };
    }

    const historicalData = this.getHistoricalData();
    const recentMetrics = {
      weeklyFatigueScore: historicalData
        .slice(-4)
        .map((week) => this.estimateFatigueLevel(week.muscle)),
      performanceTrend: historicalData
        .slice(-4)
        .map(
          (week) => week.performance?.targetAchievement?.targetPercentage || 70,
        ),
      volumeProgression: historicalData
        .slice(-4)
        .map((week) => week.totalSets || 0),
      motivationLevel: 7, // Would need user input
      sleepQuality: 7, // Would need user input
    };

    return predictDeloadTiming(recentMetrics);
  }

  /**
   * Detect training plateaus using analytics
   * @returns {Object} - Plateau analysis
   */
  detectPlateaus() {
    if (!this.analyticsEnabled) {
      return { plateauDetected: false };
    }

    const historicalData = this.getHistoricalData();
    const trainingData = {
      weeklyPerformance: historicalData
        .slice(-6)
        .map(
          (week) => week.performance?.targetAchievement?.targetPercentage || 70,
        ),
      weeklyVolume: historicalData.slice(-6).map((week) => week.totalSets || 0),
      weeklyIntensity: historicalData
        .slice(-6)
        .map((week) => (week.averageRIR ? 10 - week.averageRIR : 7)),
      weeklyFatigue: historicalData
        .slice(-6)
        .map((week) => this.estimateFatigueLevel(week.muscle)),
    };

    return detectTrainingPlateaus(trainingData);
  }
}

// Create singleton instance
const advancedIntelligence = new AdvancedTrainingIntelligence();

export { AdvancedTrainingIntelligence, advancedIntelligence };
