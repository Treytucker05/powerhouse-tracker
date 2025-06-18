/**
 * Real-time Performance Tracking Dashboard
 * Provides live feedback and performance monitoring during training sessions
 */

import trainingState from "../core/trainingState.js";
import { isHighFatigue } from "./fatigue.js";
import { validateEffortLevel } from "./effort.js";
import { debugLog } from "../utils/debug.js";

/**
 * Live Performance Monitor Class
 * Tracks real-time performance metrics during training
 */
class LivePerformanceMonitor {
  constructor() {
    this.sessionData = {
      startTime: null,
      currentExercise: null,
      sets: [],
      muscle: null,
      targetRIR: null,
      plannedSets: 0,
      completedSets: 0,
    };

    this.isActive = false;
    this.callbacks = {};
  }

  /**
   * Start a new training session
   * @param {Object} sessionConfig - Session configuration
   */
  startSession(sessionConfig) {
    const {
      muscle,
      exercise,
      plannedSets = 3,
      targetRIR = null,
    } = sessionConfig;

    this.sessionData = {
      startTime: new Date(),
      currentExercise: exercise,
      sets: [],
      muscle,
      targetRIR: targetRIR || trainingState.getTargetRIR(),
      plannedSets,
      completedSets: 0,
    };

    this.isActive = true;
    this.emit("sessionStarted", this.sessionData);

    return {
      sessionId: this.generateSessionId(),
      status: "active",
      message: `Session started for ${muscle} - ${exercise}`,
    };
  }

  /**
   * Log a completed set
   * @param {Object} setData - Set performance data
   */
  logSet(setData) {
    if (!this.isActive) {
      throw new Error("No active session");
    }

    const {
      weight,
      reps,
      rir,
      rpe = null,
      techniqueRating = null,
      notes = "",
    } = setData;

    const setNumber = this.sessionData.sets.length + 1;
    const timestamp = new Date();

    // Calculate derived metrics
    const targetRIR = this.sessionData.targetRIR;
    const rirDeviation = rir - targetRIR;
    const validation = validateEffortLevel(rir, targetRIR);

    const setInfo = {
      setNumber,
      timestamp,
      weight,
      reps,
      rir,
      rpe,
      techniqueRating,
      notes,
      targetRIR,
      rirDeviation,
      validation,
      estimatedLoad: this.calculateEstimatedLoad(weight, reps, rir),
    };

    this.sessionData.sets.push(setInfo);
    this.sessionData.completedSets = setNumber;

    // Real-time feedback
    const feedback = this.generateSetFeedback(setInfo);

    // Auto-recommendations for next set
    const nextSetRecommendations = this.generateNextSetRecommendations(setInfo);

    this.emit("setCompleted", {
      setInfo,
      feedback,
      nextSetRecommendations,
      sessionProgress: this.getSessionProgress(),
    });

    return {
      setNumber,
      feedback,
      nextSetRecommendations,
      shouldContinue: this.shouldContinueSession(),
    };
  }

  /**
   * Generate real-time feedback for completed set
   * @param {Object} setInfo - Set information
   * @returns {Object} - Feedback and recommendations
   */
  generateSetFeedback(setInfo) {
    const { rir, targetRIR, validation, weight, reps } = setInfo;

    let feedback = {
      type: "success",
      message: "",
      urgency: "normal",
      recommendations: [],
    };

    // RIR Analysis
    if (validation.isWithinTolerance) {
      feedback.message = `✅ Perfect effort level (${rir} RIR vs ${targetRIR} target)`;
      feedback.type = "success";
    } else if (validation.urgency === "high") {
      if (rir > targetRIR + 1.5) {
        feedback.message = `⚠️ Too easy - consider increasing weight next set`;
        feedback.type = "warning";
        feedback.recommendations.push(
          `Try ${Math.round(weight * 1.05)}-${Math.round(weight * 1.1)}kg next set`,
        );
      } else {
        feedback.message = `🚨 Too hard - consider reducing weight or stopping`;
        feedback.type = "danger";
        feedback.urgency = "high";
        feedback.recommendations.push(
          `Reduce to ${Math.round(weight * 0.9)}-${Math.round(weight * 0.95)}kg`,
        );
      }
    } else {
      feedback.message = `⚡ Close to target but could be dialed in better`;
      feedback.type = "info";
    }

    // Performance trends within session
    if (setInfo.setNumber > 1) {
      const trend = this.analyzeIntraSessionTrend();
      if (trend.declining) {
        feedback.recommendations.push("Consider longer rest between sets");
        feedback.recommendations.push("Monitor for excessive fatigue buildup");
      }
    }

    return feedback;
  }

