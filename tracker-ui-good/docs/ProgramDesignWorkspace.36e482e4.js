!(function (e, a, i, t, n, s, l, o) {
  var c =
      "undefined" != typeof globalThis
        ? globalThis
        : "undefined" != typeof self
          ? self
          : "undefined" != typeof window
            ? window
            : "undefined" != typeof global
              ? global
              : {},
    r = "function" == typeof c[t] && c[t],
    d = r.i || {},
    v = r.cache || {},
    u =
      "undefined" != typeof module &&
      "function" == typeof module.require &&
      module.require.bind(module);
  function p(a, i) {
    if (!v[a]) {
      if (!e[a]) {
        if (n[a]) return n[a];
        var s = "function" == typeof c[t] && c[t];
        if (!i && s) return s(a, !0);
        if (r) return r(a, !0);
        if (u && "string" == typeof a) return u(a);
        var l = Error("Cannot find module '" + a + "'");
        throw ((l.code = "MODULE_NOT_FOUND"), l);
      }
      (d.resolve = function (i) {
        var t = e[a][1][i];
        return null != t ? t : i;
      }),
        (d.cache = {});
      var o = (v[a] = new p.Module(a));
      e[a][0].call(o.exports, d, o, o.exports, c);
    }
    return v[a].exports;
    function d(e) {
      var a = d.resolve(e);
      return !1 === a ? {} : p(a);
    }
  }
  (p.isParcelRequire = !0),
    (p.Module = function (e) {
      (this.id = e), (this.bundle = p), (this.require = u), (this.exports = {});
    }),
    (p.modules = e),
    (p.cache = v),
    (p.parent = r),
    (p.distDir = void 0),
    (p.publicUrl = void 0),
    (p.devServer = void 0),
    (p.i = d),
    (p.register = function (a, i) {
      e[a] = [
        function (e, a) {
          a.exports = i;
        },
        {},
      ];
    }),
    Object.defineProperty(p, "root", {
      get: function () {
        return c[t];
      },
    }),
    (c[t] = p);
  for (var h = 0; h < a.length; h++) p(a[h]);
  if (i) {
    var m = p(i);
    "object" == typeof exports && "undefined" != typeof module
      ? (module.exports = m)
      : "function" == typeof define &&
        define.amd &&
        define(function () {
          return m;
        });
  }
})(
  {
    "5fv1I": [
      function (e, a, i, t) {
        var n = e("@parcel/transformer-js/src/esmodule-helpers.js");
        n.defineInteropFlag(i),
          n.export(i, "EnhancedAdvancedUI", () => l),
          n.export(i, "enhancedUI", () => o),
          e("../algorithms/dataVisualization.js"),
          e("../algorithms/wellnessIntegration.js"),
          e("../algorithms/periodizationSystem.js");
        var s = e("../algorithms/intelligenceHub.js");
        class l {
          constructor() {
            (this.activeCharts = new Map()),
              (this.dashboardState = this.initializeDashboardState()),
              (this.notifications = this.initializeNotificationSystem());
          }
          initializeDashboardState() {
            return {
              activeTab: "overview",
              chartConfigs: new Map(),
              refreshRate: 5e3,
              autoRefresh: !1,
              fullscreen: !1,
              theme: "light",
            };
          }
          initializeNotificationSystem() {
            return {
              queue: [],
              displayed: new Set(),
              types: {
                info: { icon: "ℹ️", color: "#3b82f6" },
                success: { icon: "✅", color: "#10b981" },
                warning: { icon: "⚠️", color: "#f59e0b" },
                error: { icon: "❌", color: "#ef4444" },
                insight: { icon: "\uD83D\uDCA1", color: "#8b5cf6" },
              },
            };
          }
          createAdvancedDashboard() {
            let e = document.createElement("div");
            return (
              (e.className = "advanced-dashboard"),
              (e.innerHTML = `
      <div class="dashboard-header">
        <h2>\u{1F3AF} Advanced Training Dashboard</h2>
        <div class="dashboard-controls">
          <button onclick="enhancedUI.toggleFullscreen()" class="control-btn">
            <span id="fullscreenIcon">\u{26F6}</span> Fullscreen
          </button>
          <button onclick="enhancedUI.exportDashboard()" class="control-btn">
            \u{1F4CA} Export
          </button>
          <button onclick="enhancedUI.refreshDashboard()" class="control-btn">
            \u{1F504} Refresh
          </button>
        </div>
      </div>

      <div class="dashboard-navigation">
        <nav class="tab-navigation">
          <button class="tab-btn active" onclick="enhancedUI.switchTab('overview')">\u{1F4C8} Overview</button>
          <button class="tab-btn" onclick="enhancedUI.switchTab('analytics')">\u{1F52C} Analytics</button>
          <button class="tab-btn" onclick="enhancedUI.switchTab('wellness')">\u{1F49A} Wellness</button>
          <button class="tab-btn" onclick="enhancedUI.switchTab('planning')">\u{1F4C5} Planning</button>
          <button class="tab-btn" onclick="enhancedUI.switchTab('insights')">\u{1F9E0} Insights</button>
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
    `),
              e
            );
          }
          createOverviewTab() {
            return `
      <div class="tab-content active" id="overview-tab">
        <div class="overview-grid">
          <!-- Key Metrics Panel -->
          <div class="metric-panel">
            <h3>\u{1F4CA} Key Metrics</h3>
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
            <h3>\u{1F4C8} Performance Trends</h3>
            <canvas id="performanceTrendChart" width="400" height="200"></canvas>
          </div>

          <!-- Volume Distribution -->
          <div class="chart-panel">
            <h3>\u{1F3CB}\u{FE0F} Volume Distribution</h3>
            <canvas id="volumeDistributionChart" width="400" height="200"></canvas>
          </div>

          <!-- Recent Achievements -->
          <div class="achievements-panel">
            <h3>\u{1F3C6} Recent Achievements</h3>
            <div id="achievementsList" class="achievements-list">
              <!-- Achievements populated dynamically -->
            </div>
          </div>

          <!-- Action Items -->
          <div class="action-panel">
            <h3>\u{26A1} Priority Actions</h3>
            <div id="actionItems" class="action-items">
              <!-- Action items populated dynamically -->
            </div>
          </div>

          <!-- System Status -->
          <div class="status-panel">
            <h3>\u{2699}\u{FE0F} System Status</h3>
            <div class="status-indicators">
              <div class="status-item">
                <span id="analyticsStatusAdv">\u{274C}</span>
                <span>Advanced Analytics</span>
              </div>
              <div class="status-item">
                <span id="wellnessStatusAdv">\u{274C}</span>
                <span>Wellness Integration</span>
              </div>
              <div class="status-item">
                <span id="planningStatusAdv">\u{274C}</span>
                <span>Auto-Planning</span>
              </div>
              <div class="status-item">
                <span id="intelligenceStatusAdv">\u{274C}</span>
                <span>AI Intelligence</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
          }
          createAnalyticsTab() {
            return `
      <div class="tab-content" id="analytics-tab">
        <div class="analytics-grid">
          <!-- Predictive Analytics -->
          <div class="analytics-section">
            <h3>\u{1F52E} Predictive Analytics</h3>
            <div class="analytics-controls">
              <button onclick="enhancedUI.generatePredictiveChart()" class="analytics-btn">
                \u{1F4CA} Performance Prediction
              </button>
              <button onclick="enhancedUI.analyzeVolumeOptimization()" class="analytics-btn">
                \u{1F3AF} Volume Optimization
              </button>
              <button onclick="enhancedUI.detectPlateauRisk()" class="analytics-btn">
                \u{26A0}\u{FE0F} Plateau Analysis
              </button>
            </div>
            <div class="chart-container">
              <canvas id="predictiveChart" width="600" height="300"></canvas>
            </div>
          </div>

          <!-- Advanced Visualizations -->
          <div class="analytics-section">
            <h3>\u{1F4C8} Advanced Visualizations</h3>
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
            <h3>\u{1F4CA} Statistical Analysis</h3>
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
          createWellnessTab() {
            return `
      <div class="tab-content" id="wellness-tab">
        <div class="wellness-grid">
          <!-- Wellness Input Panel -->
          <div class="wellness-input-panel">
            <h3>\u{1F4DD} Daily Wellness Check-in</h3>
            <form id="wellnessForm" class="wellness-form">
              <div class="form-section">
                <h4>\u{1F634} Sleep Quality</h4>
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
                <h4>\u{1F630} Stress Levels</h4>
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
                <h4>\u{1F957} Nutrition & Hydration</h4>
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
                \u{1F4BE} Save Wellness Data
              </button>
            </form>
          </div>

          <!-- Wellness Dashboard -->
          <div class="wellness-dashboard">
            <h3>\u{1F3AF} Wellness Overview</h3>
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
            <h3>\u{1F3AF} Training Recommendations</h3>
            <div id="trainingRecommendations" class="recommendations-content">
              <!-- Recommendations populated dynamically -->
            </div>
          </div>

          <!-- Wellness Trends -->
          <div class="wellness-trends">
            <h3>\u{1F4C8} Wellness Trends</h3>
            <canvas id="wellnessTrendChart" width="500" height="250"></canvas>
          </div>
        </div>
      </div>
    `;
          }
          createPlanningTab() {
            return `
      <div class="tab-content" id="planning-tab">
        <div class="planning-grid">
          <!-- Plan Creation -->
          <div class="plan-creation-panel">
            <h3>\u{1F3AF} Create Training Plan</h3>
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
                \u{1F680} Generate Intelligent Plan
              </button>
            </form>
          </div>

          <!-- Current Plan Overview -->
          <div class="current-plan-panel">
            <h3>\u{1F4CB} Current Plan</h3>
            <div id="currentPlanOverview" class="plan-overview">
              <!-- Plan overview populated dynamically -->
            </div>
          </div>

          <!-- Plan Timeline -->
          <div class="plan-timeline-panel">
            <h3>\u{1F4C5} Plan Timeline</h3>
            <div id="planTimeline" class="timeline-container">
              <!-- Timeline populated dynamically -->
            </div>
          </div>

          <!-- Adaptation Controls -->
          <div class="adaptation-panel">
            <h3>\u{1F527} Plan Adaptations</h3>
            <div class="adaptation-controls">
              <button onclick="enhancedUI.adaptPlanForPerformance()" class="adapt-btn">
                \u{1F4C8} Adapt for Performance
              </button>
              <button onclick="enhancedUI.adaptPlanForRecovery()" class="adapt-btn">
                \u{1F49A} Adapt for Recovery
              </button>
              <button onclick="enhancedUI.triggerIntelligentDeload()" class="adapt-btn">
                \u{1F6D1} Trigger Deload
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
          createInsightsTab() {
            return `
      <div class="tab-content" id="insights-tab">
        <div class="insights-grid">
          <!-- AI Insights -->
          <div class="ai-insights-panel">
            <h3>\u{1F9E0} AI Training Insights</h3>
            <div class="insights-controls">
              <button onclick="enhancedUI.generateAIInsights()" class="insights-btn">
                \u{1F52E} Generate Insights
              </button>
              <button onclick="enhancedUI.analyzeTrainingPatterns()" class="insights-btn">
                \u{1F4CA} Pattern Analysis
              </button>
              <button onclick="enhancedUI.predictOptimizations()" class="insights-btn">
                \u{1F3AF} Optimization Opportunities
              </button>
            </div>
            <div id="aiInsightsContent" class="insights-content">
              <!-- AI insights populated dynamically -->
            </div>
          </div>

          <!-- Performance Analysis -->
          <div class="performance-analysis-panel">
            <h3>\u{1F4C8} Performance Analysis</h3>
            <div id="performanceAnalysis" class="analysis-content">
              <!-- Performance analysis populated dynamically -->
            </div>
          </div>

          <!-- Trend Predictions -->
          <div class="predictions-panel">
            <h3>\u{1F52E} Trend Predictions</h3>
            <canvas id="predictionChart" width="500" height="300"></canvas>
          </div>

          <!-- Risk Assessment -->
          <div class="risk-assessment-panel">
            <h3>\u{26A0}\u{FE0F} Risk Assessment</h3>
            <div id="riskAssessment" class="risk-content">
              <!-- Risk assessment populated dynamically -->
            </div>
          </div>
        </div>
      </div>
    `;
          }
          initializeEnhancedUI() {
            this.setupEventListeners(),
              this.initializeCharts(),
              this.startAutoRefresh(),
              this.loadDashboardData(),
              console.log(
                "\uD83D\uDE80 Enhanced Advanced UI System Initialized",
              );
          }
          setupEventListeners() {
            document.addEventListener("input", (e) => {
              if ("range" === e.target.type) {
                let a = document.getElementById(e.target.id + "Value");
                a && (a.textContent = e.target.value);
              }
            }),
              document.addEventListener("click", (e) => {
                e.target.classList.contains("tab-btn") &&
                  this.handleTabClick(e.target);
              }),
              document.addEventListener("change", (e) => {
                e.target.closest("#wellnessForm") &&
                  this.autoSaveWellnessData();
              });
          }
          switchTab(e) {
            document
              .querySelectorAll(".tab-btn")
              .forEach((e) => e.classList.remove("active")),
              document
                .querySelector(`.tab-btn[onclick*="${e}"]`)
                .classList.add("active"),
              document
                .querySelectorAll(".tab-content")
                .forEach((e) => e.classList.remove("active")),
              document.getElementById(`${e}-tab`).classList.add("active"),
              this.loadTabData(e),
              (this.dashboardState.activeTab = e);
          }
          loadTabData(e) {
            switch (e) {
              case "overview":
                this.loadOverviewData();
                break;
              case "analytics":
                this.loadAnalyticsData();
                break;
              case "wellness":
                this.loadWellnessData();
                break;
              case "planning":
                this.loadPlanningData();
                break;
              case "insights":
                this.loadInsightsData();
            }
          }
          generateAIInsights() {
            let e = s.advancedIntelligence.getWeeklyIntelligence(),
              a = document.getElementById("aiInsightsContent"),
              i = '<div class="insights-list">';
            e.recommendations.length > 0 &&
              ((i += "<h4>\uD83C\uDFAF Recommendations</h4>"),
              e.recommendations.forEach((e) => {
                i += `<div class="insight-item ${e.urgency}">
          <strong>${e.type}:</strong> ${e.message}
        </div>`;
              })),
              e.analytics &&
                ((i += "<h4>\uD83D\uDCCA Analytics Insights</h4>"),
                Object.entries(
                  e.analytics.volumeLandmarkOptimizations || {},
                ).forEach(([e, a]) => {
                  i += `<div class="insight-item success">
          <strong>${e}:</strong> Volume landmarks can be optimized (${a.confidence}% confidence)
        </div>`;
                })),
              (a.innerHTML = i += "</div>"),
              this.showNotification(
                "AI insights generated successfully",
                "success",
              );
          }
          showNotification(e, a = "info") {
            let i = document.createElement("div");
            (i.className = `notification ${a}`),
              (i.innerHTML = `
      <span class="notification-icon">${this.notifications.types[a].icon}</span>
      <span class="notification-message">${e}</span>
      <button class="notification-close" onclick="this.parentElement.remove()">\xd7</button>
    `),
              document.getElementById("notificationArea").appendChild(i),
              setTimeout(() => {
                i.parentElement && i.remove();
              }, 5e3);
          }
          exportDashboard() {
            let e = this.collectDashboardData(),
              a = new Blob(
                [
                  JSON.stringify(
                    { timestamp: new Date().toISOString(), data: e },
                    null,
                    2,
                  ),
                ],
                { type: "application/json" },
              ),
              i = URL.createObjectURL(a),
              t = document.createElement("a");
            (t.href = i),
              (t.download = `training-dashboard-${new Date().toISOString().split("T")[0]}.json`),
              t.click(),
              this.showNotification(
                "Dashboard data exported successfully",
                "success",
              );
          }
          collectDashboardData() {
            return {
              overview: this.getOverviewData(),
              analytics: this.getAnalyticsData(),
              wellness: this.getWellnessData(),
              planning: this.getPlanningData(),
              insights: this.getInsightsData(),
            };
          }
        }
        let o = new l();
        window.enhancedUI = o;
      },
      {
        "../algorithms/dataVisualization.js": "ewacr",
        "../algorithms/wellnessIntegration.js": "baIS0",
        "../algorithms/periodizationSystem.js": "gvkvx",
        "../algorithms/intelligenceHub.js": "bDUtg",
        "@parcel/transformer-js/src/esmodule-helpers.js": "91HVb",
      },
    ],
  },
  ["5fv1I"],
  "5fv1I",
  "parcelRequire66c8",
  {},
);
//# sourceMappingURL=ProgramDesignWorkspace.36e482e4.js.map
