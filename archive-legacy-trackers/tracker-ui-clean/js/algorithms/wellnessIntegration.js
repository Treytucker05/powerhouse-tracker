/**
 * Advanced Recovery & Wellness Integration
 * Comprehensive sleep, stress, and lifestyle factor integration
 */

import trainingState from "../core/trainingState.js";
import { isHighFatigue } from "./fatigue.js";

/**
 * Advanced Wellness & Recovery System
 * Integrates sleep, stress, nutrition, and lifestyle factors
 */
class WellnessRecoverySystem {
  constructor() {
    this.wellnessMetrics = this.initializeWellnessTracking();
    this.recoveryProtocols = this.initializeRecoveryProtocols();
  }

  /**
   * Initialize wellness tracking system
   */
  initializeWellnessTracking() {
    return {
      sleep: {
        duration: 7.5,
        quality: 7,
        efficiency: 85,
        deepSleepPercentage: 20,
        wakeups: 1,
        bedtimeConsistency: 8,
      },
      stress: {
        workStress: 5,
        lifeStress: 4,
        trainingStress: 6,
        overallStress: 5,
        stressManagementPractices: [],
      },
      nutrition: {
        hydration: 7,
        proteinAdequacy: 8,
        carbTiming: 7,
        micronutrients: 6,
        mealTiming: 7,
        supplements: [],
      },
      lifestyle: {
        screenTime: 6,
        sunlightExposure: 5,
        socialConnection: 7,
        natureExposure: 4,
        workLifeBalance: 6,
      },
      physiological: {
        restingHeartRate: 60,
        heartRateVariability: 35,
        bodyTemperature: 98.6,
        bloodPressure: { systolic: 120, diastolic: 80 },
        bodyWeight: 180,
      },
    };
  }

  /**
   * Initialize recovery protocol library
   */
  initializeRecoveryProtocols() {
    return {
      sleep: {
        optimization: [
          "Maintain consistent bedtime ±30 minutes",
          "Limit blue light 2 hours before bed",
          "Keep bedroom temperature 65-68°F (18-20°C)",
          "Use blackout curtains or eye mask",
          "Avoid caffeine 8+ hours before bed",
        ],
        intervention: [
          "Implement progressive muscle relaxation",
          "Try guided meditation apps (Headspace, Calm)",
          "Consider magnesium supplementation",
          "Use white noise or earplugs",
          "Review medications affecting sleep",
        ],
      },
      stress: {
        daily: [
          "10-minute meditation or breathing exercises",
          "Schedule stress-free time blocks",
          "Practice gratitude journaling",
          "Limit news/social media consumption",
          "Engage in enjoyable hobbies",
        ],
        acute: [
          "Box breathing (4-4-4-4 pattern)",
          "Progressive muscle relaxation",
          "Take a walk in nature",
          "Call a supportive friend/family member",
          "Use stress management apps",
        ],
        chronic: [
          "Consider professional counseling",
          "Evaluate and modify stressors where possible",
          "Develop robust stress management routine",
          "Consider stress-reducing supplements",
          "Implement time management strategies",
        ],
      },
      nutrition: {
        hydration: [
          "Aim for 35-40ml per kg body weight daily",
          "Monitor urine color (pale yellow optimal)",
          "Increase intake during training days",
          "Add electrolytes for sessions >90 minutes",
          "Spread intake throughout the day",
        ],
        recovery: [
          "Consume protein within 2 hours post-workout",
          "Include anti-inflammatory foods (berries, fatty fish)",
          "Ensure adequate carbohydrate replenishment",
          "Consider tart cherry juice for sleep/recovery",
          "Time largest meals away from bedtime",
        ],
        energy: [
          "Eat balanced meals every 3-4 hours",
          "Include complex carbs for sustained energy",
          "Don't skip breakfast",
          "Limit processed foods and added sugars",
          "Consider caffeine timing for training",
        ],
      },
      lifestyle: {
        activeRecovery: [
          "Light walking for 20-30 minutes",
          "Gentle yoga or stretching",
          "Swimming at easy pace",
          "Foam rolling or self-massage",
          "Breathing exercises",
        ],
        passiveRecovery: [
          "Massage therapy",
          "Sauna or hot bath",
          "Meditation or mindfulness",
          "Reading or gentle hobbies",
          "Quality time with loved ones",
        ],
      },
    };
  }

  /**
   * Track daily wellness metrics
   * @param {Object} dailyMetrics - Daily wellness data
   */
  trackDailyWellness(dailyMetrics) {
    const wellnessData = {
      date: new Date().toISOString().split("T")[0],
      sleep: dailyMetrics.sleep || {},
      stress: dailyMetrics.stress || {},
      nutrition: dailyMetrics.nutrition || {},
      lifestyle: dailyMetrics.lifestyle || {},
      physiological: dailyMetrics.physiological || {},
      recoveryScore: this.calculateRecoveryScore(dailyMetrics),
      readinessScore: this.calculateReadinessScore(dailyMetrics),
      recommendations: this.generateWellnessRecommendations(dailyMetrics),
    };

    // Store data
    const key = `wellness-${wellnessData.date}`;
    localStorage.setItem(key, JSON.stringify(wellnessData));

    // Update current metrics
    this.wellnessMetrics = { ...this.wellnessMetrics, ...dailyMetrics };

    return wellnessData;
  }

