/**
 * Enhanced Advanced UI Integration
 * Sophisticated interface for next-level features
 */

import { dataVisualizer } from '../algorithms/dataVisualization.js';
import { wellnessSystem } from '../algorithms/wellnessIntegration.js';
import { periodizationSystem } from '../algorithms/periodizationSystem.js';
import { advancedIntelligence } from '../algorithms/intelligenceHub.js';

/**
 * Enhanced Advanced UI System
 * Manages sophisticated interfaces for advanced features
 */
class EnhancedAdvancedUI {
  constructor() {
    this.activeCharts = new Map();
    this.dashboardState = this.initializeDashboardState();
    this.notifications = this.initializeNotificationSystem();
  }

  /**
   * Initialize dashboard state
   */
  initializeDashboardState() {
    return {
      activeTab: 'overview',
      chartConfigs: new Map(),
      refreshRate: 5000, // 5 seconds
      autoRefresh: false,
      fullscreen: false,
      theme: 'light'
    };
  }

  /**
   * Initialize notification system
   */
  initializeNotificationSystem() {
    return {
      queue: [],
      displayed: new Set(),
      types: {
        info: { icon: 'ℹ️', color: '#3b82f6' },
        success: { icon: '✅', color: '#10b981' },
        warning: { icon: '⚠️', color: '#f59e0b' },
        error: { icon: '❌', color: '#ef4444' },
        insight: { icon: '💡', color: '#8b5cf6' }
      }
    };
  }

  /**
   * Create comprehensive training dashboard
   */
  createAdvancedDashboard() {
    const dashboard = document.createElement('div');
    dashboard.className = 'advanced-dashboard';
    dashboard.innerHTML = `
      <div class="dashboard-header">
        <h2>🎯 Advanced Training Dashboard</h2>
        <div class="dashboard-controls">
          <button onclick="enhancedUI.toggleFullscreen()" class="control-btn">
            <span id="fullscreenIcon">⛶</span> Fullscreen
          </button>
          <button onclick="enhancedUI.exportDashboard()" class="control-btn">
            📊 Export
          </button>
          <button onclick="enhancedUI.refreshDashboard()" class="control-btn">
            🔄 Refresh
          </button>
        </div>
      </div>

      <div class="dashboard-navigation">
        <nav class="tab-navigation">
          <button class="tab-btn active" onclick="enhancedUI.switchTab('overview')">📈 Overview</button>
          <button class="tab-btn" onclick="enhancedUI.switchTab('analytics')">🔬 Analytics</button>
          <button class="tab-btn" onclick="enhancedUI.switchTab('wellness')">💚 Wellness</button>
          <button class="tab-btn" onclick="enhancedUI.switchTab('planning')">📅 Planning</button>
          <button class="tab-btn" onclick="enhancedUI.switchTab('insights')">🧠 Insights</button>
        </nav>
      </div>

      <div class="dashboard-content">
        ${this.createOverviewTab()}
        ${this.createAnalyticsTab()}
        ${this.createWellnessTab()}
        ${this.createPlanningTab()}
        ${this.createInsightsTab()}
      </div>

      <div class="notification-area" id="notificationArea"></div>
    `;

    return dashboard;
  }