  /**
   * Generate recommendations for next set
   * @param {Object} lastSet - Previous set data
   * @returns {Object} - Next set recommendations
   */
  generateNextSetRecommendations(lastSet) {
    const { weight, reps, rir, targetRIR } = lastSet;
    const rirDeviation = rir - targetRIR;

    let recommendations = {
      weight: weight,
      reps: reps,
      rest: "2-3 minutes",
      strategy: "maintain",
      rationale: [],
    };

    // Weight adjustments based on RIR
    if (rirDeviation > 1.5) {
      // Too easy - increase weight
      const increase = rirDeviation > 2.5 ? 0.1 : 0.05; // 10% or 5% increase
      recommendations.weight = Math.round(weight * (1 + increase));
      recommendations.strategy = "increase_intensity";
      recommendations.rationale.push(
        `Increase weight due to ${rir} RIR (target: ${targetRIR})`,
      );
    } else if (rirDeviation < -1.5) {
      // Too hard - decrease weight or adjust reps
      const decrease = rirDeviation < -2.5 ? 0.1 : 0.05;
      recommendations.weight = Math.round(weight * (1 - decrease));
      recommendations.strategy = "reduce_intensity";
      recommendations.rationale.push(
        `Reduce weight due to excessive difficulty`,
      );
    }

    // Rep adjustments for hypertrophy
    if (reps < 6 && targetRIR <= 2) {
      recommendations.reps = Math.min(reps + 1, 8);
      recommendations.rationale.push("Aim for hypertrophy rep range");
    }

    // Rest recommendations based on performance
    if (rir < 1) {
      recommendations.rest = "3-4 minutes";
      recommendations.rationale.push("Extended rest due to high effort");
    } else if (rir > 3) {
      recommendations.rest = "1-2 minutes";
      recommendations.rationale.push("Shorter rest - effort level manageable");
    }

    // Fatigue considerations
    if (lastSet.setNumber >= 3) {
      const fatigueIndicators = this.assessIntraSetFatigue();
      if (fatigueIndicators.high) {
        recommendations.strategy = "maintain_or_stop";
        recommendations.rationale.push(
          "High fatigue detected - consider stopping",
        );
      }
    }

    return recommendations;
  }

  /**
   * Analyze performance trend within current session
   * @returns {Object} - Trend analysis
   */
  analyzeIntraSessionTrend() {
    if (this.sessionData.sets.length < 2) {
      return { trending: "insufficient_data" };
    }

    const sets = this.sessionData.sets;
    const lastThreeSets = sets.slice(-3);

    // Analyze RIR progression (should increase set to set)
    const rirTrend = lastThreeSets.map((set) => set.rir);
    const isRirIncreasing = rirTrend.every(
      (rir, i) => i === 0 || rir >= rirTrend[i - 1] - 0.5,
    );

    // Analyze load maintenance
    const loads = lastThreeSets.map((set) => set.estimatedLoad);
    const loadDecline = loads[0] - loads[loads.length - 1];
    const significantDecline = loadDecline > loads[0] * 0.15; // >15% decline

    return {
      declining: significantDecline || !isRirIncreasing,
      rirTrend,
      loadDecline: (loadDecline / loads[0]) * 100,
      recommendation: significantDecline ? "consider_stopping" : "continue",
    };
  }