  /**
   * Calculate overall recovery score
   * @param {Object} metrics - Daily wellness metrics
   * @returns {number} - Recovery score (0-100)
   */
  calculateRecoveryScore(metrics) {
    let score = 0;
    let factors = 0;

    // Sleep contribution (40%)
    if (metrics.sleep) {
      const sleepScore = this.calculateSleepScore(metrics.sleep);
      score += sleepScore * 0.4;
      factors += 0.4;
    }

    // Stress contribution (25%)
    if (metrics.stress) {
      const stressScore = this.calculateStressScore(metrics.stress);
      score += stressScore * 0.25;
      factors += 0.25;
    }

    // Nutrition contribution (20%)
    if (metrics.nutrition) {
      const nutritionScore = this.calculateNutritionScore(metrics.nutrition);
      score += nutritionScore * 0.2;
      factors += 0.2;
    }

    // Lifestyle contribution (15%)
    if (metrics.lifestyle) {
      const lifestyleScore = this.calculateLifestyleScore(metrics.lifestyle);
      score += lifestyleScore * 0.15;
      factors += 0.15;
    }

    return factors > 0 ? Math.round(score / factors) : 50;
  }

  /**
   * Calculate training readiness score
   * @param {Object} metrics - Daily wellness metrics
   * @returns {number} - Readiness score (0-100)
   */
  calculateReadinessScore(metrics) {
    const recoveryScore = this.calculateRecoveryScore(metrics);
    const trainingHistory = this.getRecentTrainingLoad();
    const fatigueLevel = this.getCurrentFatigueLevel();

    // Adjust readiness based on training load and fatigue
    let adjustment = 0;

    if (trainingHistory.consecutiveHighDays >= 3) {
      adjustment -= 15;
    }

    if (fatigueLevel >= 7) {
      adjustment -= 20;
    }

    if (metrics.physiological?.restingHeartRate > this.getBaselineHR() + 10) {
      adjustment -= 10;
    }

    const readinessScore = Math.max(
      0,
      Math.min(100, recoveryScore + adjustment),
    );

    return readinessScore;
  }

  /**
   * Generate personalized wellness recommendations
   * @param {Object} metrics - Daily wellness metrics
   * @returns {Object} - Categorized recommendations
   */
  generateWellnessRecommendations(metrics) {
    const recommendations = {
      priority: [],
      sleep: [],
      stress: [],
      nutrition: [],
      training: [],
    };

    // Sleep recommendations
    if (metrics.sleep?.duration < 7) {
      recommendations.priority.push(
        "Prioritize increasing sleep duration to 7-9 hours",
      );
      recommendations.sleep.push(...this.recoveryProtocols.sleep.optimization);
    }

    if (metrics.sleep?.quality < 6) {
      recommendations.sleep.push(...this.recoveryProtocols.sleep.intervention);
    }

    // Stress recommendations
    if (metrics.stress?.overallStress > 7) {
      recommendations.priority.push("Implement stress management strategies");
      recommendations.stress.push(...this.recoveryProtocols.stress.acute);
    }

    // Nutrition recommendations
    if (metrics.nutrition?.hydration < 6) {
      recommendations.priority.push("Increase daily hydration");
      recommendations.nutrition.push(
        ...this.recoveryProtocols.nutrition.hydration,
      );
    }

    // Training modifications
    const readinessScore = this.calculateReadinessScore(metrics);
    if (readinessScore < 60) {
      recommendations.priority.push(
        "Consider reducing training intensity today",
      );
      recommendations.training.push("Focus on technique and movement quality");
      recommendations.training.push("Reduce volume by 20-30%");
      recommendations.training.push("Include extra warm-up and cool-down");
    } else if (readinessScore > 85) {
      recommendations.training.push("Good day for higher intensity training");
      recommendations.training.push("Consider pushing challenging sets");
    }

    return recommendations;
  }

  /**
   * Analyze wellness trends over time
   * @param {number} days - Number of days to analyze
   * @returns {Object} - Trend analysis
   */
  analyzeWellnessTrends(days = 14) {
    const wellnessHistory = this.getWellnessHistory(days);

    const trends = {
      sleep: this.analyzeSleepTrend(wellnessHistory),
      stress: this.analyzeStressTrend(wellnessHistory),
      recovery: this.analyzeRecoveryTrend(wellnessHistory),
      readiness: this.analyzeReadinessTrend(wellnessHistory),
      correlations: this.analyzeWellnessCorrelations(wellnessHistory),
    };

    return trends;
  }

