/**
 * Weekly Intelligence Report System
 * Generates comprehensive training analysis and recommendations using RP methodology
 */

import trainingState from "../core/trainingState.js";
import { calculateSystemicFatigue } from "../algorithms/fatigue.js";
import { shouldEnterMaintenancePhase } from "../planning/mesocycle.js";
import { debugLog } from "../utils/debug.js";

/**
 * Generate comprehensive weekly intelligence report
 * @returns {Object} - Complete weekly analysis and recommendations
 */
export function generateWeeklyIntelligenceReport() {
  debugLog("Generating weekly intelligence report...");
  
  const report = {
    metadata: generateReportMetadata(),
    volumeAnalysis: analyzeWeeklyVolumeChanges(),
    fatigueAnalysis: analyzeFatiguePatterns(),
    recoveryAnalysis: analyzeRecoveryPatterns(),
    progressionAnalysis: analyzeProgressionTrends(),
    recommendations: generateActionableRecommendations(),
    warnings: identifyPotentialIssues(),
    predictions: generatePredictions(),
    summary: null // Will be filled at the end
  };
  
  // Generate executive summary
  report.summary = generateExecutiveSummary(report);
  
  return report;
}

/**
 * Generate report metadata
 */
function generateReportMetadata() {
  return {
    reportDate: new Date().toISOString(),
    week: trainingState.weekNo,
    block: trainingState.blockNo,
    mesocycleLength: trainingState.getAdaptiveMesoLength ? trainingState.getAdaptiveMesoLength() : trainingState.mesoLen,
    dietPhase: trainingState.dietPhase || 'maintenance',
    deloadPhase: trainingState.deloadPhase,
    maintenancePhase: trainingState.resensitizationPhase,
    reportVersion: '1.0'
  };
}

/**
 * Analyze weekly volume changes per muscle group
 */
function analyzeWeeklyVolumeChanges() {
  const volumeChanges = {};
  const musclesNearMRV = [];
  const musclesUnderMEV = [];
  let totalVolumeIncrease = 0;
  
  Object.keys(trainingState.volumeLandmarks).forEach(muscle => {
    const current = trainingState.currentWeekSets[muscle];
    const last = trainingState.lastWeekSets[muscle] || trainingState.volumeLandmarks[muscle].MEV;
    const landmarks = trainingState.volumeLandmarks[muscle];
    
    const change = current - last;
    const percentageOfMRV = (current / landmarks.MRV) * 100;
    const status = trainingState.getVolumeStatus(muscle);
    
    volumeChanges[muscle] = {
      current,
      previous: last,
      change,
      percentageOfMRV: Math.round(percentageOfMRV),
      status,
      daysToMRV: estimateDaysToMRV(muscle, current, landmarks.MRV)
    };
    
    totalVolumeIncrease += Math.max(0, change);
    
    // Flag muscles approaching MRV (within 2 sets)
    if (current >= landmarks.MRV - 2) {
      musclesNearMRV.push(muscle);
    }
    
    // Flag muscles under MEV
    if (current < landmarks.MEV) {
      musclesUnderMEV.push(muscle);
    }
  });
  
  return {
    muscleChanges: volumeChanges,
    totalVolumeIncrease,
    musclesNearMRV,
    musclesUnderMEV,
    overallTrend: totalVolumeIncrease > 0 ? 'increasing' : totalVolumeIncrease < 0 ? 'decreasing' : 'stable'
  };
}

/**
 * Analyze fatigue patterns and systemic stress
 */
function analyzeFatiguePatterns() {
  try {
    const systemicFatigue = calculateSystemicFatigue(trainingState);
    const fatiguePercentage = Math.round(systemicFatigue * 100);
    
    const fatigueLevel = fatiguePercentage < 60 ? 'low' : 
                        fatiguePercentage < 80 ? 'moderate' : 'high';
    
    const analysis = {
      systemicFatigue,
      fatiguePercentage,
      fatigueLevel,
      consecutiveMRVWeeks: trainingState.consecutiveMRVWeeks,
      musclesNeedingRecovery: trainingState.totalMusclesNeedingRecovery,
      recoverySessionsThisWeek: trainingState.recoverySessionsThisWeek,
      trend: assessFatigueTrend(),
      riskLevel: determineFatigueRisk(fatiguePercentage)
    };
    
    return analysis;
  } catch (error) {
    console.warn('Error analyzing fatigue patterns:', error);
    return {
      systemicFatigue: 0,
      fatiguePercentage: 0,
      fatigueLevel: 'unknown',
      error: 'Unable to assess fatigue patterns'
    };
  }
}