  /**
   * Assess intra-set fatigue indicators
   * @returns {Object} - Fatigue assessment
   */
  assessIntraSetFatigue() {
    const currentSet = this.sessionData.sets.length;
    const avgRIRDecrease = this.calculateAvgRIRDecrease();
    const sessionDuration =
      (new Date() - this.sessionData.startTime) / (1000 * 60); // minutes

    let fatigueScore = 0;

    // RIR not increasing appropriately
    if (avgRIRDecrease < 0.3) fatigueScore += 2;

    // Session duration excessive
    if (sessionDuration > 45) fatigueScore += 1;

    // Too many sets completed
    if (currentSet > this.sessionData.plannedSets + 2) fatigueScore += 2;

    return {
      score: fatigueScore,
      high: fatigueScore >= 3,
      indicators: {
        poorRIRProgression: avgRIRDecrease < 0.3,
        longSession: sessionDuration > 45,
        excessiveSets: currentSet > this.sessionData.plannedSets + 2,
      },
    };
  }

  /**
   * Calculate average RIR decrease per set
   * @returns {number} - Average RIR decrease
   */
  calculateAvgRIRDecrease() {
    if (this.sessionData.sets.length < 2) return 0;

    const rirValues = this.sessionData.sets.map((set) => set.rir);
    const decreases = [];

    for (let i = 1; i < rirValues.length; i++) {
      decreases.push(rirValues[i - 1] - rirValues[i]);
    }

    return decreases.reduce((a, b) => a + b, 0) / decreases.length;
  }

  /**
   * Calculate estimated load (weight × reps × RPE factor)
   * @param {number} weight - Weight used
   * @param {number} reps - Reps completed
   * @param {number} rir - RIR reported
   * @returns {number} - Estimated training load
   */
  calculateEstimatedLoad(weight, reps, rir) {
    // Convert RIR to RPE (10 - RIR)
    const rpe = 10 - rir;

    // Load = Weight × Reps × RPE factor
    const rpeMultiplier = Math.max(0.5, rpe / 10);
    return Math.round(weight * reps * rpeMultiplier);
  }

  /**
   * Determine if session should continue
   * @returns {Object} - Continue recommendation
   */
  shouldContinueSession() {
    const fatigue = this.assessIntraSetFatigue();
    const trend = this.analyzeIntraSessionTrend();
    const setsRemaining =
      this.sessionData.plannedSets - this.sessionData.completedSets;

    if (fatigue.high) {
      return {
        shouldContinue: false,
        reason: "High fatigue detected",
        recommendation: "Stop session and rest",
      };
    }

    if (trend.declining && trend.recommendation === "consider_stopping") {
      return {
        shouldContinue: false,
        reason: "Significant performance decline",
        recommendation: "End session to prevent overreaching",
      };
    }

    if (setsRemaining <= 0) {
      return {
        shouldContinue: false,
        reason: "Planned sets completed",
        recommendation: "Session complete - good work!",
      };
    }

    return {
      shouldContinue: true,
      reason: "Performance maintained",
      recommendation: `Continue with ${setsRemaining} sets remaining`,
    };
  }

  /**
   * Get current session progress
   * @returns {Object} - Progress summary
   */
  getSessionProgress() {
    const duration = this.isActive
      ? (new Date() - this.sessionData.startTime) / (1000 * 60)
      : 0;

    const avgRIR =
      this.sessionData.sets.length > 0
        ? this.sessionData.sets.reduce((sum, set) => sum + set.rir, 0) /
          this.sessionData.sets.length
        : 0;

    const totalLoad = this.sessionData.sets.reduce(
      (sum, set) => sum + set.estimatedLoad,
      0,
    );

    return {
      completedSets: this.sessionData.completedSets,
      plannedSets: this.sessionData.plannedSets,
      progressPercentage:
        (this.sessionData.completedSets / this.sessionData.plannedSets) * 100,
      duration: Math.round(duration),
      averageRIR: Math.round(avgRIR * 10) / 10,
      totalLoad,
      status: this.isActive ? "active" : "completed",
    };
  }