  /**
   * Generate comprehensive wellness report
   * @returns {Object} - Complete wellness analysis
   */
  generateWellnessReport() {
    const currentMetrics = this.wellnessMetrics;
    const trends = this.analyzeWellnessTrends(30);
    const trainingImpact = this.analyzeTrainingWellnessImpact();

    return {
      current: {
        recoveryScore: this.calculateRecoveryScore(currentMetrics),
        readinessScore: this.calculateReadinessScore(currentMetrics),
        keyMetrics: this.getKeyWellnessMetrics(currentMetrics),
        alerts: this.generateWellnessAlerts(currentMetrics),
      },
      trends,
      trainingImpact,
      recommendations: this.generateWellnessRecommendations(currentMetrics),
      protocols: this.getPersonalizedProtocols(),
      insights: this.generateWellnessInsights(trends, trainingImpact),
    };
  }

  /**
   * Integrate wellness data with training decisions
   * @param {Object} plannedTraining - Planned training session
   * @returns {Object} - Modified training recommendations
   */
  optimizeTrainingBasedOnWellness(plannedTraining) {
    const readinessScore = this.calculateReadinessScore(this.wellnessMetrics);
    const recoveryScore = this.calculateRecoveryScore(this.wellnessMetrics);

    let modifications = {
      volumeMultiplier: 1.0,
      intensityMultiplier: 1.0,
      recommendations: [],
      rationale: "",
    };

    // High readiness
    if (readinessScore >= 85 && recoveryScore >= 80) {
      modifications.volumeMultiplier = 1.1;
      modifications.intensityMultiplier = 1.05;
      modifications.recommendations.push("Excellent day for pushing limits");
      modifications.rationale =
        "High wellness scores support increased training stress";
    }
    // Moderate readiness
    else if (readinessScore >= 65) {
      // Maintain planned training
      modifications.recommendations.push("Proceed with planned training");
      modifications.rationale = "Wellness scores support normal training";
    }
    // Low readiness
    else if (readinessScore < 60) {
      modifications.volumeMultiplier = 0.8;
      modifications.intensityMultiplier = 0.9;
      modifications.recommendations.push("Reduce volume and intensity");
      modifications.recommendations.push("Focus on movement quality");
      modifications.rationale =
        "Wellness scores suggest increased recovery need";
    }
    // Very low readiness
    else if (readinessScore < 40) {
      modifications.volumeMultiplier = 0.6;
      modifications.intensityMultiplier = 0.8;
      modifications.recommendations.push("Consider active recovery instead");
      modifications.recommendations.push(
        "Light movement, stretching, breathing",
      );
      modifications.rationale =
        "Very low wellness scores require prioritizing recovery";
    }

    return {
      originalTraining: plannedTraining,
      modifications,
      adjustedTraining: this.applyTrainingModifications(
        plannedTraining,
        modifications,
      ),
    };
  }

  // Helper methods for calculations

  calculateSleepScore(sleep) {
    let score = 0;
    score += Math.min(100, (sleep.duration / 8) * 40); // Duration (40%)
    score += (sleep.quality / 10) * 30; // Quality (30%)
    score += (sleep.efficiency / 100) * 20; // Efficiency (20%)
    score += Math.max(0, (10 - sleep.wakeups) / 10) * 10; // Consistency (10%)
    return Math.round(score);
  }

  calculateStressScore(stress) {
    const avgStress =
      (stress.workStress + stress.lifeStress + stress.trainingStress) / 3;
    return Math.round(Math.max(0, 100 - avgStress * 10));
  }

  calculateNutritionScore(nutrition) {
    const factors = [
      "hydration",
      "proteinAdequacy",
      "carbTiming",
      "micronutrients",
      "mealTiming",
    ];
    const avg =
      factors.reduce((sum, factor) => sum + (nutrition[factor] || 5), 0) /
      factors.length;
    return Math.round((avg / 10) * 100);
  }

  calculateLifestyleScore(lifestyle) {
    const factors = [
      "screenTime",
      "sunlightExposure",
      "socialConnection",
      "natureExposure",
      "workLifeBalance",
    ];
    const avg =
      factors.reduce((sum, factor) => sum + (lifestyle[factor] || 5), 0) /
      factors.length;
    return Math.round((avg / 10) * 100);
  }

  getWellnessHistory(days) {
    const history = [];
    const today = new Date();

    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const key = `wellness-${date.toISOString().split("T")[0]}`;
      const data = localStorage.getItem(key);

      if (data) {
        try {
          history.push(JSON.parse(data));
        } catch (e) {
          console.warn("Failed to parse wellness data:", key);
        }
      }
    }

    return history.reverse(); // Chronological order
  }

  getRecentTrainingLoad() {
    // This would integrate with existing training data
    return {
      consecutiveHighDays: 2,
      weeklyVolume: 45,
      intensity: 7,
    };
  }

  getCurrentFatigueLevel() {
    // Integration with existing fatigue system
    return 5; // Placeholder
  }

  getBaselineHR() {
    return 60; // This would be calculated from historical data
  }

  applyTrainingModifications(training, modifications) {
    return {
      ...training,
      volume: Math.round(training.volume * modifications.volumeMultiplier),
      intensity: training.intensity * modifications.intensityMultiplier,
      modifications: modifications.recommendations,
    };
  }
}

// Export for use in main application
export { WellnessRecoverySystem };

// Create singleton instance
export const wellnessSystem = new WellnessRecoverySystem();