/**
 * Analyze recovery patterns and capacity
 */
function analyzeRecoveryPatterns() {
  const recoveryMetrics = {
    averageRecoveryTime: calculateAverageRecoveryTime(),
    recoveryTrend: assessRecoveryTrend(),
    sleepQualityPattern: getSleepQualityPattern(),
    nutritionAdherence: getNutritionAdherence(),
    stressFactors: identifyStressFactors()
  };
  
  return {
    ...recoveryMetrics,
    overallRecoveryScore: calculateRecoveryScore(recoveryMetrics),
    recommendations: generateRecoveryRecommendations(recoveryMetrics)
  };
}

/**
 * Analyze progression trends across training variables
 */
function analyzeProgressionTrends() {
  return {
    volumeProgression: analyzeVolumeProgression(),
    strengthProgression: analyzeStrengthProgression(),
    loadProgression: analyzeLoadProgression(),
    consistencyMetrics: analyzeTrainingConsistency(),
    plateauRisk: assessPlateauRisk()
  };
}

/**
 * Generate actionable recommendations based on all analyses
 */
function generateActionableRecommendations() {
  const recommendations = [];
  
  // Volume recommendations
  const volumeAnalysis = analyzeWeeklyVolumeChanges();
  if (volumeAnalysis.musclesNearMRV.length > 0) {
    recommendations.push({
      category: 'volume',
      priority: 'high',
      action: 'Consider deload preparation',
      detail: `${volumeAnalysis.musclesNearMRV.length} muscle groups approaching MRV: ${volumeAnalysis.musclesNearMRV.join(', ')}`,
      timeframe: 'next 1-2 weeks'
    });
  }
  
  if (volumeAnalysis.musclesUnderMEV.length > 0) {
    recommendations.push({
      category: 'volume',
      priority: 'medium',
      action: 'Increase volume for understimulated muscles',
      detail: `Muscles under MEV: ${volumeAnalysis.musclesUnderMEV.join(', ')}`,
      timeframe: 'next week'
    });
  }
  
  // Fatigue recommendations
  const fatigueAnalysis = analyzeFatiguePatterns();
  if (fatigueAnalysis.fatiguePercentage >= 80) {
    recommendations.push({
      category: 'fatigue',
      priority: 'high',
      action: 'Implement deload immediately',
      detail: `System fatigue at ${fatigueAnalysis.fatiguePercentage}% - recovery needed`,
      timeframe: 'this week'
    });
  }
  
  // Maintenance phase recommendations
  const maintenanceCheck = shouldEnterMaintenancePhase(trainingState);
  if (maintenanceCheck.recommended) {
    recommendations.push({
      category: 'periodization',
      priority: 'high',
      action: 'Enter maintenance phase',
      detail: maintenanceCheck.reason,
      timeframe: `${maintenanceCheck.suggestedDuration} weeks`
    });
  }
  
  // Diet phase recommendations
  if (trainingState.dietPhase === 'cut') {
    recommendations.push({
      category: 'diet',
      priority: 'medium',
      action: 'Monitor for excess fatigue during cut',
      detail: 'Cutting phase requires careful fatigue management',
      timeframe: 'ongoing'
    });
  }
  
  // Add progression recommendations
  addProgressionRecommendations(recommendations);
  
  return recommendations.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
}

/**
 * Identify potential issues and warning flags
 */