  /**
   * End current session
   * @returns {Object} - Session summary
   */
  endSession() {
    if (!this.isActive) {
      throw new Error("No active session to end");
    }

    const summary = this.generateSessionSummary();
    this.isActive = false;

    this.emit("sessionEnded", summary);

    return summary;
  }

  /**
   * Generate comprehensive session summary
   * @returns {Object} - Complete session analysis
   */
  generateSessionSummary() {
    const progress = this.getSessionProgress();
    const trend = this.analyzeIntraSessionTrend();

    const summary = {
      ...this.sessionData,
      endTime: new Date(),
      progress,
      trend,
      performance: {
        targetAchievement: this.calculateTargetAchievement(),
        consistency: this.calculateConsistency(),
        volumeLoad: progress.totalLoad,
      },
      recommendations: this.generateSessionRecommendations(),
    };

    // Store session data for historical analysis
    this.storeSessionData(summary);

    return summary;
  }

  /**
   * Calculate how well targets were achieved
   * @returns {Object} - Target achievement analysis
   */
  calculateTargetAchievement() {
    const sets = this.sessionData.sets;
    const targetRIR = this.sessionData.targetRIR;

    const rirDeviations = sets.map((set) => Math.abs(set.rir - targetRIR));
    const avgDeviation =
      rirDeviations.reduce((a, b) => a + b, 0) / rirDeviations.length;

    const setsOnTarget = sets.filter(
      (set) => Math.abs(set.rir - targetRIR) <= 1,
    ).length;
    const targetPercentage = (setsOnTarget / sets.length) * 100;

    return {
      averageDeviation: Math.round(avgDeviation * 10) / 10,
      setsOnTarget,
      targetPercentage: Math.round(targetPercentage),
      grade:
        targetPercentage >= 80
          ? "A"
          : targetPercentage >= 70
            ? "B"
            : targetPercentage >= 60
              ? "C"
              : "D",
    };
  }

  /**
   * Calculate performance consistency
   * @returns {Object} - Consistency metrics
   */
  calculateConsistency() {
    const sets = this.sessionData.sets;

    if (sets.length < 2) return { score: 0, rating: "insufficient_data" };

    // RIR consistency (should increase gradually)
    const rirValues = sets.map((set) => set.rir);
    const expectedProgression = rirValues.map((_, i) => rirValues[0] + i * 0.5);
    const rirVariance = this.calculateVariance(rirValues, expectedProgression);

    // Load consistency
    const loads = sets.map((set) => set.estimatedLoad);
    const loadVariance = this.calculateVariance(loads);

    const consistencyScore = Math.max(
      0,
      100 - (rirVariance * 50 + loadVariance * 50),
    );

    return {
      score: Math.round(consistencyScore),
      rating:
        consistencyScore >= 80
          ? "excellent"
          : consistencyScore >= 70
            ? "good"
            : consistencyScore >= 60
              ? "fair"
              : "poor",
      rirConsistency: Math.max(0, 100 - rirVariance * 100),
      loadConsistency: Math.max(0, 100 - loadVariance * 100),
    };
  }

  /**
   * Calculate variance between actual and expected values
   * @param {Array} actual - Actual values
   * @param {Array} expected - Expected values (optional)
   * @returns {number} - Normalized variance (0-1)
   */
  calculateVariance(actual, expected = null) {
    if (actual.length < 2) return 0;

    if (!expected) {
      // Calculate variance from mean
      const mean = actual.reduce((a, b) => a + b, 0) / actual.length;
      const squaredDiffs = actual.map((x) => Math.pow(x - mean, 2));
      const variance = squaredDiffs.reduce((a, b) => a + b, 0) / actual.length;
      return Math.min(1, variance / (mean * mean)); // Normalized
    } else {
      // Calculate variance from expected progression
      const squaredDiffs = actual.map((val, i) =>
        Math.pow(val - expected[i], 2),
      );
      const variance = squaredDiffs.reduce((a, b) => a + b, 0) / actual.length;
      const maxExpected = Math.max(...expected);
      return Math.min(1, variance / (maxExpected * maxExpected));
    }
  }

