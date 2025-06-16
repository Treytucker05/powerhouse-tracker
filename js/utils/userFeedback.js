/**
 * User Feedback & Analytics Collection System
 * Gathers user feedback and usage analytics to improve the training system
 */

import trainingState from "../core/trainingState.js";

/**
 * User Feedback Manager Class
 * Handles feedback collection, analysis, and improvement suggestions
 */
class UserFeedbackManager {
  constructor() {
    this.feedbackCategories = [
      "usability",
      "accuracy",
      "features",
      "performance",
      "mobile",
      "suggestions",
    ];
    this.analyticsEnabled = true;
    this.privacyMode = true; // No personal data collected
  }

  /**
   * Initialize feedback system
   */
  initializeFeedbackSystem() {
    this.createFeedbackWidget();
    this.setupUsageTracking();
    this.schedulePeriodicFeedback();
  }

  /**
   * Create feedback widget
   */
  createFeedbackWidget() {
    const widget = document.createElement("div");
    widget.id = "feedback-widget";
    widget.className = "feedback-widget";
    widget.innerHTML = `
      <div class="feedback-toggle" onclick="userFeedbackManager.toggleFeedbackPanel()">
        💬 Feedback
      </div>
      <div class="feedback-panel" id="feedbackPanel" style="display: none;">
        <div class="feedback-header">
          <h3>💡 Help Improve PowerHouseATX</h3>
          <button onclick="userFeedbackManager.closeFeedbackPanel()">×</button>
        </div>
        <div class="feedback-content">
          <div class="feedback-category">
            <label>What would you like feedback on?</label>
            <select id="feedbackCategory">
              <option value="usability">💻 Ease of Use</option>
              <option value="accuracy">🎯 Recommendation Accuracy</option>
              <option value="features">✨ Features & Functionality</option>
              <option value="performance">⚡ App Performance</option>
              <option value="mobile">📱 Mobile Experience</option>
              <option value="suggestions">💡 New Feature Ideas</option>
            </select>
          </div>
          
          <div class="feedback-rating">
            <label>Overall satisfaction (1-5):</label>
            <div class="rating-stars" id="satisfactionRating">
              ${[1, 2, 3, 4, 5].map((i) => `<span class="star" data-rating="${i}">⭐</span>`).join("")}
            </div>
          </div>
          
          <div class="feedback-text">
            <label>Your feedback:</label>
            <textarea id="feedbackText" placeholder="Tell us what's working well or what could be improved..."></textarea>
          </div>
          
          <div class="feedback-usage" id="usageContext">
            <!-- Automatically populated with usage context -->
          </div>
          
          <div class="feedback-actions">
            <button onclick="userFeedbackManager.submitFeedback()" class="submit-btn">
              📤 Send Feedback
            </button>
            <button onclick="userFeedbackManager.laterReminder()" class="later-btn">
              ⏰ Remind Later
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(widget);
    this.setupFeedbackEvents();
  }

  /**
   * Setup feedback widget events
   */
  setupFeedbackEvents() {
    // Rating stars
    document.querySelectorAll(".star").forEach((star) => {
      star.addEventListener("click", (e) => {
        const rating = parseInt(e.target.dataset.rating);
        this.setRating(rating);
      });
    });
  }

  /**
   * Set rating stars
   * @param {number} rating - Rating value (1-5)
   */
  setRating(rating) {
    document.querySelectorAll(".star").forEach((star, index) => {
      if (index < rating) {
        star.style.opacity = "1";
        star.style.transform = "scale(1.2)";
      } else {
        star.style.opacity = "0.3";
        star.style.transform = "scale(1)";
      }
    });
    this.currentRating = rating;
  }

  /**
   * Toggle feedback panel
   */
  toggleFeedbackPanel() {
    const panel = document.getElementById("feedbackPanel");
    const isVisible = panel.style.display !== "none";

    if (isVisible) {
      this.closeFeedbackPanel();
    } else {
      this.openFeedbackPanel();
    }
  }

  /**
   * Open feedback panel
   */
  openFeedbackPanel() {
    const panel = document.getElementById("feedbackPanel");
    panel.style.display = "block";

    // Populate usage context
    this.populateUsageContext();

    // Track feedback panel opened
    this.trackEvent("feedback_panel_opened");
  }

  /**
   * Close feedback panel
   */
  closeFeedbackPanel() {
    const panel = document.getElementById("feedbackPanel");
    panel.style.display = "none";
  }

  /**
   * Populate usage context
   */
  populateUsageContext() {
    const context = document.getElementById("usageContext");
    const usage = this.getUsageContext();

    context.innerHTML = `
      <div class="usage-context">
        <h4>📊 Your Usage Context (helps us improve):</h4>
        <div class="context-grid">
          <div class="context-item">
            <span class="context-label">Training Week:</span>
            <span class="context-value">${usage.currentWeek}</span>
          </div>
          <div class="context-item">
            <span class="context-label">Features Used:</span>
            <span class="context-value">${usage.featuresUsed.join(", ")}</span>
          </div>
          <div class="context-item">
            <span class="context-label">Device:</span>
            <span class="context-value">${usage.deviceType}</span>
          </div>
          <div class="context-item">
            <span class="context-label">Session Count:</span>
            <span class="context-value">${usage.sessionCount}</span>
          </div>
        </div>
        <div class="privacy-note">
          🔒 No personal training data is shared - only anonymized usage patterns
        </div>
      </div>
    `;
  }

  /**
   * Get usage context
   * @returns {Object} - Usage context
   */
  getUsageContext() {
    const usage = this.getStoredUsage();

    return {
      currentWeek: trainingState.weekNo,
      currentBlock: trainingState.blockNo,
      featuresUsed: usage.featuresUsed || [],
      deviceType: this.getDeviceType(),
      sessionCount: usage.sessionCount || 0,
      lastActive: usage.lastActive || new Date().toISOString(),
      averageSessionDuration: usage.averageSessionDuration || 0,
    };
  }

  /**
   * Submit feedback
   */
  async submitFeedback() {
    const category = document.getElementById("feedbackCategory").value;
    const text = document.getElementById("feedbackText").value;
    const rating = this.currentRating || 0;

    if (!text.trim()) {
      this.showFeedbackMessage("Please provide some feedback text", "warning");
      return;
    }

    const feedback = {
      id: this.generateFeedbackId(),
      timestamp: new Date().toISOString(),
      category,
      rating,
      text: text.trim(),
      context: this.getUsageContext(),
      appVersion: "2.0.0",
      userAgent: navigator.userAgent,
    };

    try {
      const result = await this.processFeedback(feedback);

      if (result.success) {
        this.showFeedbackMessage(
          "Thank you! Your feedback helps us improve 🙏",
          "success",
        );
        this.resetFeedbackForm();

        // Auto-close after 2 seconds
        setTimeout(() => this.closeFeedbackPanel(), 2000);

        // Track successful submission
        this.trackEvent("feedback_submitted", { category, rating });
      } else {
        this.showFeedbackMessage(
          "Feedback saved locally. Thank you! 💾",
          "info",
        );
      }
    } catch (error) {
      console.error("Feedback submission error:", error);
      this.showFeedbackMessage("Feedback saved locally. Thank you! 💾", "info");
    }
  }

  /**
   * Process feedback (store locally and optionally send)
   * @param {Object} feedback - Feedback data
   * @returns {Object} - Processing result
   */
  async processFeedback(feedback) {
    // Always store locally
    const localKey = `feedback-user-${feedback.id}`;
    localStorage.setItem(localKey, JSON.stringify(feedback));

    // Store in feedback analytics
    this.updateFeedbackAnalytics(feedback);

    // In a real implementation, you might send to a server here
    // For now, we'll just process locally
    return {
      success: true,
      stored: "local",
      id: feedback.id,
    };
  }

  /**
   * Update feedback analytics
   * @param {Object} feedback - Feedback data
   */
  updateFeedbackAnalytics(feedback) {
    const analytics = this.getFeedbackAnalytics();

    // Update categories
    if (!analytics.categories[feedback.category]) {
      analytics.categories[feedback.category] = {
        count: 0,
        averageRating: 0,
        totalRating: 0,
      };
    }

    const category = analytics.categories[feedback.category];
    category.count++;
    category.totalRating += feedback.rating;
    category.averageRating = category.totalRating / category.count;

    // Update overall metrics
    analytics.totalFeedback++;
    analytics.totalRating += feedback.rating;
    analytics.averageRating = analytics.totalRating / analytics.totalFeedback;
    analytics.lastFeedback = feedback.timestamp;

    // Store updated analytics
    localStorage.setItem("feedback-analytics", JSON.stringify(analytics));
  }

  /**
   * Get feedback analytics
   * @returns {Object} - Feedback analytics
   */
  getFeedbackAnalytics() {
    const stored = localStorage.getItem("feedback-analytics");
    if (stored) {
      return JSON.parse(stored);
    }

    return {
      totalFeedback: 0,
      averageRating: 0,
      totalRating: 0,
      categories: {},
      lastFeedback: null,
      trends: [],
    };
  }

  /**
   * Setup usage tracking
   */
  setupUsageTracking() {
    // Track page loads
    this.trackEvent("app_loaded");

    // Track feature usage
    this.setupFeatureTracking();

    // Track session duration
    this.trackSessionStart();

    // Track before unload
    window.addEventListener("beforeunload", () => {
      this.trackSessionEnd();
    });
  }

  /**
   * Setup feature tracking
   */
  setupFeatureTracking() {
    // Track button clicks for major features
    const trackableButtons = [
      "submitFeedbackBtn",
      "runAutoVolumeProgression",
      "initializeIntelligence",
      "startLiveSession",
      "optimizeVolumeLandmarks",
      "predictDeloadTiming",
    ];

    trackableButtons.forEach((buttonId) => {
      const button = document.getElementById(buttonId);
      if (button) {
        button.addEventListener("click", () => {
          this.trackFeatureUsage(buttonId);
        });
      }
    });

    // Track section expansions
    document.querySelectorAll(".section-banner").forEach((banner) => {
      banner.addEventListener("click", () => {
        const sectionName = banner.textContent.trim().split(" ")[0];
        this.trackFeatureUsage(`section_${sectionName.toLowerCase()}`);
      });
    });
  }

  /**
   * Track feature usage
   * @param {string} feature - Feature name
   */
  trackFeatureUsage(feature) {
    const usage = this.getStoredUsage();

    if (!usage.featuresUsed) {
      usage.featuresUsed = [];
    }

    if (!usage.featuresUsed.includes(feature)) {
      usage.featuresUsed.push(feature);
    }

    if (!usage.featureCount) {
      usage.featureCount = {};
    }

    usage.featureCount[feature] = (usage.featureCount[feature] || 0) + 1;
    usage.lastFeatureUsed = feature;
    usage.lastActivity = new Date().toISOString();

    this.storeUsage(usage);
    this.trackEvent("feature_used", { feature });
  }

  /**
   * Track session start
   */
  trackSessionStart() {
    this.sessionStartTime = Date.now();
    this.trackEvent("session_started");
  }

  /**
   * Track session end
   */
  trackSessionEnd() {
    if (this.sessionStartTime) {
      const duration = Date.now() - this.sessionStartTime;
      const usage = this.getStoredUsage();

      usage.sessionCount = (usage.sessionCount || 0) + 1;
      usage.totalSessionTime = (usage.totalSessionTime || 0) + duration;
      usage.averageSessionDuration =
        usage.totalSessionTime / usage.sessionCount;
      usage.lastSession = new Date().toISOString();

      this.storeUsage(usage);
      this.trackEvent("session_ended", { duration });
    }
  }

  /**
   * Track event
   * @param {string} event - Event name
   * @param {Object} data - Event data
   */
  trackEvent(event, data = {}) {
    if (!this.analyticsEnabled) return;

    const eventData = {
      event,
      timestamp: new Date().toISOString(),
      data,
      sessionId: this.getSessionId(),
    };

    // Store event locally
    const events = this.getStoredEvents();
    events.push(eventData);

    // Keep only last 100 events
    if (events.length > 100) {
      events.splice(0, events.length - 100);
    }

    localStorage.setItem("usage-events", JSON.stringify(events));
  }

  /**
   * Schedule periodic feedback requests
   */
  schedulePeriodicFeedback() {
    const usage = this.getStoredUsage();
    const lastFeedbackRequest = usage.lastFeedbackRequest;
    const daysSinceLastRequest = lastFeedbackRequest
      ? (Date.now() - new Date(lastFeedbackRequest).getTime()) /
        (1000 * 60 * 60 * 24)
      : Infinity;

    // Request feedback after significant usage milestones
    if (usage.sessionCount >= 10 && daysSinceLastRequest > 7) {
      setTimeout(() => this.showFeedbackPrompt(), 30000); // After 30 seconds
    }
  }

  /**
   * Show feedback prompt
   */
  showFeedbackPrompt() {
    const usage = this.getStoredUsage();

    if (
      confirm(
        `💪 You've used PowerHouseATX for ${usage.sessionCount} sessions! Would you like to share feedback to help us improve?`,
      )
    ) {
      this.openFeedbackPanel();
    } else {
      this.laterReminder();
    }
  }

  /**
   * Later reminder
   */
  laterReminder() {
    const usage = this.getStoredUsage();
    usage.lastFeedbackRequest = new Date().toISOString();
    this.storeUsage(usage);
    this.closeFeedbackPanel();
  }

  /**
   * Generate analytics dashboard
   * @returns {Object} - Analytics dashboard data
   */
  generateAnalyticsDashboard() {
    const usage = this.getStoredUsage();
    const feedback = this.getFeedbackAnalytics();
    const events = this.getStoredEvents();

    return {
      usage: {
        totalSessions: usage.sessionCount || 0,
        averageSessionDuration: Math.round(
          (usage.averageSessionDuration || 0) / 1000 / 60,
        ), // minutes
        totalTimeSpent: Math.round((usage.totalSessionTime || 0) / 1000 / 60), // minutes
        featuresUsed: usage.featuresUsed?.length || 0,
        mostUsedFeature: this.getMostUsedFeature(usage.featureCount),
        lastActive: usage.lastActivity,
      },
      feedback: {
        totalFeedback: feedback.totalFeedback,
        averageRating: Math.round(feedback.averageRating * 10) / 10,
        categoryBreakdown: feedback.categories,
        lastFeedback: feedback.lastFeedback,
      },
      events: {
        totalEvents: events.length,
        recentEvents: events.slice(-10),
        eventTypes: this.getEventTypeBreakdown(events),
      },
      insights: this.generateInsights(usage, feedback, events),
    };
  }

  /**
   * Generate insights from analytics
   * @param {Object} usage - Usage data
   * @param {Object} feedback - Feedback data
   * @param {Array} events - Events data
   * @returns {Array} - Insights
   */
  generateInsights(usage, feedback, events) {
    const insights = [];

    // Usage insights
    if (usage.sessionCount > 20) {
      insights.push({
        type: "milestone",
        message: `🎉 Power user! You've completed ${usage.sessionCount} sessions`,
        action: "Consider sharing your experience",
      });
    }

    if (usage.averageSessionDuration > 30 * 60 * 1000) {
      // > 30 minutes
      insights.push({
        type: "usage",
        message: "⏱️ Your sessions are comprehensive and detailed",
        action: "Great attention to training detail!",
      });
    }

    // Feedback insights
    if (feedback.averageRating >= 4.5) {
      insights.push({
        type: "satisfaction",
        message: "⭐ High satisfaction rating - thank you!",
        action: "Your feedback helps us improve",
      });
    }

    // Feature usage insights
    if (
      usage.featuresUsed?.includes("analytics") ||
      usage.featuresUsed?.includes("intelligence")
    ) {
      insights.push({
        type: "advanced",
        message: "🧠 Advanced features user detected",
        action: "Perfect for the next-generation updates!",
      });
    }

    return insights;
  }

  // Utility methods
  getStoredUsage() {
    const stored = localStorage.getItem("usage-analytics");
    return stored ? JSON.parse(stored) : {};
  }

  storeUsage(usage) {
    localStorage.setItem("usage-analytics", JSON.stringify(usage));
  }

  getStoredEvents() {
    const stored = localStorage.getItem("usage-events");
    return stored ? JSON.parse(stored) : [];
  }

  getSessionId() {
    if (!this.sessionId) {
      this.sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    return this.sessionId;
  }

  getDeviceType() {
    const width = window.innerWidth;
    if (width < 768) return "Mobile";
    if (width < 1024) return "Tablet";
    return "Desktop";
  }

  getMostUsedFeature(featureCount) {
    if (!featureCount) return "None";

    const features = Object.entries(featureCount);
    if (features.length === 0) return "None";

    return features.reduce((max, current) =>
      current[1] > max[1] ? current : max,
    )[0];
  }

  getEventTypeBreakdown(events) {
    const breakdown = {};
    events.forEach((event) => {
      breakdown[event.event] = (breakdown[event.event] || 0) + 1;
    });
    return breakdown;
  }

  generateFeedbackId() {
    return `fb-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  resetFeedbackForm() {
    document.getElementById("feedbackText").value = "";
    document.getElementById("feedbackCategory").selectedIndex = 0;
    this.setRating(0);
  }

  showFeedbackMessage(message, type = "info") {
    const existingMessage = document.querySelector(".feedback-message");
    if (existingMessage) {
      existingMessage.remove();
    }

    const messageEl = document.createElement("div");
    messageEl.className = `feedback-message ${type}`;
    messageEl.textContent = message;

    const panel = document.getElementById("feedbackPanel");
    panel.appendChild(messageEl);

    setTimeout(() => messageEl.remove(), 3000);
  }
}

// CSS for feedback widget
const feedbackCSS = `
.feedback-widget {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.feedback-toggle {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 12px 20px;
  border-radius: 25px;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s ease;
}

.feedback-toggle:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.2);
}

.feedback-panel {
  position: absolute;
  bottom: 60px;
  right: 0;
  width: 400px;
  max-width: 90vw;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.feedback-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.feedback-header h3 {
  margin: 0;
  font-size: 16px;
}

.feedback-header button {
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.feedback-content {
  padding: 20px;
}

.feedback-category,
.feedback-rating,
.feedback-text {
  margin-bottom: 15px;
}

.feedback-category label,
.feedback-rating label,
.feedback-text label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #374151;
  font-size: 14px;
}

.feedback-category select,
.feedback-text textarea {
  width: 100%;
  padding: 8px 12px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s ease;
}

.feedback-category select:focus,
.feedback-text textarea:focus {
  outline: none;
  border-color: #667eea;
}

.feedback-text textarea {
  height: 80px;
  resize: vertical;
}

.rating-stars {
  display: flex;
  gap: 5px;
}

.star {
  cursor: pointer;
  font-size: 20px;
  opacity: 0.3;
  transition: all 0.2s ease;
}

.star:hover {
  opacity: 1;
  transform: scale(1.1);
}

.usage-context {
  background: #f9fafb;
  border-radius: 8px;
  padding: 15px;
  margin: 15px 0;
}

.usage-context h4 {
  margin: 0 0 10px 0;
  font-size: 14px;
  color: #374151;
}

.context-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 10px;
}

.context-item {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
}

.context-label {
  color: #6b7280;
}

.context-value {
  color: #374151;
  font-weight: 600;
}

.privacy-note {
  font-size: 12px;
  color: #6b7280;
  text-align: center;
  margin-top: 10px;
}

.feedback-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.submit-btn {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  flex: 1;
  transition: all 0.2s ease;
}

.submit-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.later-btn {
  background: #f3f4f6;
  color: #6b7280;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.2s ease;
}

.later-btn:hover {
  background: #e5e7eb;
}

.feedback-message {
  position: absolute;
  bottom: 10px;
  left: 20px;
  right: 20px;
  padding: 10px 15px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
}

.feedback-message.success {
  background: #d1fae5;
  color: #065f46;
  border: 1px solid #10b981;
}

.feedback-message.info {
  background: #dbeafe;
  color: #1e40af;
  border: 1px solid #3b82f6;
}

.feedback-message.warning {
  background: #fef3c7;
  color: #92400e;
  border: 1px solid #f59e0b;
}

@media (max-width: 768px) {
  .feedback-panel {
    width: 350px;
  }
  
  .context-grid {
    grid-template-columns: 1fr;
  }
}
`;

// Inject CSS
const style = document.createElement("style");
style.textContent = feedbackCSS;
document.head.appendChild(style);

// Create singleton instance
const userFeedbackManager = new UserFeedbackManager();

export { UserFeedbackManager, userFeedbackManager };