function identifyPotentialIssues() {
  const warnings = [];
  
  // Volume warnings
  const totalMuscles = Object.keys(trainingState.volumeLandmarks).length;
  const musclesAtMRV = Object.keys(trainingState.volumeLandmarks).filter(muscle => 
    trainingState.currentWeekSets[muscle] >= trainingState.volumeLandmarks[muscle].MRV
  ).length;
  
  if (musclesAtMRV >= totalMuscles * 0.5) {
    warnings.push({
      type: 'volume',
      severity: 'high',
      message: `${musclesAtMRV}/${totalMuscles} muscle groups at or above MRV`,
      impact: 'Deload likely needed within 1-2 weeks'
    });
  }
  
  // Fatigue warnings
  if (trainingState.consecutiveMRVWeeks >= 2) {
    warnings.push({
      type: 'fatigue',
      severity: 'high',
      message: `${trainingState.consecutiveMRVWeeks} consecutive weeks at MRV`,
      impact: 'Systemic fatigue accumulation detected'
    });
  }
  
  // Recovery warnings
  if (trainingState.totalMusclesNeedingRecovery >= totalMuscles * 0.4) {
    warnings.push({
      type: 'recovery',
      severity: 'medium',
      message: `${trainingState.totalMusclesNeedingRecovery} muscles showing recovery needs`,
      impact: 'Recovery capacity may be compromised'
    });
  }
  
  return warnings;
}

/**
 * Generate predictions for upcoming training phases
 */
function generatePredictions() {
  return {
    deloadTiming: predictDeloadTiming(),
    plateauRisk: predictPlateauRisk(),
    maintenanceNeed: predictMaintenanceNeed(),
    volumeCapacity: predictVolumeCapacity()
  };
}

/**
 * Generate executive summary of the entire report
 */
function generateExecutiveSummary(report) {
  const { volumeAnalysis, fatigueAnalysis, recommendations, warnings } = report;
  
  let status = 'optimal';
  if (warnings.some(w => w.severity === 'high')) {
    status = 'attention_needed';
  } else if (warnings.some(w => w.severity === 'medium')) {
    status = 'monitoring_required';
  }
  
  const topRecommendations = recommendations.slice(0, 3);
  const criticalWarnings = warnings.filter(w => w.severity === 'high');
  
  return {
    overallStatus: status,
    keyFindings: [
      `System fatigue: ${fatigueAnalysis.fatiguePercentage}% (${fatigueAnalysis.fatigueLevel})`,
      `Volume trend: ${volumeAnalysis.overallTrend}`,
      `Muscles near MRV: ${volumeAnalysis.musclesNearMRV.length}`,
      `High priority actions: ${topRecommendations.length}`
    ],
    nextActions: topRecommendations.map(rec => rec.action),
    criticalWarnings: criticalWarnings.map(w => w.message),
    outlook: generateOutlook(report)
  };
}

// Helper functions for analysis

function estimateDaysToMRV(muscle, currentSets, mrv) {
  const setsToMRV = mrv - currentSets;
  if (setsToMRV <= 0) return 0;
  
  // Assume average progression of 1 set per week
  return setsToMRV * 7;
}

function assessFatigueTrend() {
  // Simplified trend analysis - in real app, would track historical data
  if (trainingState.consecutiveMRVWeeks > 1) return 'increasing';
  if (trainingState.totalMusclesNeedingRecovery > 0) return 'stable_high';
  return 'stable_low';
}

function determineFatigueRisk(fatiguePercentage) {
  if (fatiguePercentage >= 90) return 'critical';
  if (fatiguePercentage >= 80) return 'high';
  if (fatiguePercentage >= 60) return 'moderate';
  return 'low';
}

function calculateAverageRecoveryTime() {
  // Mock function - would calculate from historical data
  return 24; // hours
}

function assessRecoveryTrend() {
  return 'stable'; // Mock
}

function getSleepQualityPattern() {
  return 'adequate'; // Mock
}

function getNutritionAdherence() {
  return 85; // percentage, mock
}

function identifyStressFactors() {
  return ['training_volume']; // Mock
}

function calculateRecoveryScore(metrics) {
  // Simple scoring system
  let score = 7; // base score out of 10
  
  if (metrics.averageRecoveryTime > 48) score -= 1;
  if (metrics.sleepQualityPattern === 'poor') score -= 2;
  if (metrics.nutritionAdherence < 80) score -= 1;
  if (metrics.stressFactors.length > 2) score -= 1;
  
  return Math.max(1, Math.min(10, score));
}

