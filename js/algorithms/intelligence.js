/**
 * Advanced Intelligence Layer
 * Renaissance Periodization AI-assisted training optimization
 */

import trainingState from "../core/trainingState.js";
import { debugLog } from "../utils/debug.js";

/**
 * Initialize intelligence system with KPIs and baseline metrics
 * @param {Object} state - Training state object
 * @returns {Object} - Intelligence initialization summary
 */
export function initIntelligence(state = trainingState) {
  const intelligence = {
    initialized: new Date().toISOString(),
    version: "1.0.0",
    kpis: {
      avgRPE: 0,
      weeklyLoad: 0,
      volumeConsistency: 0,
      progressionRate: 0,
      deloadFrequency: 0
    },
    baselines: {},
    recommendations: [],
    confidence: 0.5
  };

  // Calculate baseline KPIs from existing data
  const workoutHistory = state.workoutHistory || [];
  const progressionHistory = state.weeklyProgressionHistory || [];
  
  if (workoutHistory.length > 0) {
    // Calculate average RPE/RIR
    let totalRPE = 0;
    let rpeCount = 0;
    
    workoutHistory.forEach(workout => {
      workout.exercises?.forEach(exercise => {
        exercise.sets?.forEach(set => {
          if (set.rir !== null && set.rir !== undefined) {
            totalRPE += (10 - set.rir); // Convert RIR to RPE
            rpeCount++;
          }
        });
      });
    });
    
    intelligence.kpis.avgRPE = rpeCount > 0 ? totalRPE / rpeCount : 7;
    
    // Calculate weekly load trend
    const recentWorkouts = workoutHistory.slice(-4); // Last 4 workouts
    intelligence.kpis.weeklyLoad = recentWorkouts.reduce((sum, w) => sum + (w.totalVolume || 0), 0);
  }

  // Calculate progression rate from history
  if (progressionHistory.length >= 2) {
    const recentProgression = progressionHistory.slice(-4);
    const progressionSum = recentProgression.reduce((sum, week) => {
      return sum + (week.totalVolumeAdded || 0);
    }, 0);
    
    intelligence.kpis.progressionRate = progressionSum / recentProgression.length;
  }

  // Set baselines
  intelligence.baselines = {
    startingVolume: state.getTotalWeeklyVolume(),
    avgRPE: intelligence.kpis.avgRPE,
    weeklyLoad: intelligence.kpis.weeklyLoad,
    recordDate: new Date().toISOString()
  };

  // Generate initial recommendations
  intelligence.recommendations = generateInitialRecommendations(intelligence, state);
  
  // Store in state
  state.intelligence = intelligence;
  
  debugLog("Intelligence system initialized", intelligence);
  return intelligence;
}

/**
 * Optimize volume landmarks based on performance data
 * @param {Object} state - Training state object
 * @returns {Object} - Optimization summary
 */
export function optimizeVolumeLandmarks(state = trainingState) {
  const optimization = {
    adjustments: {},
    confidence: 0.0,
    reasoning: [],
    totalChanges: 0
  };

  const intelligence = state.intelligence;
  const landmarks = state.volumeLandmarks;
  const progressionHistory = state.weeklyProgressionHistory || [];
  
  if (!intelligence || !landmarks) {
    optimization.reasoning.push("Intelligence system or landmarks not initialized");
    return optimization;
  }

  // Analyze each muscle group
  Object.keys(landmarks).forEach(muscle => {
    const current = landmarks[muscle];
    const recentProgress = getRecentProgressForMuscle(muscle, progressionHistory);
    const fatiguePattern = getFatiguePatternForMuscle(muscle, state);
    
    let mevAdjustment = 0;
    let mrvAdjustment = 0;
    const reasoning = [];

    // MEV optimization based on progress at low volumes
    if (recentProgress.belowMEVProgress > 1.5) {
      mevAdjustment = -1; // Lower MEV if progressing well below current MEV
      reasoning.push("Reducing MEV - good progress at low volumes");
    } else if (recentProgress.belowMEVProgress < 0.5) {
      mevAdjustment = 1; // Raise MEV if poor progress below current MEV
      reasoning.push("Increasing MEV - poor progress at low volumes");
    }

    // MRV optimization based on fatigue tolerance
    if (fatiguePattern.avgFatigueAtMRV < 0.8) {
      mrvAdjustment = 2; // Increase MRV if tolerating current MRV well
      reasoning.push("Increasing MRV - good fatigue tolerance");
    } else if (fatiguePattern.avgFatigueAtMRV > 1.2) {
      mrvAdjustment = -2; // Decrease MRV if consistently high fatigue
      reasoning.push("Decreasing MRV - high fatigue pattern");
    }

    // Apply adjustments if significant
    if (Math.abs(mevAdjustment) >= 1 || Math.abs(mrvAdjustment) >= 1) {
      const newMEV = Math.max(2, current.MEV + mevAdjustment);
      const newMRV = Math.max(newMEV + 6, current.MRV + mrvAdjustment);
      const newMAV = Math.round((newMEV + newMRV) * 0.7); // 70% between MEV and MRV

      optimization.adjustments[muscle] = {
        before: { ...current },
        after: { MEV: newMEV, MAV: newMAV, MRV: newMRV },
        changes: { MEV: mevAdjustment, MRV: mrvAdjustment },
        reasoning: reasoning
      };

      // Update landmarks
      state.volumeLandmarks[muscle] = { MEV: newMEV, MAV: newMAV, MRV: newMRV };
      optimization.totalChanges++;
    }
  });

  // Calculate confidence based on data quality
  const dataQuality = Math.min(1, progressionHistory.length / 8); // 8 weeks of data = full confidence
  optimization.confidence = dataQuality;

  if (optimization.totalChanges > 0) {
    optimization.reasoning.push(`Optimized landmarks for ${optimization.totalChanges} muscle groups`);
  } else {
    optimization.reasoning.push("No significant adjustments needed based on current data");
  }

  debugLog("Volume landmarks optimized", optimization);
  return optimization;
}