  /**
   * Generate session-specific recommendations
   * @returns {Array} - Recommendation list
   */
  generateSessionRecommendations() {
    const recommendations = [];
    const performance = this.calculateTargetAchievement();
    const consistency = this.calculateConsistency();

    // Performance-based recommendations
    if (performance.averageDeviation > 1.5) {
      recommendations.push({
        type: "technique",
        message: "Focus on better RIR estimation accuracy",
        priority: "high",
      });
    }

    if (consistency.score < 70) {
      recommendations.push({
        type: "consistency",
        message: "Work on maintaining consistent effort levels throughout sets",
        priority: "medium",
      });
    }

    // Volume recommendations
    const setsCompleted = this.sessionData.completedSets;
    const setsPlanned = this.sessionData.plannedSets;

    if (setsCompleted < setsPlanned * 0.8) {
      recommendations.push({
        type: "volume",
        message:
          "Consider reducing planned volume or improving recovery between sessions",
        priority: "medium",
      });
    }

    return recommendations;
  }

  /**
   * Store session data for historical analysis
   * @param {Object} summary - Session summary
   */
  storeSessionData(summary) {
    const key = `session-${this.generateSessionId()}`;
    const sessionData = {
      ...summary,
      muscle: this.sessionData.muscle,
      exercise: this.sessionData.currentExercise,
      weekNo: trainingState.weekNo,
      blockNo: trainingState.blockNo,
    };

    localStorage.setItem(key, JSON.stringify(sessionData));

    // Update training state with session outcomes
    this.updateTrainingStateFromSession(sessionData);
  }

  /**
   * Update training state based on session performance
   * @param {Object} sessionData - Session data
   */
  updateTrainingStateFromSession(sessionData) {
    // Update baseline strength if new PR achieved
    const maxLoad = Math.max(...sessionData.sets.map((set) => set.weight));
    const currentBaseline =
      trainingState.baselineStrength[sessionData.muscle] || 0;

    if (maxLoad > currentBaseline) {
      trainingState.setBaselineStrength(sessionData.muscle, maxLoad);
    }

    // Check for fatigue indicators
    const fatigueData = {
      soreness: sessionData.performance.consistency.score < 70 ? 2 : 1,
      jointAche: 0, // Would need user input
      perfChange: maxLoad > currentBaseline ? 1 : 0,
      pump: sessionData.progress.totalLoad > 1000 ? 3 : 2,
      disruption: sessionData.progress.totalLoad > 1000 ? 3 : 2, // Workload metric
      lastLoad: maxLoad,
    };

    if (isHighFatigue(sessionData.muscle, fatigueData, trainingState)) {
      debugLog(
        `High fatigue detected for ${sessionData.muscle} after session`,
      );
    }
  }

  /**
   * Generate unique session ID
   * @returns {string} - Session ID
   */
  generateSessionId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Event emission system
   * @param {string} event - Event name
   * @param {Object} data - Event data
   */
  emit(event, data) {
    if (this.callbacks[event]) {
      this.callbacks[event].forEach((callback) => callback(data));
    }
  }

  /**
   * Register event callback
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   */
  on(event, callback) {
    if (!this.callbacks[event]) {
      this.callbacks[event] = [];
    }
    this.callbacks[event].push(callback);
  }
}

// Create singleton instance
const liveMonitor = new LivePerformanceMonitor();

export { LivePerformanceMonitor, liveMonitor };