function generateRecoveryRecommendations(metrics) {
  const recs = [];
  
  if (metrics.averageRecoveryTime > 48) {
    recs.push('Consider reducing training frequency');
  }
  if (metrics.sleepQualityPattern === 'poor') {
    recs.push('Prioritize sleep hygiene improvements');
  }
  if (metrics.nutritionAdherence < 80) {
    recs.push('Focus on nutrition consistency');
  }
  
  return recs;
}

function analyzeVolumeProgression() {
  return {
    trend: 'increasing',
    rate: 'appropriate',
    sustainability: 'good'
  };
}

function analyzeStrengthProgression() {
  return {
    trend: 'stable',
    rate: 'moderate'
  };
}

function analyzeLoadProgression() {
  return {
    trend: 'increasing',
    rate: 'conservative'
  };
}

function analyzeTrainingConsistency() {
  return {
    weeklyAdherence: 85,
    missedSessions: 1,
    trend: 'consistent'
  };
}

function assessPlateauRisk() {
  return {
    risk: 'low',
    timeframe: '4+ weeks',
    indicators: []
  };
}

function addProgressionRecommendations(recommendations) {
  // Add progression-specific recommendations
  recommendations.push({
    category: 'progression',
    priority: 'low',
    action: 'Continue current progression rate',
    detail: 'Volume and load progression within optimal ranges',
    timeframe: 'ongoing'
  });
}

function predictDeloadTiming() {
  const weeksToDeload = Math.max(1, 
    (trainingState.getAdaptiveMesoLength ? trainingState.getAdaptiveMesoLength() : trainingState.mesoLen) - trainingState.weekNo + 1
  );
  
  return {
    estimatedWeeks: weeksToDeload,
    confidence: 'medium',
    factors: ['mesocycle_length', 'fatigue_accumulation']
  };
}

function predictPlateauRisk() {
  return {
    risk: 'low',
    timeframe: '6+ weeks',
    confidence: 'medium'
  };
}

function predictMaintenanceNeed() {
  const maintenanceCheck = shouldEnterMaintenancePhase(trainingState);
  return {
    recommended: maintenanceCheck.recommended,
    timeframe: maintenanceCheck.recommended ? 'after current mesocycle' : '2-3 mesocycles',
    duration: maintenanceCheck.suggestedDuration
  };
}

function predictVolumeCapacity() {
  return {
    weeksRemaining: 2,
    capacityPercentage: 75,
    limitingFactors: ['systemic_fatigue']
  };
}

function generateOutlook(report) {
  const { fatigueAnalysis, volumeAnalysis, warnings } = report;
  
  if (warnings.some(w => w.severity === 'high')) {
    return 'Immediate attention required - high fatigue or volume accumulation detected';
  } else if (fatigueAnalysis.fatigueLevel === 'moderate') {
    return 'Monitoring phase - fatigue building but manageable';
  } else {
    return 'Optimal training state - continue current programming';
  }
}

/**
 * Display weekly intelligence report in modal
 * @param {Object} report - Generated report data
 */
export function displayWeeklyIntelligenceReport(report) {
  const modal = createReportModal(report);
  document.body.appendChild(modal);
}

function createReportModal(report) {
  const modal = document.createElement('div');
  modal.className = 'intelligence-report-modal';
  modal.innerHTML = `
    <div class="modal-content large-modal">
      <div class="modal-header">
        <h2>📊 Weekly Intelligence Report</h2>
        <p class="report-date">Week ${report.metadata.week}, Block ${report.metadata.block} - ${new Date(report.metadata.reportDate).toLocaleDateString()}</p>
        <button class="modal-close" onclick="this.closest('.intelligence-report-modal').remove()">&times;</button>
      </div>
      
      <div class="modal-body">
        ${generateSummarySection(report.summary)}
        ${generateVolumeSection(report.volumeAnalysis)}
        ${generateFatigueSection(report.fatigueAnalysis)}
        ${generateRecommendationsSection(report.recommendations)}
        ${generateWarningsSection(report.warnings)}
        ${generatePredictionsSection(report.predictions)}
      </div>
      
      <div class="modal-footer">
        <button class="btn-secondary" onclick="exportReport(${JSON.stringify(report).replace(/"/g, '&quot;')})">Export Report</button>
        <button class="btn-primary" onclick="this.closest('.intelligence-report-modal').remove()">Close</button>
      </div>
    </div>
  `;
  
  return modal;
}

