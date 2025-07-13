/**
 * Advanced Data Export & Backup System
 * Provides comprehensive data export, import, and backup capabilities
 */

import trainingState from "../core/trainingState.js";

/**
 * Data Export Manager Class
 * Handles all data export, import, and backup operations
 */
class DataExportManager {
  constructor() {
    this.exportFormats = ["json", "csv", "excel"];
    this.compressionEnabled = true;
    this.encryptionEnabled = false; // Future enhancement
  }

  /**
   * Export all training data
   * @param {string} format - Export format (json, csv, excel)
   * @param {Object} options - Export options
   * @returns {Object} - Export result
   */
  exportAllData(format = "json", options = {}) {
    const {
      includePersonalData = true,
      includeAnalytics = true,
      includeWellness = true,
      dateRange = null,
      compress = this.compressionEnabled,
    } = options;

    try {
      const exportData = this.gatherExportData({
        includePersonalData,
        includeAnalytics,
        includeWellness,
        dateRange,
      });

      switch (format.toLowerCase()) {
        case "json":
          return this.exportAsJSON(exportData, compress);
        case "csv":
          return this.exportAsCSV(exportData);
        case "excel":
          return this.exportAsExcel(exportData);
        default:
          throw new Error(`Unsupported export format: ${format}`);
      }
    } catch (error) {
      console.error("Export failed:", error);
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Gather all data for export
   * @param {Object} options - Data gathering options
   * @returns {Object} - Comprehensive data object
   */
  gatherExportData(options) {
    const {
      includePersonalData,
      includeAnalytics,
      includeWellness,
      dateRange,
    } = options;

    const exportData = {
      metadata: {
        exportDate: new Date().toISOString(),
        appVersion: "2.0.0",
        exportType: "full",
        dataPoints: 0,
      },
      trainingState: null,
      sessionHistory: [],
      feedback: [],
      analytics: null,
      wellness: null,
      preferences: null,
    };

    // Core training state
    if (includePersonalData) {
      exportData.trainingState = this.serializeTrainingState();
      exportData.preferences = this.gatherUserPreferences();
    }

    // Session history
    exportData.sessionHistory = this.gatherSessionHistory(dateRange);

    // Feedback data
    exportData.feedback = this.gatherFeedbackData(dateRange);

    // Analytics data
    if (includeAnalytics) {
      exportData.analytics = this.gatherAnalyticsData(dateRange);
    }

    // Wellness data
    if (includeWellness) {
      exportData.wellness = this.gatherWellnessData(dateRange);
    }

    // Calculate data points
    exportData.metadata.dataPoints = this.calculateDataPoints(exportData);

    return exportData;
  }

  /**
   * Serialize training state
   * @returns {Object} - Serialized training state
   */
  serializeTrainingState() {
    return {
      volumeLandmarks: trainingState.volumeLandmarks,
      currentSets: trainingState.currentSets,
      weekNo: trainingState.weekNo,
      blockNo: trainingState.blockNo,
      deloadWeeks: trainingState.deloadWeeks,
      targetRIR: trainingState.getTargetRIR(),
      currentPhase: trainingState.getCurrentPhase(),
      stateHistory: trainingState.getStateHistory(),
      totalMusclesNeedingRecovery: trainingState.totalMusclesNeedingRecovery,
      recoverySessionsThisWeek: trainingState.recoverySessionsThisWeek,
    };
  }

  /**
   * Gather session history
   * @param {Object} dateRange - Date range filter
   * @returns {Array} - Session history data
   */
  gatherSessionHistory(dateRange) {
    const sessions = [];

    // Gather all session data from localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("session-")) {
        try {
          const sessionData = JSON.parse(localStorage.getItem(key));
          if (this.isWithinDateRange(sessionData.timestamp, dateRange)) {
            sessions.push({
              sessionId: key,
              ...sessionData,
            });
          }
        } catch (error) {
          console.warn(`Failed to parse session data: ${key}`, error);
        }
      }
    }

    return sessions.sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
    );
  }

  /**
   * Gather feedback data
   * @param {Object} dateRange - Date range filter
   * @returns {Array} - Feedback data
   */
  gatherFeedbackData(dateRange) {
    const feedback = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("feedback-")) {
        try {
          const feedbackData = JSON.parse(localStorage.getItem(key));
          if (this.isWithinDateRange(feedbackData.timestamp, dateRange)) {
            feedback.push({
              feedbackId: key,
              ...feedbackData,
            });
          }
        } catch (error) {
          console.warn(`Failed to parse feedback data: ${key}`, error);
        }
      }
    }

    return feedback.sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
    );
  }

  /**
   * Gather analytics data
   * @param {Object} dateRange - Date range filter
   * @returns {Object} - Analytics data
   */
  gatherAnalyticsData(dateRange) {
    const analytics = {
      volumeOptimizations: [],
      deloadPredictions: [],
      plateauAnalyses: [],
      performanceMetrics: [],
    };

    // Gather analytics data from localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (
        key &&
        (key.startsWith("analytics-") || key.startsWith("optimization-"))
      ) {
        try {
          const analyticsData = JSON.parse(localStorage.getItem(key));
          if (this.isWithinDateRange(analyticsData.timestamp, dateRange)) {
            if (key.includes("volume")) {
              analytics.volumeOptimizations.push(analyticsData);
            } else if (key.includes("deload")) {
              analytics.deloadPredictions.push(analyticsData);
            } else if (key.includes("plateau")) {
              analytics.plateauAnalyses.push(analyticsData);
            }
          }
        } catch (error) {
          console.warn(`Failed to parse analytics data: ${key}`, error);
        }
      }
    }

    return analytics;
  }

  /**
   * Gather wellness data
   * @param {Object} dateRange - Date range filter
   * @returns {Array} - Wellness data
   */
  gatherWellnessData(dateRange) {
    const wellness = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("wellness-")) {
        try {
          const wellnessData = JSON.parse(localStorage.getItem(key));
          if (this.isWithinDateRange(wellnessData.date, dateRange)) {
            wellness.push(wellnessData);
          }
        } catch (error) {
          console.warn(`Failed to parse wellness data: ${key}`, error);
        }
      }
    }

    return wellness.sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  /**
   * Gather user preferences
   * @returns {Object} - User preferences
   */
  gatherUserPreferences() {
    return {
      theme: localStorage.getItem("user-theme") || "dark",
      units: localStorage.getItem("user-units") || "metric",
      notifications: localStorage.getItem("user-notifications") || "enabled",
      autoProgression:
        localStorage.getItem("user-auto-progression") || "enabled",
      analyticsEnabled: localStorage.getItem("analytics-enabled") || "true",
    };
  }

  /**
   * Export as JSON
   * @param {Object} data - Data to export
   * @param {boolean} compress - Whether to compress
   * @returns {Object} - Export result
   */
  exportAsJSON(data, compress = false) {
    try {
      const jsonString = JSON.stringify(data, null, compress ? 0 : 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const filename = `powerhouseatx-backup-${this.getDateString()}.json`;

      this.downloadBlob(blob, filename);

      return {
        success: true,
        filename,
        size: blob.size,
        format: "JSON",
        dataPoints: data.metadata.dataPoints,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new Error(`JSON export failed: ${error.message}`);
    }
  }

  /**
   * Export as CSV
   * @param {Object} data - Data to export
   * @returns {Object} - Export result
   */
  exportAsCSV(data) {
    try {
      const csvData = this.convertToCSV(data);
      const blob = new Blob([csvData], { type: "text/csv" });
      const filename = `powerhouseatx-data-${this.getDateString()}.csv`;

      this.downloadBlob(blob, filename);

      return {
        success: true,
        filename,
        size: blob.size,
        format: "CSV",
        dataPoints: data.metadata.dataPoints,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new Error(`CSV export failed: ${error.message}`);
    }
  }

  /**
   * Convert data to CSV format
   * @param {Object} data - Data to convert
   * @returns {string} - CSV string
   */
  convertToCSV(data) {
    let csv = "";

    // Sessions CSV
    if (data.sessionHistory.length > 0) {
      csv += "SESSION DATA\n";
      csv += "Date,Muscle,Exercise,Sets,Reps,Weight,RIR,Performance,Duration\n";

      data.sessionHistory.forEach((session) => {
        csv += `${session.timestamp},${session.muscle || ""},${session.exercise || ""},${session.sets || ""},${session.reps || ""},${session.weight || ""},${session.rir || ""},${session.performance || ""},${session.duration || ""}\n`;
      });
      csv += "\n";
    }

    // Feedback CSV
    if (data.feedback.length > 0) {
      csv += "FEEDBACK DATA\n";
      csv +=
        "Date,Muscle,Current Sets,MMC,Pump,Workload,Performance,Soreness,Recommendation\n";

      data.feedback.forEach((feedback) => {
        csv += `${feedback.timestamp},${feedback.muscle},${feedback.currentSets},${feedback.stimulus?.mmc || ""},${feedback.stimulus?.pump || ""},${feedback.stimulus?.disruption || ""},${feedback.performance},${feedback.soreness},${feedback.results?.recommendedAction?.advice || ""}\n`;
      });
      csv += "\n";
    }

    // Wellness CSV
    if (data.wellness && data.wellness.length > 0) {
      csv += "WELLNESS DATA\n";
      csv +=
        "Date,Recovery Score,Readiness Score,Sleep Duration,Sleep Quality,Stress Level\n";

      data.wellness.forEach((wellness) => {
        csv += `${wellness.date},${wellness.recoveryScore},${wellness.readinessScore},${wellness.sleep?.duration || ""},${wellness.sleep?.quality || ""},${wellness.stress?.overall || ""}\n`;
      });
    }

    return csv;
  }

  /**
   * Import data from file
   * @param {File} file - File to import
   * @param {Object} options - Import options
   * @returns {Promise} - Import result
   */
  async importData(file, options = {}) {
    const { overwrite = false, merge = true } = options;

    try {
      const fileContent = await this.readFile(file);
      let importData;

      if (file.name.endsWith(".json")) {
        importData = JSON.parse(fileContent);
      } else if (file.name.endsWith(".csv")) {
        importData = this.parseCSV(fileContent);
      } else {
        throw new Error("Unsupported file format");
      }

      return this.processImportData(importData, { overwrite, merge });
    } catch (error) {
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Process imported data
   * @param {Object} data - Imported data
   * @param {Object} options - Processing options
   * @returns {Object} - Processing result
   */
  processImportData(data, options) {
    const { overwrite, merge } = options;
    const result = {
      success: true,
      imported: {
        trainingState: false,
        sessions: 0,
        feedback: 0,
        wellness: 0,
        analytics: 0,
      },
      warnings: [],
      errors: [],
    };

    try {
      // Import training state
      if (data.trainingState) {
        if (overwrite || !trainingState.hasData()) {
          this.importTrainingState(data.trainingState);
          result.imported.trainingState = true;
        } else if (merge) {
          this.mergeTrainingState(data.trainingState);
          result.imported.trainingState = true;
          result.warnings.push("Training state merged with existing data");
        }
      }

      // Import session history
      if (data.sessionHistory) {
        result.imported.sessions = this.importSessionHistory(
          data.sessionHistory,
          overwrite,
        );
      }

      // Import feedback
      if (data.feedback) {
        result.imported.feedback = this.importFeedback(
          data.feedback,
          overwrite,
        );
      }

      // Import wellness
      if (data.wellness) {
        result.imported.wellness = this.importWellness(
          data.wellness,
          overwrite,
        );
      }

      // Import analytics
      if (data.analytics) {
        result.imported.analytics = this.importAnalytics(
          data.analytics,
          overwrite,
        );
      }

      result.timestamp = new Date().toISOString();
      return result;
    } catch (error) {
      result.success = false;
      result.errors.push(error.message);
      return result;
    }
  }

  /**
   * Create automatic backup
   * @returns {Object} - Backup result
   */
  createAutoBackup() {
    const backupData = this.gatherExportData({
      includePersonalData: true,
      includeAnalytics: true,
      includeWellness: true,
    });

    // Store in localStorage as compressed backup
    const backupKey = `backup-${this.getDateString()}`;
    const compressedData = JSON.stringify(backupData);

    try {
      localStorage.setItem(backupKey, compressedData);

      // Clean old backups (keep last 5)
      this.cleanOldBackups();

      return {
        success: true,
        backupKey,
        size: compressedData.length,
        dataPoints: backupData.metadata.dataPoints,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Get available backups
   * @returns {Array} - List of available backups
   */
  getAvailableBackups() {
    const backups = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("backup-")) {
        try {
          const backupData = localStorage.getItem(key);
          const metadata = JSON.parse(backupData).metadata;

          backups.push({
            key,
            date: metadata.exportDate,
            dataPoints: metadata.dataPoints,
            size: backupData.length,
          });
        } catch (error) {
          console.warn(`Failed to parse backup: ${key}`, error);
        }
      }
    }

    return backups.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  /**
   * Restore from backup
   * @param {string} backupKey - Backup key
   * @returns {Object} - Restore result
   */
  restoreFromBackup(backupKey) {
    try {
      const backupData = localStorage.getItem(backupKey);
      if (!backupData) {
        throw new Error("Backup not found");
      }

      const data = JSON.parse(backupData);
      return this.processImportData(data, { overwrite: true, merge: false });
    } catch (error) {
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  // Utility methods
  isWithinDateRange(date, dateRange) {
    if (!dateRange) return true;
    const checkDate = new Date(date);
    const startDate = dateRange.start ? new Date(dateRange.start) : null;
    const endDate = dateRange.end ? new Date(dateRange.end) : null;

    if (startDate && checkDate < startDate) return false;
    if (endDate && checkDate > endDate) return false;
    return true;
  }

  calculateDataPoints(data) {
    return (
      (data.sessionHistory?.length || 0) +
      (data.feedback?.length || 0) +
      (data.wellness?.length || 0) +
      (data.analytics?.volumeOptimizations?.length || 0) +
      (data.analytics?.deloadPredictions?.length || 0)
    );
  }

  getDateString() {
    return new Date().toISOString().split("T")[0];
  }

  downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  readFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(new Error("Failed to read file"));
      reader.readAsText(file);
    });
  }

  cleanOldBackups() {
    const backups = this.getAvailableBackups();
    if (backups.length > 5) {
      const toDelete = backups.slice(5);
      toDelete.forEach((backup) => {
        localStorage.removeItem(backup.key);
      });
    }
  }

  importTrainingState(stateData) {
    Object.keys(stateData.volumeLandmarks).forEach((muscle) => {
      trainingState.updateVolumeLandmarks(
        muscle,
        stateData.volumeLandmarks[muscle],
      );
    });

    Object.keys(stateData.currentSets).forEach((muscle) => {
      trainingState.setSets(muscle, stateData.currentSets[muscle]);
    });

    trainingState.weekNo = stateData.weekNo;
    trainingState.blockNo = stateData.blockNo;
  }

  importSessionHistory(sessions, overwrite) {
    let imported = 0;
    sessions.forEach((session) => {
      const key =
        session.sessionId || `session-imported-${Date.now()}-${imported}`;
      if (overwrite || !localStorage.getItem(key)) {
        localStorage.setItem(key, JSON.stringify(session));
        imported++;
      }
    });
    return imported;
  }

  importFeedback(feedback, overwrite) {
    let imported = 0;
    feedback.forEach((item) => {
      const key =
        item.feedbackId || `feedback-imported-${Date.now()}-${imported}`;
      if (overwrite || !localStorage.getItem(key)) {
        localStorage.setItem(key, JSON.stringify(item));
        imported++;
      }
    });
    return imported;
  }

  importWellness(wellness, overwrite) {
    let imported = 0;
    wellness.forEach((item) => {
      const key = `wellness-${item.date}`;
      if (overwrite || !localStorage.getItem(key)) {
        localStorage.setItem(key, JSON.stringify(item));
        imported++;
      }
    });
    return imported;
  }

  importAnalytics(analytics, overwrite) {
    let imported = 0;
    // Implementation would depend on analytics data structure
    return imported;
  }
}

// Create singleton instance
const dataExportManager = new DataExportManager();

export { DataExportManager, dataExportManager };
