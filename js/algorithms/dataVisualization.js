/**
 * Advanced Data Visualization and Analytics Enhancement
 * Provides sophisticated charting, trend analysis, and visual insights
 */

import trainingState from '../core/trainingState.js';

/**
 * Advanced Training Data Visualizer
 * Creates sophisticated charts and visual analytics
 */
class AdvancedDataVisualizer {
  constructor() {
    this.chartConfigs = {
      performance: this.getPerformanceChartConfig(),
      volume: this.getVolumeChartConfig(),
      fatigue: this.getFatigueChartConfig(),
      intelligence: this.getIntelligenceChartConfig()
    };
  }

  /**
   * Create comprehensive training dashboard
   * @returns {Object} - Dashboard data
   */
  createTrainingDashboard() {
    const historicalData = this.getHistoricalData();
    
    return {
      overview: this.generateOverviewMetrics(historicalData),
      trends: this.generateTrendAnalysis(historicalData),
      predictions: this.generatePredictiveAnalytics(historicalData),
      recommendations: this.generateActionableInsights(historicalData),
      visualizations: this.generateChartData(historicalData)
    };
  }

  /**
   * Generate performance trend visualization
   * @param {Array} data - Historical training data
   * @returns {Object} - Chart configuration
   */
  generatePerformanceTrendChart(data) {
    const last12Weeks = data.slice(-12);
    
    const chartData = {
      labels: last12Weeks.map(week => `Week ${week.weekNo}`),
      datasets: [
        {
          label: 'Performance Score',
          data: last12Weeks.map(week => 
            week.performance?.targetAchievement?.targetPercentage || 70
          ),
          borderColor: 'rgb(99, 102, 241)',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Fatigue Level',
          data: last12Weeks.map(week => week.fatigueScore || 5),
          borderColor: 'rgb(239, 68, 68)',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          tension: 0.4,
          yAxisID: 'y1'
        }
      ]
    };

    return {
      type: 'line',
      data: chartData,
      options: this.getAdvancedChartOptions()
    };
  }

  /**
   * Generate volume progression heatmap
   * @param {Array} data - Historical training data
   * @returns {Object} - Heatmap data
   */
  generateVolumeHeatmap(data) {
    const muscles = Object.keys(trainingState.volumeLandmarks);
    const weeks = Array.from({length: 12}, (_, i) => i + 1);
    
    const heatmapData = muscles.map(muscle => {
      return weeks.map(week => {
        const weekData = data.find(d => d.weekNo === week && d.muscle === muscle);
        const volume = weekData?.totalSets || 0;
        const landmarks = trainingState.volumeLandmarks[muscle];
        
        // Calculate intensity relative to landmarks
        let intensity = 0;
        if (volume >= landmarks.MRV) intensity = 1.0;
        else if (volume >= landmarks.MAV) intensity = 0.8;
        else if (volume >= landmarks.MEV) intensity = 0.6;
        else intensity = 0.3;
        
        return {
          x: week,
          y: muscle,
          value: volume,
          intensity: intensity
        };
      });
    }).flat();

    return {
      data: heatmapData,
      config: this.getHeatmapConfig()
    };
  }