/**
 * Generate adaptive RIR recommendations based on current state
 * @param {Object} state - Training state object
 * @returns {Object} - RIR recommendations
 */
export function adaptiveRIRRecommendations(state = trainingState) {
  const recommendations = {
    muscleSpecific: {},
    globalRecommendation: 2,
    reasoning: [],
    confidence: 0.0
  };

  const intelligence = state.intelligence;
  const landmarks = state.volumeLandmarks;
  
  if (!intelligence || !landmarks) {
    recommendations.reasoning.push("Intelligence system or landmarks not initialized");
    return recommendations;
  }

  // Analyze current fatigue and volume status
  let totalFatigue = 0;
  let muscleCount = 0;
  
  Object.keys(landmarks).forEach(muscle => {
    const currentSets = state.getWeeklySets(muscle);
    const mrv = landmarks[muscle].MRV;
    const mav = landmarks[muscle].MAV;
    const fatigueRatio = currentSets / mrv;
    
    totalFatigue += fatigueRatio;
    muscleCount++;
    
    let recommendedRIR = 2; // Default
    const reasoning = [];
    
    // Adjust RIR based on volume position and fatigue
    if (currentSets <= landmarks[muscle].MEV) {
      recommendedRIR = 1; // Push harder at low volumes
      reasoning.push("Low volume - push harder");
    } else if (currentSets >= mav) {
      recommendedRIR = 3; // More conservative at high volumes
      reasoning.push("High volume - be conservative");
    } else {
      recommendedRIR = 2; // Standard middle range
      reasoning.push("Moderate volume - standard intensity");
    }
    
    // Adjust for recent fatigue patterns
    const recentFatigue = getRecentFatigueForMuscle(muscle, state);
    if (recentFatigue > 0.9) {
      recommendedRIR += 1;
      reasoning.push("Recent high fatigue - back off");
    } else if (recentFatigue < 0.6) {
      recommendedRIR = Math.max(0, recommendedRIR - 1);
      reasoning.push("Low recent fatigue - can push harder");
    }
    
    recommendations.muscleSpecific[muscle] = {
      recommendedRIR: Math.max(0, Math.min(4, recommendedRIR)),
      reasoning: reasoning,
      currentVolume: currentSets,
      fatigueRatio: fatigueRatio
    };
  });

  // Calculate global recommendation
  const avgFatigue = muscleCount > 0 ? totalFatigue / muscleCount : 0.5;
  if (avgFatigue > 1.0) {
    recommendations.globalRecommendation = 3;
    recommendations.reasoning.push("Global high fatigue - use RIR 3");
  } else if (avgFatigue < 0.6) {
    recommendations.globalRecommendation = 1;
    recommendations.reasoning.push("Global low fatigue - can use RIR 1");
  } else {
    recommendations.globalRecommendation = 2;
    recommendations.reasoning.push("Moderate fatigue - standard RIR 2");
  }

  // Confidence based on data availability
  const dataPoints = (state.workoutHistory?.length || 0) + (state.weeklyProgressionHistory?.length || 0);
  recommendations.confidence = Math.min(1, dataPoints / 20);

  debugLog("Adaptive RIR recommendations generated", recommendations);
  return recommendations;
}

// Helper functions
function generateInitialRecommendations(intelligence, state) {
  const recs = [];
  
  if (intelligence.kpis.avgRPE > 8) {
    recs.push("Consider reducing intensity - average RPE is high");
  } else if (intelligence.kpis.avgRPE < 6) {
    recs.push("Consider increasing intensity - average RPE is low");
  }
  
  if (intelligence.kpis.progressionRate < 1) {
    recs.push("Slow progression rate - consider volume increases");
  }
  
  const totalVolume = state.getTotalWeeklyVolume();
  if (totalVolume < 50) {
    recs.push("Low total volume - ensure adequate stimulus");
  }
  
  return recs;
}

function getRecentProgressForMuscle(muscle, history) {
  // Simplified - would analyze progression patterns
  return {
    belowMEVProgress: 1.0, // average progression when below MEV
    overallTrend: "stable"
  };
}

function getFatiguePatternForMuscle(muscle, state) {
  // Simplified - would analyze fatigue accumulation patterns
  return {
    avgFatigueAtMRV: 1.0 // average fatigue ratio when at/near MRV
  };
}

function getRecentFatigueForMuscle(muscle, state) {
  // Simplified - would look at recent workout RIR data
  return 0.8; // Moderate fatigue
}