  /**
   * Create overview tab content
   */
  createOverviewTab() {
    return `
      <div class="tab-content active" id="overview-tab">
        <div class="overview-grid">
          <!-- Key Metrics Panel -->
          <div class="metric-panel">
            <h3>📊 Key Metrics</h3>
            <div class="metrics-grid">
              <div class="metric-card">
                <div class="metric-value" id="currentPerformance">--</div>
                <div class="metric-label">Performance Score</div>
              </div>
              <div class="metric-card">
                <div class="metric-value" id="recoveryScore">--</div>
                <div class="metric-label">Recovery Score</div>
              </div>
              <div class="metric-card">
                <div class="metric-value" id="readinessScore">--</div>
                <div class="metric-label">Readiness Score</div>
              </div>
              <div class="metric-card">
                <div class="metric-value" id="totalVolume">--</div>
                <div class="metric-label">Weekly Volume</div>
              </div>
            </div>
          </div>

          <!-- Performance Trend Chart -->
          <div class="chart-panel">
            <h3>📈 Performance Trends</h3>
            <canvas id="performanceTrendChart" width="400" height="200"></canvas>
          </div>

          <!-- Volume Distribution -->
          <div class="chart-panel">
            <h3>🏋️ Volume Distribution</h3>
            <canvas id="volumeDistributionChart" width="400" height="200"></canvas>
          </div>

          <!-- Recent Achievements -->
          <div class="achievements-panel">
            <h3>🏆 Recent Achievements</h3>
            <div id="achievementsList" class="achievements-list">
              <!-- Achievements populated dynamically -->
            </div>
          </div>

          <!-- Action Items -->
          <div class="action-panel">
            <h3>⚡ Priority Actions</h3>
            <div id="actionItems" class="action-items">
              <!-- Action items populated dynamically -->
            </div>
          </div>

          <!-- System Status -->
          <div class="status-panel">
            <h3>⚙️ System Status</h3>
            <div class="status-indicators">
              <div class="status-item">
                <span id="analyticsStatusAdv">❌</span>
                <span>Advanced Analytics</span>
              </div>
              <div class="status-item">
                <span id="wellnessStatusAdv">❌</span>
                <span>Wellness Integration</span>
              </div>
              <div class="status-item">
                <span id="planningStatusAdv">❌</span>
                <span>Auto-Planning</span>
              </div>
              <div class="status-item">
                <span id="intelligenceStatusAdv">❌</span>
                <span>AI Intelligence</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Create analytics tab content
   */
  createAnalyticsTab() {
    return `
      <div class="tab-content" id="analytics-tab">
        <div class="analytics-grid">
          <!-- Predictive Analytics -->
          <div class="analytics-section">
            <h3>🔮 Predictive Analytics</h3>
            <div class="analytics-controls">
              <button onclick="enhancedUI.generatePredictiveChart()" class="analytics-btn">
                📊 Performance Prediction
              </button>
              <button onclick="enhancedUI.analyzeVolumeOptimization()" class="analytics-btn">
                🎯 Volume Optimization
              </button>
              <button onclick="enhancedUI.detectPlateauRisk()" class="analytics-btn">
                ⚠️ Plateau Analysis
              </button>
            </div>
            <div class="chart-container">
              <canvas id="predictiveChart" width="600" height="300"></canvas>
            </div>
          </div>

          <!-- Advanced Visualizations -->
          <div class="analytics-section">
            <h3>📈 Advanced Visualizations</h3>
            <div class="visualization-controls">
              <select id="chartTypeSelector" onchange="enhancedUI.changeChartType()">
                <option value="trend">Trend Analysis</option>
                <option value="heatmap">Volume Heatmap</option>
                <option value="radar">Muscle Distribution</option>
                <option value="correlation">Correlation Matrix</option>
              </select>
              <select id="timeRangeSelector" onchange="enhancedUI.changeTimeRange()">
                <option value="4">Last 4 Weeks</option>
                <option value="8">Last 8 Weeks</option>
                <option value="12">Last 12 Weeks</option>
                <option value="all">All Time</option>
              </select>
            </div>
            <div class="chart-container">
              <canvas id="advancedVisualizationChart" width="600" height="400"></canvas>
            </div>
          </div>

          <!-- Statistical Analysis -->
          <div class="analytics-section">
            <h3>📊 Statistical Analysis</h3>
            <div class="stats-grid">
              <div class="stat-card">
                <h4>Performance Statistics</h4>
                <div id="performanceStats" class="stat-content">
                  <!-- Stats populated dynamically -->
                </div>
              </div>
              <div class="stat-card">
                <h4>Volume Statistics</h4>
                <div id="volumeStats" class="stat-content">
                  <!-- Stats populated dynamically -->
                </div>
              </div>
              <div class="stat-card">
                <h4>Recovery Statistics</h4>
                <div id="recoveryStats" class="stat-content">
                  <!-- Stats populated dynamically -->
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Create wellness tab content
   */
  createWellnessTab() {
    return `
      <div class="tab-content" id="wellness-tab">
        <div class="wellness-grid">
          <!-- Wellness Input Panel -->
          <div class="wellness-input-panel">
            <h3>📝 Daily Wellness Check-in</h3>
            <form id="wellnessForm" class="wellness-form">
              <div class="form-section">
                <h4>😴 Sleep Quality</h4>
                <div class="input-group">
                  <label for="sleepDuration">Duration (hours):</label>
                  <input type="number" id="sleepDuration" min="4" max="12" step="0.5" value="7.5">
                </div>
                <div class="input-group">
                  <label for="sleepQuality">Quality (1-10):</label>
                  <input type="range" id="sleepQuality" min="1" max="10" value="7">
                  <span class="range-value" id="sleepQualityValue">7</span>
                </div>
              </div>

              <div class="form-section">
                <h4>😰 Stress Levels</h4>
                <div class="input-group">
                  <label for="workStress">Work Stress (1-10):</label>
                  <input type="range" id="workStress" min="1" max="10" value="5">
                  <span class="range-value" id="workStressValue">5</span>
                </div>
                <div class="input-group">
                  <label for="lifeStress">Life Stress (1-10):</label>
                  <input type="range" id="lifeStress" min="1" max="10" value="4">
                  <span class="range-value" id="lifeStressValue">4</span>
                </div>
              </div>

              <div class="form-section">
                <h4>🥗 Nutrition & Hydration</h4>
                <div class="input-group">
                  <label for="hydration">Hydration (1-10):</label>
                  <input type="range" id="hydration" min="1" max="10" value="7">
                  <span class="range-value" id="hydrationValue">7</span>
                </div>
                <div class="input-group">
                  <label for="nutritionQuality">Nutrition Quality (1-10):</label>
                  <input type="range" id="nutritionQuality" min="1" max="10" value="7">
                  <span class="range-value" id="nutritionQualityValue">7</span>
                </div>
              </div>

              <button type="button" onclick="enhancedUI.submitWellnessData()" class="submit-btn">
                💾 Save Wellness Data
              </button>
            </form>
          </div>

          <!-- Wellness Dashboard -->
          <div class="wellness-dashboard">
            <h3>🎯 Wellness Overview</h3>
            <div class="wellness-scores">
              <div class="score-card">
                <div class="score-value" id="wellnessRecoveryScore">--</div>
                <div class="score-label">Recovery Score</div>
              </div>
              <div class="score-card">
                <div class="score-value" id="wellnessReadinessScore">--</div>
                <div class="score-label">Readiness Score</div>
              </div>
              <div class="score-card">
                <div class="score-value" id="wellnessStressScore">--</div>
                <div class="score-label">Stress Score</div>
              </div>
            </div>
          </div>

          <!-- Training Recommendations -->
          <div class="training-recommendations">
            <h3>🎯 Training Recommendations</h3>
            <div id="trainingRecommendations" class="recommendations-content">
              <!-- Recommendations populated dynamically -->
            </div>
          </div>

          <!-- Wellness Trends -->
          <div class="wellness-trends">
            <h3>📈 Wellness Trends</h3>
            <canvas id="wellnessTrendChart" width="500" height="250"></canvas>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Create planning tab content
   */
  createPlanningTab() {
    return `
      <div class="tab-content" id="planning-tab">
        <div class="planning-grid">
          <!-- Plan Creation -->
          <div class="plan-creation-panel">
            <h3>🎯 Create Training Plan</h3>
            <form id="planningForm" class="planning-form">
              <div class="form-group">
                <label for="planDuration">Plan Duration:</label>
                <select id="planDuration">
                  <option value="8">8 Weeks</option>
                  <option value="12">12 Weeks</option>
                  <option value="16" selected>16 Weeks</option>
                  <option value="20">20 Weeks</option>
                  <option value="24">24 Weeks</option>
                </select>
              </div>

              <div class="form-group">
                <label for="primaryGoal">Primary Goal:</label>
                <select id="primaryGoal">
                  <option value="hypertrophy">Hypertrophy</option>
                  <option value="strength">Strength</option>
                  <option value="powerbuilding">Powerbuilding</option>
                  <option value="endurance">Endurance</option>
                  <option value="general">General Fitness</option>
                </select>
              </div>

              <div class="form-group">
                <label for="experienceLevel">Experience Level:</label>
                <select id="experienceLevel">
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div class="form-group">
                <label for="trainingDays">Training Days per Week:</label>
                <select id="trainingDays">
                  <option value="3">3 Days</option>
                  <option value="4">4 Days</option>
                  <option value="5">5 Days</option>
                  <option value="6">6 Days</option>
                </select>
              </div>

              <button type="button" onclick="enhancedUI.generateTrainingPlan()" class="generate-btn">
                🚀 Generate Intelligent Plan
              </button>
            </form>
          </div>

          <!-- Current Plan Overview -->
          <div class="current-plan-panel">
            <h3>📋 Current Plan</h3>
            <div id="currentPlanOverview" class="plan-overview">
              <!-- Plan overview populated dynamically -->
            </div>
          </div>

          <!-- Plan Timeline -->
          <div class="plan-timeline-panel">
            <h3>📅 Plan Timeline</h3>
            <div id="planTimeline" class="timeline-container">
              <!-- Timeline populated dynamically -->
            </div>
          </div>

          <!-- Adaptation Controls -->
          <div class="adaptation-panel">
            <h3>🔧 Plan Adaptations</h3>
            <div class="adaptation-controls">
              <button onclick="enhancedUI.adaptPlanForPerformance()" class="adapt-btn">
                📈 Adapt for Performance
              </button>
              <button onclick="enhancedUI.adaptPlanForRecovery()" class="adapt-btn">
                💚 Adapt for Recovery
              </button>
              <button onclick="enhancedUI.triggerIntelligentDeload()" class="adapt-btn">
                🛑 Trigger Deload
              </button>
            </div>
            <div id="adaptationResults" class="adaptation-results">
              <!-- Adaptation results populated dynamically -->
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Create insights tab content
   */
  createInsightsTab() {
    return `
      <div class="tab-content" id="insights-tab">
        <div class="insights-grid">
          <!-- AI Insights -->
          <div class="ai-insights-panel">
            <h3>🧠 AI Training Insights</h3>
            <div class="insights-controls">
              <button onclick="enhancedUI.generateAIInsights()" class="insights-btn">
                🔮 Generate Insights
              </button>
              <button onclick="enhancedUI.analyzeTrainingPatterns()" class="insights-btn">
                📊 Pattern Analysis
              </button>
              <button onclick="enhancedUI.predictOptimizations()" class="insights-btn">
                🎯 Optimization Opportunities
              </button>
            </div>
            <div id="aiInsightsContent" class="insights-content">
              <!-- AI insights populated dynamically -->
            </div>
          </div>

          <!-- Performance Analysis -->
          <div class="performance-analysis-panel">
            <h3>📈 Performance Analysis</h3>
            <div id="performanceAnalysis" class="analysis-content">
              <!-- Performance analysis populated dynamically -->
            </div>
          </div>

          <!-- Trend Predictions -->
          <div class="predictions-panel">
            <h3>🔮 Trend Predictions</h3>
            <canvas id="predictionChart" width="500" height="300"></canvas>
          </div>

          <!-- Risk Assessment -->
          <div class="risk-assessment-panel">
            <h3>⚠️ Risk Assessment</h3>
            <div id="riskAssessment" class="risk-content">
              <!-- Risk assessment populated dynamically -->
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Initialize the enhanced UI system
   */
  initializeEnhancedUI() {
    this.setupEventListeners();
    this.initializeCharts();
    this.startAutoRefresh();
    this.loadDashboardData();
    
    console.log('🚀 Enhanced Advanced UI System Initialized');
  }

  /**
   * Setup event listeners for interactive elements
   */
  setupEventListeners() {
    // Range input event listeners for real-time updates
    document.addEventListener('input', (event) => {
      if (event.target.type === 'range') {
        const valueSpan = document.getElementById(event.target.id + 'Value');
        if (valueSpan) {
          valueSpan.textContent = event.target.value;
        }
      }
    });

    // Tab navigation
    document.addEventListener('click', (event) => {
      if (event.target.classList.contains('tab-btn')) {
        this.handleTabClick(event.target);
      }
    });

    // Auto-save wellness data
    document.addEventListener('change', (event) => {
      if (event.target.closest('#wellnessForm')) {
        this.autoSaveWellnessData();
      }
    });
  }

  /**
   * Switch between dashboard tabs
   */
  switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.tab-btn[onclick*="${tabName}"]`).classList.add('active');

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.getElementById(`${tabName}-tab`).classList.add('active');

    // Load tab-specific data
    this.loadTabData(tabName);
    
    this.dashboardState.activeTab = tabName;
  }

  /**
   * Load data for specific tab
   */
  loadTabData(tabName) {
    switch (tabName) {
      case 'overview':
        this.loadOverviewData();
        break;
      case 'analytics':
        this.loadAnalyticsData();
        break;
      case 'wellness':
        this.loadWellnessData();
        break;
      case 'planning':
        this.loadPlanningData();
        break;
      case 'insights':
        this.loadInsightsData();
        break;
    }
  }

  /**
   * Generate AI insights
   */
  generateAIInsights() {
    const insights = advancedIntelligence.getWeeklyIntelligence();
    const content = document.getElementById('aiInsightsContent');
    
    let html = '<div class="insights-list">';
    
    if (insights.recommendations.length > 0) {
      html += '<h4>🎯 Recommendations</h4>';
      insights.recommendations.forEach(rec => {
        html += `<div class="insight-item ${rec.urgency}">
          <strong>${rec.type}:</strong> ${rec.message}
        </div>`;
      });
    }
    
    if (insights.analytics) {
      html += '<h4>📊 Analytics Insights</h4>';
      Object.entries(insights.analytics.volumeLandmarkOptimizations || {}).forEach(([muscle, opt]) => {
        html += `<div class="insight-item success">
          <strong>${muscle}:</strong> Volume landmarks can be optimized (${opt.confidence}% confidence)
        </div>`;
      });
    }
    
    html += '</div>';
    content.innerHTML = html;
    
    this.showNotification('AI insights generated successfully', 'success');
  }

  /**
   * Show notification
   */
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
      <span class="notification-icon">${this.notifications.types[type].icon}</span>
      <span class="notification-message">${message}</span>
      <button class="notification-close" onclick="this.parentElement.remove()">×</button>
    `;
    
    document.getElementById('notificationArea').appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 5000);
  }

  /**
   * Export dashboard data
   */
  exportDashboard() {
    const dashboardData = this.collectDashboardData();
    const exportData = {
      timestamp: new Date().toISOString(),
      data: dashboardData
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `training-dashboard-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    
    this.showNotification('Dashboard data exported successfully', 'success');
  }

  /**
   * Helper method to collect all dashboard data
   */
  collectDashboardData() {
    return {
      overview: this.getOverviewData(),
      analytics: this.getAnalyticsData(),
      wellness: this.getWellnessData(),
      planning: this.getPlanningData(),
      insights: this.getInsightsData()
    };
  }
}

// Create and expose singleton instance
const enhancedUI = new EnhancedAdvancedUI();

// Make globally available
window.enhancedUI = enhancedUI;

export {
  EnhancedAdvancedUI,
  enhancedUI
};