  /**
   * Generate predictive analytics chart
   * @param {Array} data - Historical training data
   * @returns {Object} - Prediction chart
   */
  generatePredictiveChart(data) {
    const recentWeeks = data.slice(-6);
    const futureWeeks = 4;
    
    // Calculate trend lines
    const performanceTrend = this.calculateTrendLine(
      recentWeeks.map((week, i) => [i, week.performance?.targetAchievement?.targetPercentage || 70])
    );
    
    const fatigueTrend = this.calculateTrendLine(
      recentWeeks.map((week, i) => [i, week.fatigueScore || 5])
    );

    // Project future values
    const futureLabels = Array.from({length: futureWeeks}, (_, i) => 
      `Predicted Week ${recentWeeks.length + i + 1}`
    );
    
    const futurePerformance = Array.from({length: futureWeeks}, (_, i) => 
      Math.max(0, Math.min(100, performanceTrend.slope * (recentWeeks.length + i) + performanceTrend.intercept))
    );
    
    const futureFatigue = Array.from({length: futureWeeks}, (_, i) => 
      Math.max(0, Math.min(10, fatigueTrend.slope * (recentWeeks.length + i) + fatigueTrend.intercept))
    );

    return {
      type: 'line',
      data: {
        labels: [
          ...recentWeeks.map(week => `Week ${week.weekNo}`),
          ...futureLabels
        ],
        datasets: [
          {
            label: 'Historical Performance',
            data: [
              ...recentWeeks.map(week => week.performance?.targetAchievement?.targetPercentage || 70),
              ...Array(futureWeeks).fill(null)
            ],
            borderColor: 'rgb(99, 102, 241)',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            pointRadius: 5
          },
          {
            label: 'Predicted Performance',
            data: [
              ...Array(recentWeeks.length).fill(null),
              recentWeeks[recentWeeks.length - 1]?.performance?.targetAchievement?.targetPercentage || 70,
              ...futurePerformance
            ],
            borderColor: 'rgb(99, 102, 241)',
            backgroundColor: 'rgba(99, 102, 241, 0.2)',
            borderDash: [5, 5],
            pointRadius: 3
          }
        ]
      },
      options: this.getPredictiveChartOptions()
    };
  }

  /**
   * Generate muscle group comparison radar chart
   * @returns {Object} - Radar chart data
   */
  generateMuscleComparisonRadar() {
    const muscles = Object.keys(trainingState.volumeLandmarks);
    const currentWeek = trainingState.weekNo;
    
    const dataPoints = muscles.map(muscle => {
      const volumeStatus = trainingState.getVolumeStatus(muscle);
      const landmarks = trainingState.volumeLandmarks[muscle];
      const currentSets = trainingState.currentWeekSets[muscle] || 0;
      
      // Calculate percentages
      const mevPercentage = (currentSets / landmarks.MEV) * 100;
      const mavPercentage = (currentSets / landmarks.MAV) * 100;
      const mrvPercentage = (currentSets / landmarks.MRV) * 100;
      
      return {
        muscle,
        efficiency: Math.min(100, mevPercentage),
        volume: Math.min(100, mavPercentage),
        intensity: Math.min(100, mrvPercentage),
        status: this.getVolumeStatusScore(volumeStatus)
      };
    });

    return {
      type: 'radar',
      data: {
        labels: muscles,
        datasets: [{
          label: 'Current Training Distribution',
          data: dataPoints.map(point => point.efficiency),
          borderColor: 'rgb(99, 102, 241)',
          backgroundColor: 'rgba(99, 102, 241, 0.2)',
          pointBackgroundColor: 'rgb(99, 102, 241)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(99, 102, 241)'
        }]
      },
      options: this.getRadarChartOptions()
    };
  }

  /**
   * Generate interactive timeline visualization
   * @param {Array} data - Historical training data
   * @returns {Object} - Timeline data
   */
  generateTrainingTimeline(data) {
    const timeline = data.map(week => {
      const events = [];
      
      // Volume milestones
      if (week.volumeProgression?.deloadTriggered) {
        events.push({
          type: 'deload',
          title: 'Deload Week',
          description: 'Training volume reduced for recovery',
          severity: 'high'
        });
      }
      
      // Performance achievements
      if (week.performance?.targetAchievement?.grade === 'A') {
        events.push({
          type: 'achievement',
          title: 'Excellent Performance',
          description: 'Training targets exceeded',
          severity: 'success'
        });
      }
      
      // Fatigue warnings
      if (week.fatigueScore >= 7) {
        events.push({
          type: 'warning',
          title: 'High Fatigue Detected',
          description: 'Consider recovery protocols',
          severity: 'warning'
        });
      }

      return {
        week: week.weekNo,
        date: week.startTime,
        events,
        metrics: {
          totalVolume: week.totalSets || 0,
          avgPerformance: week.performance?.targetAchievement?.targetPercentage || 70,
          fatigueLevel: week.fatigueScore || 5
        }
      };
    });

    return timeline;
  }

