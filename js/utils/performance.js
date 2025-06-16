/**
 * Performance Optimization Module
 * Provides comprehensive performance monitoring and optimization for the training app
 */

/**
 * Performance Manager Class
 * Handles all performance monitoring, optimization, and reporting
 */
class PerformanceManager {
  constructor() {
    this.metrics = {
      loadTimes: [],
      renderTimes: [],
      memoryUsage: [],
      userInteractions: [],
      errors: [],
    };

    this.observers = new Map();
    this.isMonitoring = false;
    this.optimizationEnabled = true;

    this.thresholds = {
      loadTime: 3000, // 3 seconds
      renderTime: 100, // 100ms
      memoryLimit: 50, // 50MB
      fpsTarget: 60, // 60 FPS
      interactionDelay: 100, // 100ms
    };
  }

  /**
   * Initialize performance monitoring
   */
  initialize() {
    if (!this.isMonitoring) {
      this.setupPerformanceObservers();
      this.setupMemoryMonitoring();
      this.setupUserInteractionTracking();
      this.setupErrorTracking();
      this.optimizeInitialLoad();
      this.isMonitoring = true;

      console.log("🚀 Performance monitoring initialized");
    }
  }

  /**
   * Setup performance observers
   */
  setupPerformanceObservers() {
    // Performance Observer for navigation timing
    if ("PerformanceObserver" in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          this.processPerformanceEntry(entry);
        });
      });

      observer.observe({
        entryTypes: ["navigation", "resource", "measure", "paint"],
      });
      this.observers.set("performance", observer);
    }

    // Intersection Observer for lazy loading optimization
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.optimizeElementVisibility(entry.target);
            }
          });
        },
        { rootMargin: "50px" },
      );

      this.observers.set("intersection", observer);
      this.setupLazyLoading(observer);
    }

    // Mutation Observer for DOM changes
    if ("MutationObserver" in window) {
      const observer = new MutationObserver((mutations) => {
        this.optimizeDOMChanges(mutations);
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["class", "style"],
      });

      this.observers.set("mutation", observer);
    }
  }

  /**
   * Process performance entries
   * @param {PerformanceEntry} entry - Performance entry
   */
  processPerformanceEntry(entry) {
    switch (entry.entryType) {
      case "navigation":
        this.handleNavigationTiming(entry);
        break;
      case "resource":
        this.handleResourceTiming(entry);
        break;
      case "measure":
        this.handleUserTiming(entry);
        break;
      case "paint":
        this.handlePaintTiming(entry);
        break;
    }
  }

  /**
   * Handle navigation timing
   * @param {PerformanceNavigationTiming} timing - Navigation timing
   */
  handleNavigationTiming(timing) {
    const metrics = {
      timestamp: Date.now(),
      loadTime: timing.loadEventEnd - timing.navigationStart,
      domContentLoaded:
        timing.domContentLoadedEventEnd - timing.navigationStart,
      firstPaint: timing.loadEventEnd - timing.navigationStart,
      networkTime: timing.responseEnd - timing.requestStart,
      renderTime: timing.loadEventEnd - timing.responseEnd,
    };

    this.metrics.loadTimes.push(metrics);

    // Check for performance issues
    if (metrics.loadTime > this.thresholds.loadTime) {
      this.reportPerformanceIssue("slow_load", metrics);
    }

    this.updatePerformanceDashboard(metrics);
  }

  /**
   * Handle resource timing
   * @param {PerformanceResourceTiming} timing - Resource timing
   */
  handleResourceTiming(timing) {
    const duration = timing.responseEnd - timing.requestStart;

    // Identify slow resources
    if (duration > 1000) {
      // 1 second
      console.warn(`🐌 Slow resource: ${timing.name} (${duration}ms)`);

      this.suggestResourceOptimization(timing);
    }

    // Track Chart.js loading specifically
    if (timing.name.includes("chart.js")) {
      this.optimizeChartLoading(timing);
    }
  }

  /**
   * Setup memory monitoring
   */
  setupMemoryMonitoring() {
    if ("memory" in performance) {
      setInterval(() => {
        const memory = performance.memory;
        const usage = {
          timestamp: Date.now(),
          used: memory.usedJSHeapSize / 1024 / 1024, // MB
          total: memory.totalJSHeapSize / 1024 / 1024, // MB
          limit: memory.jsHeapSizeLimit / 1024 / 1024, // MB
        };

        this.metrics.memoryUsage.push(usage);

        // Check for memory leaks
        if (usage.used > this.thresholds.memoryLimit) {
          this.handleMemoryPressure(usage);
        }

        // Keep only last 100 entries
        if (this.metrics.memoryUsage.length > 100) {
          this.metrics.memoryUsage.shift();
        }
      }, 10000); // Every 10 seconds
    }
  }

  /**
   * Setup user interaction tracking
   */
  setupUserInteractionTracking() {
    const interactionEvents = ["click", "keydown", "touchstart"];

    interactionEvents.forEach((eventType) => {
      document.addEventListener(
        eventType,
        (event) => {
          const start = performance.now();

          // Use requestAnimationFrame to measure interaction delay
          requestAnimationFrame(() => {
            const delay = performance.now() - start;

            this.metrics.userInteractions.push({
              timestamp: Date.now(),
              type: eventType,
              target: event.target.tagName,
              delay,
            });

            if (delay > this.thresholds.interactionDelay) {
              this.reportInteractionDelay(event, delay);
            }
          });
        },
        { passive: true },
      );
    });
  }

  /**
   * Setup error tracking
   */
  setupErrorTracking() {
    window.addEventListener("error", (event) => {
      this.metrics.errors.push({
        timestamp: Date.now(),
        message: event.message,
        filename: event.filename,
        line: event.lineno,
        column: event.colno,
        stack: event.error?.stack,
      });
    });

    window.addEventListener("unhandledrejection", (event) => {
      this.metrics.errors.push({
        timestamp: Date.now(),
        type: "promise_rejection",
        reason: event.reason,
      });
    });
  }

  /**
   * Optimize initial load
   */
  optimizeInitialLoad() {
    // Defer non-critical scripts
    this.deferNonCriticalScripts();

    // Preload critical resources
    this.preloadCriticalResources();

    // Optimize images
    this.optimizeImages();

    // Setup service worker
    this.setupServiceWorker();
  }

  /**
   * Defer non-critical scripts
   */
  deferNonCriticalScripts() {
    const scripts = document.querySelectorAll("script[src]");
    scripts.forEach((script) => {
      const src = script.src;

      // Defer analytics and non-critical scripts
      if (
        src.includes("analytics") ||
        src.includes("feedback") ||
        src.includes("chart.js")
      ) {
        script.defer = true;
      }
    });
  }

  /**
   * Preload critical resources
   */ preloadCriticalResources() {
    // All critical resources are now bundled by Parcel
    // No need to manually preload individual files
    console.log("📦 Using Parcel bundling - individual preloads not needed");
  }

  /**
   * Setup lazy loading
   * @param {IntersectionObserver} observer - Intersection observer
   */
  setupLazyLoading(observer) {
    // Lazy load sections
    document.querySelectorAll(".section-content").forEach((section) => {
      observer.observe(section);
    });

    // Lazy load calculator cards
    document.querySelectorAll(".calculator").forEach((card) => {
      observer.observe(card);
    });
  }

  /**
   * Optimize element visibility
   * @param {Element} element - Element becoming visible
   */
  optimizeElementVisibility(element) {
    // Initialize complex calculations only when needed
    if (element.classList.contains("calculator")) {
      this.initializeCalculatorFeatures(element);
    }

    // Load charts only when section is visible
    if (element.id === "advanced-content") {
      this.loadAdvancedFeatures();
    }
  }

  /**
   * Initialize calculator features
   * @param {Element} calculator - Calculator element
   */
  initializeCalculatorFeatures(calculator) {
    const calculatorId = calculator.id;

    // Load features on demand
    switch (calculatorId) {
      case "analyticsCard":
        this.loadAnalyticsFeatures();
        break;
      case "liveMonitorCard":
        this.loadLiveMonitorFeatures();
        break;
      case "trainingIntelligenceCard":
        this.loadIntelligenceFeatures();
        break;
    }
  }

  /**
   * Load analytics features
   */
  loadAnalyticsFeatures() {
    if (!window.optimizeVolumeLandmarks) {
      import("/js/algorithms/analytics.js").then((module) => {
        console.log("📊 Analytics features loaded");
      });
    }
  }

  /**
   * Load live monitor features
   */
  loadLiveMonitorFeatures() {
    if (!window.liveMonitor) {
      import("/js/algorithms/livePerformance.js").then((module) => {
        console.log("⚡ Live monitor features loaded");
      });
    }
  }

  /**
   * Load intelligence features
   */
  loadIntelligenceFeatures() {
    if (!window.advancedIntelligence) {
      import("/js/algorithms/intelligenceHub.js").then((module) => {
        console.log("🧠 Intelligence features loaded");
      });
    }
  }

  /**
   * Load advanced features
   */
  loadAdvancedFeatures() {
    // Dynamically import Chart.js when advanced section is opened
    if (!window.Chart) {
      import("chart.js/auto")
        .then((module) => {
          window.Chart = module.default;
          console.log("📈 Chart.js loaded on demand");
          this.initializeCharts();
        })
        .catch((err) => console.error("Failed to load Chart.js", err));
    }
  }

  /**
   * Optimize DOM changes
   * @param {MutationRecord[]} mutations - DOM mutations
   */
  optimizeDOMChanges(mutations) {
    let hasStyleChanges = false;
    let hasContentChanges = false;

    mutations.forEach((mutation) => {
      if (
        mutation.type === "attributes" &&
        (mutation.attributeName === "style" ||
          mutation.attributeName === "class")
      ) {
        hasStyleChanges = true;
      } else if (mutation.type === "childList") {
        hasContentChanges = true;
      }
    });

    // Batch style changes
    if (hasStyleChanges) {
      this.batchStyleUpdates();
    }

    // Optimize content changes
    if (hasContentChanges) {
      this.optimizeContentUpdates();
    }
  }

  /**
   * Batch style updates
   */
  batchStyleUpdates() {
    // Use requestAnimationFrame to batch style changes
    if (!this.styleUpdateScheduled) {
      this.styleUpdateScheduled = true;

      requestAnimationFrame(() => {
        // Apply any pending style optimizations
        this.applyStyleOptimizations();
        this.styleUpdateScheduled = false;
      });
    }
  }

  /**
   * Handle memory pressure
   * @param {Object} usage - Memory usage data
   */
  handleMemoryPressure(usage) {
    console.warn("🚨 High memory usage detected:", usage);

    // Clear old data
    this.clearOldMetrics();

    // Garbage collect if possible
    if (window.gc) {
      window.gc();
    }

    // Notify user if memory is critical
    if (usage.used > this.thresholds.memoryLimit * 1.5) {
      this.showMemoryWarning();
    }
  }

  /**
   * Report performance issue
   * @param {string} type - Issue type
   * @param {Object} data - Issue data
   */
  reportPerformanceIssue(type, data) {
    console.warn(`⚠️ Performance issue detected: ${type}`, data);

    // Store for analytics
    const issue = {
      type,
      timestamp: Date.now(),
      data,
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    const issues = JSON.parse(
      localStorage.getItem("performance-issues") || "[]",
    );
    issues.push(issue);

    // Keep only last 50 issues
    if (issues.length > 50) {
      issues.splice(0, issues.length - 50);
    }

    localStorage.setItem("performance-issues", JSON.stringify(issues));
  }

  /**
   * Generate performance report
   * @returns {Object} - Performance report
   */
  generatePerformanceReport() {
    const currentTime = Date.now();
    const lastHour = currentTime - 60 * 60 * 1000;

    // Filter recent metrics
    const recentLoadTimes = this.metrics.loadTimes.filter(
      (m) => m.timestamp > lastHour,
    );
    const recentMemory = this.metrics.memoryUsage.filter(
      (m) => m.timestamp > lastHour,
    );
    const recentInteractions = this.metrics.userInteractions.filter(
      (m) => m.timestamp > lastHour,
    );
    const recentErrors = this.metrics.errors.filter(
      (m) => m.timestamp > lastHour,
    );

    return {
      timestamp: currentTime,
      performance: {
        averageLoadTime: this.calculateAverage(recentLoadTimes, "loadTime"),
        averageRenderTime: this.calculateAverage(recentLoadTimes, "renderTime"),
        slowestLoad: Math.max(...recentLoadTimes.map((m) => m.loadTime), 0),
        loadTimeP95: this.calculatePercentile(
          recentLoadTimes.map((m) => m.loadTime),
          95,
        ),
      },
      memory: {
        currentUsage: recentMemory[recentMemory.length - 1]?.used || 0,
        peakUsage: Math.max(...recentMemory.map((m) => m.used), 0),
        averageUsage: this.calculateAverage(recentMemory, "used"),
      },
      interactions: {
        totalInteractions: recentInteractions.length,
        averageDelay: this.calculateAverage(recentInteractions, "delay"),
        slowInteractions: recentInteractions.filter(
          (i) => i.delay > this.thresholds.interactionDelay,
        ).length,
      },
      errors: {
        totalErrors: recentErrors.length,
        errorTypes: this.categorizeErrors(recentErrors),
      },
      recommendations: this.generateRecommendations(),
    };
  }

  /**
   * Generate performance recommendations
   * @returns {Array} - Performance recommendations
   */
  generateRecommendations() {
    const recommendations = [];
    const report = this.metrics;

    // Load time recommendations
    const avgLoadTime = this.calculateAverage(report.loadTimes, "loadTime");
    if (avgLoadTime > this.thresholds.loadTime) {
      recommendations.push({
        type: "load_time",
        priority: "high",
        message: "Page load time is above optimal threshold",
        suggestion:
          "Consider enabling service worker caching and optimizing resource loading",
      });
    }

    // Memory recommendations
    const currentMemory = report.memoryUsage[report.memoryUsage.length - 1];
    if (
      currentMemory &&
      currentMemory.used > this.thresholds.memoryLimit * 0.8
    ) {
      recommendations.push({
        type: "memory",
        priority: "medium",
        message: "Memory usage is approaching limits",
        suggestion: "Clear old data and optimize data structures",
      });
    }

    // Interaction recommendations
    const slowInteractions = report.userInteractions.filter(
      (i) => i.delay > this.thresholds.interactionDelay,
    );
    if (slowInteractions.length > 5) {
      recommendations.push({
        type: "interactions",
        priority: "medium",
        message: "Multiple slow user interactions detected",
        suggestion: "Optimize event handlers and consider debouncing",
      });
    }

    return recommendations;
  }

  /**
   * Optimize images
   */
  optimizeImages() {
    const images = document.querySelectorAll("img");
    images.forEach((img) => {
      // Add loading="lazy" for non-critical images
      if (!img.hasAttribute("loading")) {
        img.loading = "lazy";
      }

      // Add proper sizing attributes
      if (!img.hasAttribute("width") || !img.hasAttribute("height")) {
        img.style.width = "auto";
        img.style.height = "auto";
      }
    });
  }
  /**
   * Setup service worker
  */ setupServiceWorker() {
    const isLocal = ["localhost", "127.0.0.1"].includes(location.hostname);

    if (isLocal && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .getRegistrations()
        .then((regs) => regs.forEach((r) => r.unregister()));
    }

    if (isLocal) return;

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register(new URL("../../sw.js", import.meta.url))
        .then(() => {
          console.log("✅ Service Worker registered");
        })
        .catch((error) => {
          console.warn("❌ Service Worker registration failed:", error);
        });
    }
  }

  // Utility methods
  calculateAverage(array, property) {
    if (array.length === 0) return 0;
    const sum = array.reduce((acc, item) => acc + (item[property] || 0), 0);
    return sum / array.length;
  }

  calculatePercentile(array, percentile) {
    if (array.length === 0) return 0;
    const sorted = array.sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[index] || 0;
  }

  categorizeErrors(errors) {
    const categories = {};
    errors.forEach((error) => {
      const type = error.type || "runtime";
      categories[type] = (categories[type] || 0) + 1;
    });
    return categories;
  }

  clearOldMetrics() {
    const oneHourAgo = Date.now() - 60 * 60 * 1000;

    this.metrics.loadTimes = this.metrics.loadTimes.filter(
      (m) => m.timestamp > oneHourAgo,
    );
    this.metrics.userInteractions = this.metrics.userInteractions.filter(
      (m) => m.timestamp > oneHourAgo,
    );
    this.metrics.errors = this.metrics.errors.filter(
      (m) => m.timestamp > oneHourAgo,
    );
  }

  showMemoryWarning() {
    if (!document.querySelector(".memory-warning")) {
      const warning = document.createElement("div");
      warning.className = "memory-warning";
      warning.innerHTML = `
        <div style="background: #fef3c7; color: #92400e; padding: 10px; border-radius: 8px; margin: 10px; border: 1px solid #f59e0b;">
          ⚠️ High memory usage detected. Consider refreshing the page for optimal performance.
          <button onclick="location.reload()" style="margin-left: 10px; padding: 5px 10px; background: #f59e0b; color: white; border: none; border-radius: 4px; cursor: pointer;">Refresh</button>
        </div>
      `;
      document.body.appendChild(warning);

      setTimeout(() => warning.remove(), 10000);
    }
  }

  applyStyleOptimizations() {
    // Consolidate similar style changes
    // Remove unused CSS classes
    // Optimize animation performance
  }

  optimizeContentUpdates() {
    // Batch DOM updates
    // Minimize reflows and repaints
  }

  initializeCharts() {
    // Initialize charts with performance optimization
    if (window.Chart) {
      Chart.defaults.animation.duration = 300; // Faster animations
      Chart.defaults.responsive = true;
      Chart.defaults.maintainAspectRatio = false;
    }
  }

  suggestResourceOptimization(timing) {
    console.log(`💡 Optimization suggestion for ${timing.name}:`, {
      duration: timing.responseEnd - timing.requestStart,
      suggestion: "Consider caching or CDN optimization",
    });
  }

  optimizeChartLoading(timing) {
    console.log("📈 Optimizing Chart.js loading based on timing:", timing);
  }

  reportInteractionDelay(event, delay) {
    console.warn(`🐌 Slow interaction detected:`, {
      type: event.type,
      target: event.target,
      delay: `${delay}ms`,
    });
  }

  updatePerformanceDashboard(metrics) {
    // Update performance indicators in UI
    const perfIndicator = document.getElementById("performance-indicator");
    if (perfIndicator) {
      const status = metrics.loadTime < this.thresholds.loadTime ? "🟢" : "🟡";
      perfIndicator.textContent = status;
    }
  }
}

// Create singleton instance
const performanceManager = new PerformanceManager();

// Auto-initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    performanceManager.initialize();
  });
} else {
  performanceManager.initialize();
}

export { PerformanceManager, performanceManager };