function generateSummarySection(summary) {
  return `
    <div class="report-section summary-section">
      <h3>Executive Summary</h3>
      <div class="status-indicator status-${summary.overallStatus}">
        Overall Status: ${summary.overallStatus.replace('_', ' ').toUpperCase()}
      </div>
      
      <div class="key-findings">
        <h4>Key Findings</h4>
        <ul>
          ${summary.keyFindings.map(finding => `<li>${finding}</li>`).join('')}
        </ul>
      </div>
      
      <div class="next-actions">
        <h4>Priority Actions</h4>
        <ol>
          ${summary.nextActions.map(action => `<li>${action}</li>`).join('')}
        </ol>
      </div>
    </div>
  `;
}

function generateVolumeSection(volumeAnalysis) {
  return `
    <div class="report-section volume-section">
      <h3>Volume Analysis</h3>
      <div class="volume-metrics">
        <div class="metric">
          <span class="metric-label">Overall Trend:</span>
          <span class="metric-value trend-${volumeAnalysis.overallTrend}">${volumeAnalysis.overallTrend}</span>
        </div>
        <div class="metric">
          <span class="metric-label">Total Volume Increase:</span>
          <span class="metric-value">${volumeAnalysis.totalVolumeIncrease} sets</span>
        </div>
        <div class="metric">
          <span class="metric-label">Muscles Near MRV:</span>
          <span class="metric-value">${volumeAnalysis.musclesNearMRV.length}</span>
        </div>
      </div>
      
      <div class="muscle-details">
        <h4>Muscle Group Details</h4>
        <div class="muscle-grid">
          ${Object.entries(volumeAnalysis.muscleChanges).map(([muscle, data]) => `
            <div class="muscle-card ${data.status}">
              <div class="muscle-name">${muscle}</div>
              <div class="volume-change">${data.previous} → ${data.current} sets (${data.change > 0 ? '+' : ''}${data.change})</div>
              <div class="mrv-percentage">${data.percentageOfMRV}% of MRV</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

function generateFatigueSection(fatigueAnalysis) {
  return `
    <div class="report-section fatigue-section">
      <h3>Fatigue Analysis</h3>
      <div class="fatigue-overview">
        <div class="fatigue-gauge">
          <div class="gauge-value fatigue-${fatigueAnalysis.fatigueLevel}">${fatigueAnalysis.fatiguePercentage}%</div>
          <div class="gauge-label">System Fatigue</div>
        </div>
        
        <div class="fatigue-metrics">
          <div class="metric">
            <span class="metric-label">Fatigue Level:</span>
            <span class="metric-value fatigue-${fatigueAnalysis.fatigueLevel}">${fatigueAnalysis.fatigueLevel}</span>
          </div>
          <div class="metric">
            <span class="metric-label">Consecutive MRV Weeks:</span>
            <span class="metric-value">${fatigueAnalysis.consecutiveMRVWeeks}</span>
          </div>
          <div class="metric">
            <span class="metric-label">Muscles Needing Recovery:</span>
            <span class="metric-value">${fatigueAnalysis.musclesNeedingRecovery}</span>
          </div>
          <div class="metric">
            <span class="metric-label">Risk Level:</span>
            <span class="metric-value risk-${fatigueAnalysis.riskLevel}">${fatigueAnalysis.riskLevel}</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

function generateRecommendationsSection(recommendations) {
  return `
    <div class="report-section recommendations-section">
      <h3>Recommendations</h3>
      <div class="recommendations-list">
        ${recommendations.map(rec => `
          <div class="recommendation priority-${rec.priority}">
            <div class="rec-header">
              <span class="rec-category">${rec.category.toUpperCase()}</span>
              <span class="rec-priority priority-${rec.priority}">${rec.priority}</span>
            </div>
            <div class="rec-action">${rec.action}</div>
            <div class="rec-detail">${rec.detail}</div>
            <div class="rec-timeframe">Timeframe: ${rec.timeframe}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function generateWarningsSection(warnings) {
  if (warnings.length === 0) {
    return `
      <div class="report-section warnings-section">
        <h3>Warnings</h3>
        <div class="no-warnings">✅ No warnings detected</div>
      </div>
    `;
  }
  
  return `
    <div class="report-section warnings-section">
      <h3>Warnings</h3>
      <div class="warnings-list">
        ${warnings.map(warning => `
          <div class="warning severity-${warning.severity}">
            <div class="warning-type">${warning.type.toUpperCase()}</div>
            <div class="warning-message">${warning.message}</div>
            <div class="warning-impact">Impact: ${warning.impact}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function generatePredictionsSection(predictions) {
  return `
    <div class="report-section predictions-section">
      <h3>Predictions</h3>
      <div class="predictions-grid">
        <div class="prediction-card">
          <h4>Deload Timing</h4>
          <div class="prediction-value">${predictions.deloadTiming.estimatedWeeks} weeks</div>
          <div class="prediction-confidence">Confidence: ${predictions.deloadTiming.confidence}</div>
        </div>
        
        <div class="prediction-card">
          <h4>Plateau Risk</h4>
          <div class="prediction-value risk-${predictions.plateauRisk.risk}">${predictions.plateauRisk.risk}</div>
          <div class="prediction-timeframe">${predictions.plateauRisk.timeframe}</div>
        </div>
        
        <div class="prediction-card">
          <h4>Maintenance Need</h4>
          <div class="prediction-value">${predictions.maintenanceNeed.recommended ? 'Recommended' : 'Not needed'}</div>
          <div class="prediction-timeframe">${predictions.maintenanceNeed.timeframe}</div>
        </div>
        
        <div class="prediction-card">
          <h4>Volume Capacity</h4>
          <div class="prediction-value">${predictions.volumeCapacity.capacityPercentage}%</div>
          <div class="prediction-timeframe">${predictions.volumeCapacity.weeksRemaining} weeks remaining</div>
        </div>
      </div>
    </div>
  `;
}

// Global function for export (called from modal)
window.exportReport = function(report) {
  const reportText = generateTextReport(report);
  const blob = new Blob([reportText], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `weekly-intelligence-report-week-${report.metadata.week}-block-${report.metadata.block}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  window.URL.revokeObjectURL(url);
};

function generateTextReport(report) {
  return `
WEEKLY INTELLIGENCE REPORT
Week ${report.metadata.week}, Block ${report.metadata.block}
Generated: ${new Date(report.metadata.reportDate).toLocaleString()}

EXECUTIVE SUMMARY
================
Overall Status: ${report.summary.overallStatus.replace('_', ' ').toUpperCase()}

Key Findings:
${report.summary.keyFindings.map(f => `• ${f}`).join('\n')}

Priority Actions:
${report.summary.nextActions.map((a, i) => `${i + 1}. ${a}`).join('\n')}

VOLUME ANALYSIS
===============
Overall Trend: ${report.volumeAnalysis.overallTrend}
Total Volume Increase: ${report.volumeAnalysis.totalVolumeIncrease} sets
Muscles Near MRV: ${report.volumeAnalysis.musclesNearMRV.length}

FATIGUE ANALYSIS
================
System Fatigue: ${report.fatigueAnalysis.fatiguePercentage}% (${report.fatigueAnalysis.fatigueLevel})
Consecutive MRV Weeks: ${report.fatigueAnalysis.consecutiveMRVWeeks}
Risk Level: ${report.fatigueAnalysis.riskLevel}

RECOMMENDATIONS
===============
${report.recommendations.map(rec => 
  `${rec.priority.toUpperCase()}: ${rec.action}\n  ${rec.detail}\n  Timeframe: ${rec.timeframe}`
).join('\n\n')}

${report.warnings.length > 0 ? `
WARNINGS
========
${report.warnings.map(w => `${w.severity.toUpperCase()}: ${w.message}\n  Impact: ${w.impact}`).join('\n\n')}
` : ''}

Generated by PowerHouse Tracker - Renaissance Periodization Intelligence System
  `;
}