  /**
   * Generate executive summary metrics
   * @param {Array} data - Historical training data
   * @returns {Object} - Summary metrics
   */
  generateExecutiveSummary(data) {
    const recentData = data.slice(-4);
    
    return {
      trainingConsistency: this.calculateConsistency(recentData),
      performanceTrend: this.calculatePerformanceTrend(recentData),
      volumeEfficiency: this.calculateVolumeEfficiency(recentData),
      recoveryStatus: this.calculateRecoveryStatus(recentData),
      nextActions: this.generateNextActions(recentData),
      keyInsights: this.generateKeyInsights(recentData)
    };
  }

  /**
   * Get performance chart configuration
   * @param {Array} data - Optional data array
   * @returns {Object} - Chart configuration
   */
  getPerformanceChartConfig(data = []) {
    return {
      type: 'line',
      data: {
        labels: data.map(d => `Week ${d.weekNo || '?'}`),
        datasets: [{
          label: 'Performance %',
          data: data.map(d => d.performance || 0),
          borderColor: 'rgb(54, 162, 235)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          tension: 0.3,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            title: {
              display: true,
              text: 'Performance %'
            },
            min: 0,
            max: 100
          },
          x: {
            title: {
              display: true,
              text: 'Training Period'
            }
          }
        }
      }
    };
  }

  /**
   * Get volume chart configuration
   * @param {Array} data - Optional data array
   * @returns {Object} - Chart configuration
   */
  getVolumeChartConfig(data = []) {
    return {
      type: 'bar',
      data: {
        labels: data.map(d => `Week ${d.weekNo || '?'}`),
        datasets: [{
          label: 'Weekly Volume (sets)',
          data: data.map(d => d.totalSets || 0),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgb(75, 192, 192)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            title: {
              display: true,
              text: 'Sets'
            },
            beginAtZero: true
          },
          x: {
            title: {
              display: true,
              text: 'Training Period'
            }
          }
        }
      }
    };
  }

  /**
   * Get fatigue chart configuration
   * @param {Array} data - Optional data array
   * @returns {Object} - Chart configuration
   */
  getFatigueChartConfig(data = []) {
    return {
      type: 'line',
      data: {
        labels: data.map(d => `Week ${d.weekNo || '?'}`),
        datasets: [{
          label: 'Fatigue Level',
          data: data.map(d => d.fatigueScore || 0),
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          tension: 0.2,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            title: {
              display: true,
              text: 'Fatigue Level'
            },
            min: 0,
            max: 10
          },
          x: {
            title: {
              display: true,
              text: 'Training Period'
            }
          }
        }
      }
    };
  }

  /**
   * Get intelligence chart configuration
   * @param {Array} data - Optional data array
   * @returns {Object} - Chart configuration
   */
  getIntelligenceChartConfig(data = []) {
    const defaultDataPoint = {
      technique: 7,
      mindMuscle: 6, 
      tempo: 5,
      rangeOfMotion: 7,
      consistency: 8
    };
    
    const dataPoint = data.length > 0 ? data[data.length - 1] : defaultDataPoint;
    
    return {
      type: 'radar',
      data: {
        labels: ['Technique', 'Mind-Muscle', 'Tempo', 'ROM', 'Consistency'],
        datasets: [{
          label: 'Training Intelligence',
          data: [
            dataPoint.technique || 0,
            dataPoint.mindMuscle || 0,
            dataPoint.tempo || 0,
            dataPoint.rangeOfMotion || 0,
            dataPoint.consistency || 0
          ],
          borderColor: 'rgb(153, 102, 255)',
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          pointBackgroundColor: 'rgb(153, 102, 255)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(153, 102, 255)'
        }]
      },
      options: this.getRadarChartOptions()
    };
  }

  /**
   * Get radar chart options
   * @returns {Object} - Chart options
   */
  getRadarChartOptions() {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top'
        },
        title: {
          display: true,
          text: 'Training Intelligence Analysis'
        }
      },
      scales: {
        r: {
          min: 0,
          max: 10,
          ticks: {
            stepSize: 2
          }
        }
      }
    };
  }

  /**
   * Get heatmap configuration
   * @param {Array} data - Optional data array
   * @returns {Object} - Heatmap configuration
   */
  getHeatmapConfig(data = []) {
    return {
      type: 'matrix',
      data: {
        datasets: [{
          label: 'Heatmap',
          data: data,
          backgroundColor: (ctx) => {
            // Placeholder for future color logic
            return 'rgba(75, 192, 192, 0.6)';
          }
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true
          },
          tooltip: {
            enabled: true
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Week'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Muscle Group'
            }
          }
        }
      }
    };
  }

  // Helper methods for calculations and configurations

  calculateTrendLine(points) {
    const n = points.length;
    const sumX = points.reduce((sum, point) => sum + point[0], 0);
    const sumY = points.reduce((sum, point) => sum + point[1], 0);
    const sumXY = points.reduce((sum, point) => sum + point[0] * point[1], 0);
    const sumXX = points.reduce((sum, point) => sum + point[0] * point[0], 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    return { slope, intercept };
  }

  calculateConsistency(data) {
    const sessions = data.filter(week => week.totalSets > 0);
    return (sessions.length / data.length) * 100;
  }

  calculatePerformanceTrend(data) {
    const performances = data.map(week => 
      week.performance?.targetAchievement?.targetPercentage || 70
    );
    const trend = this.calculateTrendLine(
      performances.map((perf, i) => [i, perf])
    );
    return trend.slope;
  }

  getVolumeStatusScore(status) {
    const scores = {
      'under-minimum': 25,
      'optimal': 75,
      'high': 90,
      'maximum': 100
    };
    return scores[status] || 50;
  }

  getHistoricalData() {
    const data = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('session-')) {
        try {
          const sessionData = JSON.parse(localStorage.getItem(key));
          data.push(sessionData);
        } catch (e) {
          console.warn('Failed to parse session data:', key);
        }
      }
    }
    return data.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  }

  getAdvancedChartOptions() {
    return {
      responsive: true,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: 'Training Week'
          }
        },
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          title: {
            display: true,
            text: 'Performance %'
          }
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          title: {
            display: true,
            text: 'Fatigue Level'
          },
          grid: {
            drawOnChartArea: false,
          },
        }
      }
    };
  }

  getPredictiveChartOptions() {
    return {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Performance Prediction Analysis'
        },
        legend: {
          display: true
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Training Timeline'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Performance Score'
          },
          min: 0,
          max: 100
        }
      }
    };
  }

  generateNextActions(data) {
    const actions = [];
    const latest = data[data.length - 1];
    
    if (latest?.fatigueScore >= 7) {
      actions.push('Consider deload or extra recovery day');
    }
    
    if (this.calculatePerformanceTrend(data) < -2) {
      actions.push('Review training intensity and technique');
    }
    
    if (this.calculateConsistency(data) < 75) {
      actions.push('Focus on training consistency');
    }
    
    return actions;
  }

  generateKeyInsights(data) {
    const insights = [];
    const trend = this.calculatePerformanceTrend(data);
    
    if (trend > 2) {
      insights.push('Performance is trending upward - excellent progress');
    } else if (trend < -2) {
      insights.push('Performance decline detected - review program');
    }
    
    const avgVolume = data.reduce((sum, week) => sum + (week.totalSets || 0), 0) / data.length;
    if (avgVolume > 50) {
      insights.push('High volume training detected - monitor recovery');
    }
    
    return insights;
  }
}

// Export for use in main application
export {
  AdvancedDataVisualizer
};

// Create singleton instance
export const dataVisualizer = new AdvancedDataVisualizer();
